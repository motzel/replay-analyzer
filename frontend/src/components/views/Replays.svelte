<script>
    import replaysStore from '../../stores/replays.js'
    import Replay from "../replay/Replay.svelte";
    import IntersectionObserver from "../common/IntersectionObserver.svelte";

    let numOfReplays = 0
    let numOfVisible = 64
    let increment = 64
    const onIntersect = () => {
        numOfVisible += increment
        if (numOfVisible > numOfReplays) numOfVisible = numOfReplays
    }

    $: filteredReplays = $replaysStore?.slice(0, numOfVisible) ?? []
    $: numOfReplays = $replaysStore?.length ?? 0
</script>

<section>
    {#if filteredReplays?.length}
        <section class="replays">
            {#each filteredReplays as replay}
                <Replay {replay}/>
            {/each}

            <IntersectionObserver on:intersect={onIntersect} top={400}/>
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