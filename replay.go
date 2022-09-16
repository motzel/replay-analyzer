package main

import (
	"bytes"
	"fmt"
	"github.com/motzel/go-bsor/bsor"
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

type ReplayItem struct {
	Dir      string                 `json:"dir"`
	Filename string                 `json:"filename"`
	Info     *bsor.ReplayEventsInfo `json:"info"`
	Error    *string                `json:"error"`
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
					replayInfo := replay.Info
					job.Info = &replayInfo
				}

				results <- job
			}
		}(&wg)
	}
	wg.Wait()
	close(results)

	<-done

	return bsorFiles, nil
}
