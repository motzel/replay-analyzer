<script>
    import replaysStore from '../../stores/replays.js'
    import Replay from "../replay/Replay.svelte";
</script>

<section>
    {#if $replaysStore?.length}
        <section class="replays">
            {#each $replaysStore as replay}
                <Replay {replay} />
            {/each}
        </section>
    {:else}
        <p>No replays.</p>
    {/if}
</section>

<style>
    section.replays {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr) );
        grid-column-gap: 1rem;
        grid-row-gap: 1.5rem;
    }
</style>