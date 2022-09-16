<script>
    import {onMount} from "svelte";
    import {EventsOn} from "../../../wailsjs/runtime/runtime.js";
    import {GetCwd, IndexReplays, LoadReplay} from '../../../wailsjs/go/main/App.js'

    let replays
    let okCount = 0
    let failed = []

    let error

    let currentDir
    let progress = null

    EventsOn('indexing', function (data) {
        progress = data
    })

    onMount(async () => {
        currentDir = await GetCwd()

        IndexReplays(`.\\Replays`)
            .then(replaysData => {
                replays = replaysData

                failed = replaysData?.filter(r => r.error) ?? []
                okCount = (replaysData?.length ?? 0) - failed.length
            })
            .catch(err => error = err)


        // LoadReplay('.\\Replays\\test.bsor')
        //     .then(r => replays = r)
        //     .catch(err => error = err)
    })
</script>

{#if replays}
    <h2>All replays indexed</h2>
    <div class="results">
        Total: {replays?.length ?? 0}, Ok: {okCount}, Failed: {failed?.length ?? 0}
    </div>

    <sl-button variant="primary" outline size="large">
        <sl-icon slot="prefix" name="graph-up-arrow"></sl-icon>
        Lessgo!
    </sl-button>
{:else if error}
    <div class="error">{error}</div>
{:else if progress}
    <div><small>Indexing replay files...</small></div>
    <progress value={progress.count} max={progress.length}></progress>
    <div class="progress-file">
        <small>{progress.processedFiles.length ? progress.processedFiles[progress.processedFiles.length - 1] : ''}</small>
    </div>
{:else}
    <p><small>Initializing...</small></p>
{/if}

<style>
    h2 {
        margin-bottom: .5rem
    }

    progress {
        margin: .5rem 0 .125rem 0;
    }

    .progress-file {
        width: 80%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .results {
        margin-bottom: 1rem;
    }

    .error {
        color: red;
    }
</style>