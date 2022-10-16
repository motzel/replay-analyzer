<script>
    import {tick} from "svelte";
    import {router} from 'tinro';
    import nav from "../../stores/nav.js";
    import {throttle} from "../../debounce.js";
    import replaysStore from '../../stores/replays.js'
    import ReplayCard from "../replay/ReplayCard.svelte";
    import IntersectionObserver from "../common/IntersectionObserver.svelte";

    export let scroll = 0
    export let setScroll

    const THROTTLE_MS = 200
    const INCREMENT = 64

    let numOfReplays = 0
    let numOfVisible = INCREMENT
    let hash = ''

    const restorePosition = async hash => {
        if (!hash?.length) return

        const params = hash.split('&')
        for (let i = 0; i < params.length; i++) {
            const param = params[i];
            if (!param?.length) continue

            const split = param.split('=')
            if (!split?.length === 2) continue

            switch(split[0]) {
                case 'visible':
                    const visibleCount = parseInt(split[1], 10)
                    if (!isNaN(visibleCount)) numOfVisible = visibleCount
                    break;

                case 'scroll':
                    const scrollPosition = parseInt(split[1], 10)
                    if (!isNaN(scrollPosition)) {
                        await tick()
                        setTimeout(() => setScroll(scrollPosition), 50)
                    }
                    break;
            }
        }
    }

    restorePosition(router.location.hash.get())

    const onIntersect = async () => {
        numOfVisible += INCREMENT

        if (numOfVisible > numOfReplays) numOfVisible = numOfReplays

        await tick();
        updateHash(numOfVisible, scroll)
    }

    const updateHash = (numOfVisible, scroll) => hash = `visible=${numOfVisible}&scroll=${scroll}`
    const throttledUpdateHash = throttle((numOfVisible, scroll) => updateHash(numOfVisible, scroll), THROTTLE_MS)

    $: filteredReplays = $replaysStore?.slice(0, numOfVisible) ?? []
    $: numOfReplays = $replaysStore?.length ?? 0

    $: throttledUpdateHash(numOfVisible, scroll)

    $: currentUrl = `/replays#${hash}`
    $: nav.replace(currentUrl)
</script>

<section>
    {#if filteredReplays?.length}
        <section class="replays">
            {#each filteredReplays as replay (`${replay?.dir ?? ''}/${replay?.filename}`)}
                <ReplayCard {replay}/>
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