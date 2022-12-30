package main

import (
	"fmt"
	"sort"
)

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func createReplayHash(info *Info, includeModifiers bool) (string, error) {
	if info == nil {
		return "", fmt.Errorf("replay info is empty")
	}

	hash := info.PlayerId + "_" + info.Hash + "_" + info.Difficulty + "_" + info.Mode

	if includeModifiers == true {
		for _, mod := range info.Modifiers {
			hash += "_" + mod
		}
	}

	return hash, nil
}

type RetentionConfig struct {
	numOfBest                  int
	numOfRecent                int
	separateLimitsForModifiers bool
}

func NewRetentionConfig(numOfBest, numOfRecent int, separateLimitsForModifiers bool) *RetentionConfig {
	if numOfBest < 0 {
		numOfBest = 0
	}
	if numOfRecent < 0 {
		numOfRecent = 0
	}

	if numOfBest == 0 && numOfRecent == 0 {
		numOfBest = 3
		numOfRecent = 3
	}

	return &RetentionConfig{
		numOfBest:                  numOfBest,
		numOfRecent:                numOfRecent,
		separateLimitsForModifiers: separateLimitsForModifiers,
	}
}

func replayInSlice(replay *ReplayItem, replays []*ReplayItem) bool {
	for _, r := range replays {
		if r.AbsPath == replay.AbsPath {
			return true
		}
	}

	return false
}

func uniqueSlice(input []string) []string {
	u := make([]string, 0, len(input))
	m := make(map[string]bool)

	for _, val := range input {
		if _, ok := m[val]; !ok {
			m[val] = true
			u = append(u, val)
		}
	}

	return u
}

func getFilesToRemove(replays []ReplayItem, config *RetentionConfig) []string {
	mapsByHash := make(map[string][]*ReplayItem)

	for i, replay := range replays {
		hash, err := createReplayHash(replay.Info, config.separateLimitsForModifiers)
		if err == nil {
			mapsByHash[hash] = append(mapsByHash[hash], &replays[i])
		}
	}

	mapsToRemove := make([]string, 0, len(replays)/2+1)

	for _, mapsByAcc := range mapsByHash {
		sort.Slice(mapsByAcc, func(i, j int) bool {
			return mapsByAcc[i].Info.Accuracy > mapsByAcc[j].Info.Accuracy
		})

		mapsByTime := make([]*ReplayItem, len(mapsByAcc))
		copy(mapsByTime, mapsByAcc)
		sort.Slice(mapsByTime, func(i, j int) bool {
			return mapsByAcc[i].Info.TimeSet.After(mapsByAcc[j].Info.TimeSet)
		})

		mapsByAccToKeep := mapsByAcc[:min(len(mapsByAcc), config.numOfBest)]
		mapsByAccToRemove := mapsByAcc[min(len(mapsByAcc), config.numOfBest):]

		mapsByTimeToKeep := mapsByTime[:min(len(mapsByTime), config.numOfRecent)]
		mapsByTimeToRemove := mapsByTime[min(len(mapsByTime), config.numOfRecent):]

		for _, r := range mapsByAccToRemove {
			if !replayInSlice(r, mapsByTimeToKeep) {
				mapsToRemove = append(mapsToRemove, r.AbsPath)
				r.IsRemoved = true
			}
		}

		for _, r := range mapsByTimeToRemove {
			if !replayInSlice(r, mapsByAccToKeep) {
				mapsToRemove = append(mapsToRemove, r.AbsPath)
				r.IsRemoved = true
			}
		}
	}

	return uniqueSlice(mapsToRemove)
}
