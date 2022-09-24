package main

import (
	"bytes"
	"fmt"
	"github.com/motzel/go-bsor/bsor"
	"github.com/motzel/go-bsor/bsor/buffer"
	wails "github.com/wailsapp/wails/v2/pkg/runtime"
	"io/fs"
	"io/ioutil"
	"os"
	"path/filepath"
	"regexp"
	"runtime"
	"strconv"
	"strings"
	"sync"
)

func (app *App) GetCwd() (string, error) {
	return os.Getwd()
}

func (app *App) LoadReplay(fileName string) (*bsor.ReplayEventsWithStats, error) {
	file, err := os.Open(fileName)
	if err != nil {
		return nil, fmt.Errorf("can not open replay: %v", err)
	}

	defer file.Close()

	fileInfo, err := file.Stat()
	if err != nil {
		return nil, fmt.Errorf("can not get replay size: %v", err)
	}

	if fileInfo.IsDir() {
		return nil, fmt.Errorf("%v is a directory", fileName)
	}

	buf := bytes.NewBuffer(make([]byte, 0, fileInfo.Size()))
	_, err = buf.ReadFrom(file)
	if err != nil {
		return nil, fmt.Errorf("can not read replay: %v", err)
	}
	reader := bytes.NewReader(buf.Bytes())

	var replay *bsor.Replay
	if replay, err = bsor.Read(reader); err != nil {
		return nil, fmt.Errorf("replay decode error: %v", err)
	}

	replayEvents := bsor.NewReplayEvents(replay)

	return bsor.NewReplayEventsWithStats(replayEvents), nil
}

type HandStat struct {
	AccCut         buffer.Stats[bsor.CutValue]   `json:"accCut"`
	BeforeCut      buffer.Stats[bsor.CutValue]   `json:"beforeCut"`
	AfterCut       buffer.Stats[bsor.CutValue]   `json:"afterCut"`
	Score          buffer.Stats[bsor.CutValue]   `json:"score"`
	TimeDependence buffer.Stats[bsor.SwingValue] `json:"timeDependence"`
	PreSwing       buffer.Stats[bsor.SwingValue] `json:"preSwing"`
	PostSwing      buffer.Stats[bsor.SwingValue] `json:"postSwing"`
	Notes          bsor.Counter                  `json:"notes"`
	Misses         bsor.Counter                  `json:"misses"`
	BadCuts        bsor.Counter                  `json:"badCuts"`
	BombHits       bsor.Counter                  `json:"bombHits"`
	MaxCombo       bsor.Counter                  `json:"maxCombo"`
}

func NewHandStat(bsorHandStat *bsor.HandStat) *HandStat {
	return &HandStat{
		AccCut:         bsorHandStat.AccCut,
		BeforeCut:      bsorHandStat.BeforeCut,
		AfterCut:       bsorHandStat.AfterCut,
		Score:          bsorHandStat.Score,
		TimeDependence: bsorHandStat.TimeDependence,
		PreSwing:       bsorHandStat.PreSwing,
		PostSwing:      bsorHandStat.PostSwing,
		Notes:          bsorHandStat.Notes,
		Misses:         bsorHandStat.Misses,
		BadCuts:        bsorHandStat.BadCuts,
		BombHits:       bsorHandStat.BombHits,
		MaxCombo:       bsorHandStat.MaxCombo,
	}
}

type Stats struct {
	Left  HandStat `json:"left"`
	Right HandStat `json:"right"`
	Total HandStat `json:"total"`
}

func NewStats(bsorStats *bsor.Stats) *Stats {
	return &Stats{
		Left:  *NewHandStat(&bsorStats.Left),
		Right: *NewHandStat(&bsorStats.Right),
		Total: *NewHandStat(&bsorStats.Total),
	}
}

type Info struct {
	bsor.ReplayEventsInfo
	WallHits bsor.Counter `json:"wallHits"`
	Pauses   bsor.Counter `json:"pauses"`
}

func NewInfo(events *bsor.ReplayEventsWithStats) *Info {
	return &Info{
		ReplayEventsInfo: events.Info,
		WallHits:         len(events.Walls),
		Pauses:           len(events.Pauses),
	}
}

type ReplayItem struct {
	Dir      string  `json:"dir"`
	Filename string  `json:"filename"`
	Info     *Info   `json:"info"`
	Stats    *Stats  `json:"stats"`
	Error    *string `json:"error"`
}

type IndexProgress struct {
	Count          int        `json:"count"`
	Length         int        `json:"length"`
	ProcessedFiles []string   `json:"processedFiles"`
	mu             sync.Mutex `json:"-"`
}

func (idx *IndexProgress) Add(item *ReplayItem) *IndexProgress {
	idx.mu.Lock()
	defer idx.mu.Unlock()

	idx.ProcessedFiles = append(idx.ProcessedFiles, item.Filename)

	return idx
}

func (idx *IndexProgress) Processed(item *ReplayItem) *IndexProgress {
	idx.mu.Lock()
	defer idx.mu.Unlock()

	idx.Count++

	return idx
}

func fileNameWithoutExt(fileName string) string {
	return strings.TrimSuffix(filepath.Base(fileName), filepath.Ext(fileName))
}

func RenameBsorFile(dir string, file fs.FileInfo) (string, error) {
	src := filepath.Join(dir, file.Name())

	r, _ := regexp.Compile("(_\\d+)+$")
	fileNameNoExt := fileNameWithoutExt(file.Name())

	if r.MatchString(fileNameNoExt) {
		// suffix already added
		return file.Name(), nil
	}

	fileNameWithoutSuffix := r.ReplaceAllString(fileNameNoExt, "")

	newFileName := fileNameWithoutSuffix + "_" + strconv.FormatInt(file.ModTime().Unix(), 10) + ".bsor"

	dst := filepath.Join(dir, newFileName)

	if err := os.Rename(src, dst); err != nil {
		return "", err
	}

	return newFileName, nil
}

func (app *App) IndexReplays() ([]ReplayItem, error) {
	// TODO: add support for other directories: app.config.OtherDirs() and ReplaysDir()/Download
	dir := app.config.ReplaysDir()

	wails.LogInfof(app.ctx, "Reading directory: %v", dir)

	files, err := ioutil.ReadDir(dir)
	if err != nil {
		return nil, err
	}

	parallel := runtime.NumCPU()

	jobs := make(chan *ReplayItem, parallel)
	results := make(chan *ReplayItem, parallel)
	done := make(chan bool)

	bsorFiles := make([]ReplayItem, 0, len(files))

	for _, file := range files {
		inputFilename := filepath.Join(dir, file.Name())

		if file.IsDir() || strings.ToLower(filepath.Ext(inputFilename)) != ".bsor" {
			continue
		}

		var newFileName string
		if newFileName, err = RenameBsorFile(dir, file); err != nil {
			newFileName = file.Name()
		}

		bsorFiles = append(bsorFiles, ReplayItem{Filename: newFileName, Dir: dir})
	}

	wails.LogInfof(app.ctx, "%v BSOR files(s) found", len(bsorFiles))

	progress := IndexProgress{Length: len(bsorFiles), ProcessedFiles: make([]string, 0, len(bsorFiles))}
	wails.EventsEmit(app.ctx, "indexing", progress)

	wails.LogInfof(app.ctx, "Starting replays indexing using %v CPU cores", parallel)

	// jobs producer
	go func() {
		for i := range bsorFiles {
			jobs <- &bsorFiles[i]
		}
		close(jobs)
	}()

	// results receiver
	go func(done chan bool) {
		for item := range results {
			wails.EventsEmit(app.ctx, "indexing", progress.Processed(item))
		}
		done <- true
	}(done)

	// create worker pool
	var wg sync.WaitGroup
	for i := 0; i < parallel; i++ {
		wg.Add(1)

		// worker
		go func(wg *sync.WaitGroup) {
			defer wg.Done()

			for job := range jobs {
				inputFilename := filepath.Join(job.Dir, job.Filename)

				wails.EventsEmit(app.ctx, "indexing", progress.Add(job))

				if replay, err := app.LoadReplay(inputFilename); err != nil {
					jobErr := err.Error()
					job.Error = &jobErr

					wails.LogErrorf(app.ctx, "Replay decoding error: %s", jobErr)
				} else {
					job.Info = NewInfo(replay)
					job.Stats = NewStats(&replay.Stats)
				}

				results <- job
			}
		}(&wg)
	}
	wg.Wait()
	close(results)

	<-done

	wails.LogInfo(app.ctx, "Indexing completed")

	wails.EventsEmit(app.ctx, "indexing", nil)

	_ = app.WatchReplaysDirectory()

	return bsorFiles, nil
}
