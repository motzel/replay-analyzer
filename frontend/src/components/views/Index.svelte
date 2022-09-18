<script>
    import {onMount} from "svelte";
    import {router} from 'tinro';
    import replaysStore from '../../stores/replays.js'
    import {GetCwd} from '../../../wailsjs/go/main/App.js'

    let currentDir

    onMount(async () => {
        currentDir = await GetCwd()

        await replaysStore.reindex(`.\\Replays`)
    })

    $: failedStore = replaysStore.failedStore
    $: errorStore = replaysStore.errorStore
    $: progressStore = replaysStore.progressStore
    $: okCount = $replaysStore?.length ?? 0
    $: failedCount = $failedStore?.length ?? 0
    $: total = okCount + failedCount
</script>

{#if $progressStore}
    <div><small>Indexing replay files...</small></div>
    <progress value={$progressStore.count} max={$progressStore.length}></progress>
    <div class="progress-file">
        <small>{$progressStore.processedFiles.length ? $progressStore.processedFiles[$progressStore.processedFiles.length - 1] : ''}</small>
    </div>
{:else if $errorStore}
    <div class="error">{$errorStore}</div>
{:else if $replaysStore}
    <h2>All replays indexed</h2>
    <div class="results">
        Total: {total}, Ok: {okCount}, Failed: {failedCount}
    </div>

    <sl-button variant="primary" outline pill size="large" on:click={() => router.goto('/replays')}>
        <sl-icon slot="prefix" name="graph-up-arrow"></sl-icon>
        Lessgo!
    </sl-button>
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
        color: var(--sl-color-danger-500);
    }
</style>