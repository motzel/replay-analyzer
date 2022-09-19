package main

import (
	"embed"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/options"
)

//go:embed frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp(".\\Replays")

	log := NewMyLog()

	log.Info("Initializing application")

	// Create application with options
	err := wails.Run(&options.App{
		Title:              "BL Replay Analyzer",
		Width:              1024,
		Height:             768,
		MinWidth:           800,
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
