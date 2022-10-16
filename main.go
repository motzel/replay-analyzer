package main

import (
	"embed"
	"fmt"
	"github.com/fsnotify/fsnotify"
	"github.com/motzel/go-bsor/bsor"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"math"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

//go:embed frontend/dist
var assets embed.FS

func main() {
	log := NewMyLog()

	log.Info("Initializing application")

	defaultReplaysDirectory := ".\\Replays"

	var absPath string
	var err error

	if absPath, err = filepath.Abs(defaultReplaysDirectory); err != nil {
		log.Fatal(fmt.Sprintf("Error reading replays directory %v:", defaultReplaysDirectory))
	}

	app := NewApp(absPath)

	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Error("Replays directory watcher failed to initialize")
	} else {
		defer watcher.Close()

		app.watcher = watcher

		// Start listening for events.
		go func() {
			// taken from https://github.com/fsnotify/fsnotify/blob/main/cmd/fsnotify/dedup.go
			var (
				// Wait 100ms for new events; each new event resets the timer.
				waitFor = 100 * time.Millisecond

				// Keep track of the timers, as path → timer.
				mu     sync.Mutex
				timers = make(map[string]*time.Timer)

				// Callback we run.
				onFileWatchEvent = func(event fsnotify.Event) {
					if !strings.HasSuffix(strings.ToLower(event.Name), ".bsor") {
						return
					}

					switch event.Op {
					case fsnotify.Create, fsnotify.Write:
						var fileInfo os.FileInfo
						if fileInfo, err = os.Stat(event.Name); err != nil {
							return
						}

						newFilename, err := RenameBsorFile(app.config.ReplaysDir(), fileInfo)
						if err != nil {
							log.Error(fmt.Sprintf("File watcher (%s): can not rename BSOR file: %+v", event.Name, err))
							return
						}

						if newFilename != fileInfo.Name() {
							log.Info(fmt.Sprintf("File watcher: %s renamed to %s", event.Name, newFilename))
							return
						}

						fullPath := filepath.Join(app.config.ReplaysDir(), newFilename)

						replayItem := ReplayItem{
							Dir:      app.config.ReplaysDir(),
							Filename: newFilename,
							AbsPath:  fullPath,
						}

						var replay *bsor.ReplayEventsWithStats
						if replay, err = app.LoadReplay(fullPath); err != nil {
							runtime.LogErrorf(app.ctx, "File watcher (%s): %+v", fullPath, err)

							return
						}

						replayItem.Info = NewInfo(replay)
						replayItem.Stats = NewStats(&replay.Stats)

						log.Info(fmt.Sprintf("File watcher: %s indexed", fullPath))

						runtime.EventsEmit(app.ctx, "replay-added", replayItem)
					case fsnotify.Remove, fsnotify.Rename:
						filename := event.Name[len(app.config.ReplaysDir())+1:]
						fullPath := filepath.Join(app.config.ReplaysDir(), filename)

						replayItem := ReplayItem{
							Dir:      app.config.ReplaysDir(),
							Filename: filename,
							AbsPath:  fullPath,
						}

						log.Info(fmt.Sprintf("File watcher: %s removed", event.Name))

						runtime.EventsEmit(app.ctx, "replay-removed", replayItem)
					}

					mu.Lock()
					delete(timers, event.Name)
					mu.Unlock()
				}
			)

			for {
				select {
				// Read from Errors.
				case err, ok := <-watcher.Errors:
					if !ok { // Channel was closed (i.e. Watcher.Close() was called).
						return
					}
					log.Info(fmt.Sprintf("File watcher error: %+v", err))

				// Read from Events.
				case e, ok := <-watcher.Events:
					if !ok { // Channel was closed (i.e. Watcher.Close() was called).
						return
					}

					if e.Op != fsnotify.Create && e.Op != fsnotify.Write && e.Op != fsnotify.Rename && e.Op != fsnotify.Remove {
						continue
					}

					// Get timer.
					mu.Lock()
					t, ok := timers[e.Name]
					mu.Unlock()

					// No timer yet, so create one.
					if !ok {
						t = time.AfterFunc(math.MaxInt64, func() { onFileWatchEvent(e) })
						t.Stop()

						mu.Lock()
						timers[e.Name] = t
						mu.Unlock()
					}

					// Reset the timer for this path, so it will start from 100ms again.
					t.Reset(waitFor)
				}
			}
		}()

		log.Info("Replays directory watcher initialized")
	}

	// Create application with options
	err = wails.Run(&options.App{
		Title:              "BL Replay Analyzer",
		Width:              876,
		Height:             700,
		MinWidth:           876,
		MinHeight:          700,
		Assets:             assets,
		BackgroundColour:   &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:          app.startup,
		OnDomReady:         app.domReady,
		OnBeforeClose:      app.beforeClose,
		OnShutdown:         app.shutdown,
		Logger:             log,
		LogLevel:           logger.DEBUG,
		LogLevelProduction: logger.INFO,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		log.Error(err.Error())
	}
}
