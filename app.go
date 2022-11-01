package main

import (
	"context"
	"github.com/fsnotify/fsnotify"
	wails "github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx     context.Context
	config  *Config
	watcher *fsnotify.Watcher
}

// NewApp creates a new App application struct
func NewApp(replaysDir string) *App {
	return &App{
		config: NewConfig(replaysDir),
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	wails.LogInfo(ctx, "Frontend view created")
}

func (a *App) domReady(ctx context.Context) {
	a.ctx = ctx

	wails.LogInfo(ctx, "Frontend application loaded")
}

func (a *App) watchDirectory(dir string) error {
	if err := a.watcher.Add(dir); err != nil {
		wails.LogErrorf(a.ctx, "Directory watching error: %v", dir)

		return err
	}

	wails.LogInfof(a.ctx, "Starting to watch a directory: %v", dir)

	return nil
}

func (a *App) WatchReplaysDirectory() error {
	return a.watchDirectory(a.config.ReplaysDir())
}

func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

func (a *App) shutdown(ctx context.Context) {
	a.ctx = ctx

	wails.LogInfo(ctx, "Application shutting down...")
}
