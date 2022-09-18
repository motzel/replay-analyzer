package main

import (
	"bytes"
	"fmt"
	"github.com/motzel/go-bsor/bsor"
	"github.com/motzel/go-bsor/bsor/buffer"
	runtime2 "github.com/wailsapp/wails/v2/pkg/runtime"
	"io/ioutil"
	"os"
	"path/filepath"
	"runtime"
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

func (app *App) IndexReplays(dir string) ([]ReplayItem, error) {
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

		bsorFiles = append(bsorFiles, ReplayItem{Filename: file.Name(), Dir: dir})
	}

	progress := IndexProgress{Length: len(bsorFiles), ProcessedFiles: make([]string, 0, len(bsorFiles))}
	runtime2.EventsEmit(app.ctx, "indexing", progress)

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
			runtime2.EventsEmit(app.ctx, "indexing", progress.Processed(item))
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

				runtime2.EventsEmit(app.ctx, "indexing", progress.Add(job))

				if replay, err := app.LoadReplay(inputFilename); err != nil {
					jobErr := err.Error()
					job.Error = &jobErr
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

	runtime2.EventsEmit(app.ctx, "indexing", nil)

	return bsorFiles, nil
}
