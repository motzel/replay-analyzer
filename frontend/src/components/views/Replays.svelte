<script>
    import replaysStore from '../../stores/replays.js'
</script>

<a href="/">Back to index</a>

{#if $replaysStore?.length}
    <section>
        <h1>TODO: Replays view</h1>

        {#each $replaysStore as replay}
            <div class="replay">
                <div>Filename: {replay?.filename}</div>
                <div>Song name: {replay?.info?.songName}</div>
                <div>Difficulty: {replay?.info?.difficulty}</div>
                <div>Accuracy: {replay?.info.accuracy}</div>
                <div>FC Accuracy: {replay?.info.fcAccuracy}</div>
            </div>
        {/each}
    </section>
{:else}
    <p>No replays.</p>
{/if}

<style>
.replay {
    padding: .5rem 0;
    border-bottom: 1px solid var(--sl-color-neutral-300);
}
</style>