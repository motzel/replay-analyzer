package main

import (
	"gopkg.in/natefinch/lumberjack.v2"
	"io"
	"log"
	"os"
)

type MyLog struct{}

func NewMyLog() *MyLog {
	multi := io.MultiWriter(
		&lumberjack.Logger{
			Filename:   "./replay-analyzer.log",
			MaxSize:    3, // megabytes
			MaxBackups: 30,
			LocalTime:  false,
		},
		os.Stderr,
	)
	log.SetOutput(multi)

	return &MyLog{}
}

func (l MyLog) Print(message string) {
	log.Println(message)
}

func (l MyLog) Trace(message string) {
	l.Print("[TRACE] " + message)
}

func (l MyLog) Debug(message string) {
	l.Print("[DEBUG] " + message)
}

func (l MyLog) Info(message string) {
	l.Print("[INFO] " + message)
}

func (l MyLog) Warning(message string) {
	l.Print("[WARN] " + message)
}

func (l MyLog) Error(message string) {
	l.Print("[ERROR] " + message)
}

func (l MyLog) Fatal(message string) {
	//TODO implement me
	panic("implement me")
}
