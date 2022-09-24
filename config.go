package main

import (
	"path/filepath"
)

type Config struct {
	replaysDir string
	otherDirs  []string
}

func NewConfig(replaysDir string) *Config {
	return &Config{replaysDir: replaysDir}
}

func (config *Config) AddDir(dir string) {
	config.otherDirs = append(config.otherDirs, dir)
}

func (config *Config) ReplaysDir() string {
	return config.replaysDir
}

func (config *Config) DownloadDir() string {
	return filepath.Join(config.replaysDir, "Download")
}

func (config *Config) OtherDirs() []string {
	return config.otherDirs
}

func (config *Config) AllDirs() []string {
	return append(config.otherDirs, config.replaysDir)
}
