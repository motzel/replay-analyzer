<script>
    import {router} from 'tinro';
    import replaysStore from '../../stores/replays.js'
    import ReplayHeader from "../replay/ReplayHeader.svelte";
    import SongHeader from "../replay/song/SongHeader.svelte";
    import CutStats from "../replay/CutStats.svelte";

    export let filepath;

    let isLoading = false
    let replay, replayFull
    let error

    let hand = "total"
    let statType = "avg"

    const hash = router.location.hash.get()

    async function loadReplay(path) {
        if (!path?.length) return

        try {
            isLoading = true
            error = null
            replay = null
            replayFull = null

            replay = await replaysStore.load(path)

            if (!data?.notes) replaysStore.load(path, true).then(r => replayFull = r).catch(_ => _)
            else replayFull = replay
        } catch (err) {
            error = err
        } finally {
            isLoading = false
        }
    }

    $: backUrl = `/replays#${hash}`
    $: path = decodeURIComponent(filepath)
    $: loadReplay(path)

    $: data = replayFull ?? replay

    $: console.warn(data)
</script>

<article>
    {#if isLoading}
        <p>Loading replay...</p>
    {:else if error}
        <div class="error">{error}</div>
    {:else if replay}
        <section class="replay">
            <ReplayHeader info={data?.info}/>
            <SongHeader {data} />

            <CutStats stats={data?.stats} withCounts={true} />
        </section>
    {:else }
        <p>Can not load replay file.</p>
    {/if}

    <div style="margin-top: 3rem">
        <a href={backUrl} style="color: var(--sl-color-danger-500)">Back</a>
    </div>
</article>

<style>
    .replay {
        text-align: left;
    }

    .replay :global(> *) {
        margin-bottom: .5rem;
    }

    .error {
        color: var(--sl-color-danger-500);
    }
</style>