<script>
    import {onMount, tick} from "svelte";
    import {router} from 'tinro';
    import nav from "../../stores/nav.js";
    import search from '../../stores/search.js'
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

    function updateSearch(value) {
        numOfVisible = INCREMENT
        window.scrollY = 0
    }

    onMount(() => {
        search.disableGlobal()

        return () => search.enableGlobal()
    })

    $: updateSearch($search.value)

    $: filteredReplays = $replaysStore
        ?.filter(r => {
            if (!$search.value) return true;

            let passing = false

            passing ||= r?.info?.songName?.toLowerCase()?.indexOf($search?.value?.toLowerCase()) >= 0 ?? false
            passing ||= r?.info?.mapper?.toLowerCase()?.indexOf($search?.value?.toLowerCase()) >= 0 ?? false
            passing ||= r?.info?.playerName?.toLowerCase()?.indexOf($search?.value?.toLowerCase()) >= 0 ?? false

            return passing
        })
        ?.slice(0, numOfVisible) ?? []
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