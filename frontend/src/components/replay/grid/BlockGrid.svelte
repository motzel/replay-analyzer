<script>
    import {gridOrder} from "./utils/direction.js";
    import {getPositionIdx, LAYERS_COUNT, LINES_COUNT} from "./utils/position.js";
    import Grid from "../grid/Grid.svelte";
    import Value from "../../common/Value.svelte";
    import ArrowIcon from "../../common/ArrowIcon.svelte";
    import DotIcon from "../../common/DotIcon.svelte";

    export let block;

    const BOMB_HIT_TYPE = 3

    $: grid = Array(LAYERS_COUNT * LINES_COUNT).fill(null)
        .map((_,idx) => ({
            value: idx === getPositionIdx(block?.lineLayer, block?.lineIdx) ? block?.score : null,
            count: idx === getPositionIdx(block?.lineLayer, block?.lineIdx) ? block?.predictedScore : null
        }))
</script>

{#if Number.isFinite(block?.eventType) && block.eventType !== BOMB_HIT_TYPE}
    <Grid grid={grid} withCounts={true}>
        <svelte:fragment slot="value" let:idx let:value let:count let:digits let:withCounts>
            <Value value={value} {digits}/>

            {#if block?.type !== 'hit' && idx === getPositionIdx(block?.lineLayer, block?.lineIdx)}
                <small class="count">
                    (<Value value={count} digits={0}/>)
                </small>
            {/if}
        </svelte:fragment>

        <svelte:fragment slot="background" let:idx>
            {#if Number.isFinite(block?.cutDirection) && idx === getPositionIdx(block?.lineLayer, block?.lineIdx)}
                <span class="direction-icon">
                    {#if Number.isFinite(gridOrder?.[block.cutDirection].rotate)}
                        <ArrowIcon rotate={gridOrder?.[block.cutDirection].rotate}/>
                    {:else}
                        <DotIcon/>
                    {/if}
                </span>
            {/if}
        </svelte:fragment>
    </Grid>
{/if}

<style>
    .count {
        color: var(--sl-color-neutral-500);
    }

    .direction-icon :global(svg) {
        font-size: 4.5em!important;
        color: var(--sl-color-neutral-200);
        z-index: 0;
    }

    :global(small) {
        font-size: .75rem;
        font-weight: bold;
    }
</style>