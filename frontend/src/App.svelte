<script>
    import {onMount} from "svelte";
    import {EventsOn} from "../wailsjs/runtime/runtime.js";
    import logo from './assets/images/logo.png'
    import {GetCwd, IndexReplays, LoadReplay} from '../wailsjs/go/main/App.js'

    let replays
    let okCount = 0
    let failed = []
    let error

    let currentDir
    let progress = null

    EventsOn('indexing', function(data) {
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

<main>
    <img alt="App logo" id="logo" src="{logo}">
    <h1>Beat Leader<br/>Replay Analyzer</h1>

    {#if replays}
        <h2>All replays indexed</h2>
        <div>
            Total: {replays?.length ?? 0}, OK: {okCount}, Failed: {failed?.length ?? 0}
        </div>

        {#if failed?.length}
            <div>
                <div class="error">FAILED files:</div>
                <div class="error-list">
                    {#each failed as fail}
                        <div>
                        {fail.filename}: <span class="error">{fail.error}</span>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    {:else if error}
        <div class="error">{error}</div>
    {:else if progress}
        <div><small>Indexing replay files...</small></div>
        <progress value={progress.count} max={progress.length}></progress>
        <div class="progress-file"><small>{progress.processedFiles.length ? progress.processedFiles[progress.processedFiles.length-1] : ''}</small></div>
    {:else}
        <p><small>Initializing...</small></p>
    {/if}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        align-items: center;
    }

    #logo {
        height: 50%;
    }

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

    .error-list {
        max-height: 150px;
        overflow-y: scroll;
    }

    .error-list > div {
        padding-bottom: .25rem;
        border-bottom: 1px solid gray;
    }

    .error {
        color: red;
    }
</style>
