import {writable, get} from "svelte/store"
import {IndexReplays, LoadReplay} from "../../wailsjs/go/main/App.js"
import {EventsOn} from "../../wailsjs/runtime/runtime.js";
import settingsStore from './settings'

let store;

store = (() => {
    let replays = null
    let failed = null
    let removed = null
    let error = null

    let progress = null

    const {subscribe, set} = writable(replays)
    const {subscribe: errSubscribe, set: errSet} = writable(error)
    const {subscribe: failedSubscribe, set: failedSet} = writable(failed)
    const {subscribe: removedSubscribe, set: removedSet} = writable(removed)
    const {subscribe: progressSubscribe, set: progressSet} = writable(progress)

    const reindex = async () => {
        const settings = get(settingsStore);

        IndexReplays(settings?.retention?.numOfBest ?? 3, settings?.retention?.numOfRecent ?? 3, settings?.retention?.separateLimitsForModifiers ?? true)
            .then(data => {
                replays = (data?.filter(r => !r.error && !r.isRemoved) ?? []).sort((a, b) => b?.info?.timeSet?.localeCompare(a?.info?.timeSet))
                failed = data?.filter(r => r.error) ?? []
                removed = data?.filter(r => r.isRemoved) ?? []
                error = null

                set(replays)
                failedSet(failed)
                removedSet(removed)
                errSet(error)
            })
            .catch(err => {
                error = err

                errSet(error)
            })
    }

    const load = async (filename, full = false) => {
        if (!full) {
            const replay = (replays ?? [])?.find(r => r.absPath === filename);
            if (replay) return replay;
        }

        return LoadReplay(filename)
    }

    const compare = (r1, r2) => (r1?.absPath && r1?.absPath === r2?.absPath) || (r1?.dir && r1?.filename && r1?.dir === r2?.dir && r1?.filename === r2?.filename)

    EventsOn('indexing', function (data) {
        progress = data

        progressSet(progress)
    })

    EventsOn('replay-added', function (data) {
        let existingIdx = (replays ?? []).findIndex(r => compare(r, data))
        if (existingIdx >= 0) {
            replays[existingIdx] = data;
        } else {
            replays = [...replays, data]
        }

        set(replays)
    })

    EventsOn('replay-removed', function (data) {
        replays = (replays ?? []).filter(r => !compare(r, data))

        set(replays)
    })

    return {
        subscribe,
        reindex,
        load,
        errorStore: {subscribe: errSubscribe},
        failedStore: {subscribe: failedSubscribe},
        removedStore: {subscribe: removedSubscribe},
        progressStore: {subscribe: progressSubscribe},
    }
})()

export default store