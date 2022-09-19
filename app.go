package main

import (
	"context"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx    context.Context
	config Config
}

// NewApp creates a new App application struct
func NewApp(replaysDir string) *App {
	return &App{
		config: *NewConfig(replaysDir),
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	runtime.LogInfo(ctx, "Frontend view created")
}

func (a *App) domReady(ctx context.Context) {
	a.ctx = ctx

	runtime.LogInfo(ctx, "Application loaded")
}

func (b *App) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

func (a *App) shutdown(ctx context.Context) {
	a.ctx = ctx

	runtime.LogInfo(ctx, "Application shutting down...")
}
