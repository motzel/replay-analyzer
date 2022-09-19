import {writable} from "svelte/store"
import {IndexReplays, LoadReplay} from "../../wailsjs/go/main/App.js"
import {EventsOn} from "../../wailsjs/runtime/runtime.js";

let store;

store = (() => {
    let replays = null
    let failed = null
    let error = null

    let progress = null

    const {subscribe, set} = writable(replays)
    const {subscribe: errSubscribe, set: errSet} = writable(error)
    const {subscribe: failedSubscribe, set: failedSet} = writable(failed)
    const {subscribe: progressSubscribe, set: progressSet} = writable(progress)

    const reindex = async () => {
        IndexReplays()
            .then(data => {
                replays = (data?.filter(r => !r.error) ?? []).sort((a, b) => b?.info?.timeSet?.localeCompare(a?.info?.timeSet))
                failed = data?.filter(r => r.error) ?? []
                error = null

                set(replays)
                failedSet(failed)
                errSet(error)
            })
            .catch(err => {
                error = err

                errSet(error)
            })
    }

    const load = async filename => LoadReplay(filename)

    EventsOn('indexing', function (data) {
        progress = data

        progressSet(progress)
    })

    return {
        subscribe,
        reindex,
        load,
        errorStore: {subscribe: errSubscribe},
        failedStore: {subscribe: failedSubscribe},
        progressStore: {subscribe: progressSubscribe},
    }
})()

export default store