<script>
    import {gridOrder} from "./utils/direction.js";
    import Grid from "./Grid.svelte";
    import ArrowIcon from "../../common/ArrowIcon.svelte";
    import DotIcon from "../../common/DotIcon.svelte";
    import CheckIcon from "../../common/CheckIcon.svelte";

    export let grid
    export let statType = 'avg'
    export let withCounts = false
    export let selectable = false;
    export let selected = [];

    $: digits = statType === 'avg' ? 2 : 0
    $: gridSorted = grid?.[statType]?.length === gridOrder?.length
        ? grid[statType].map((value, idx) => ({
            value,
            idx,
            count: grid?.count?.[idx] ?? null,
            ...gridOrder[idx]
        })).sort((a, b) => {
            return a.order - b.order
        })
        : null
</script>

{#if gridSorted?.length === gridOrder?.length}
    <Grid grid={gridSorted} {digits} cols={3} rows={3} {withCounts} on:click>
        <svelte:fragment slot="tooltip" let:item let:value let:count let:idx let:digits>
            <slot name="tooltip" {item} {value} {count} {idx} {digits}>
                Notes count: {count}
            </slot>
        </svelte:fragment>

        <svelte:fragment slot="background" let:idx>
            {#if gridSorted?.[idx]}
                <span class="direction-icon">
                    {#if Number.isFinite(gridSorted[idx].rotate)}
                        <ArrowIcon rotate={gridSorted[idx].rotate}/>
                    {:else}
                        <DotIcon/>
                    {/if}
                </span>
            {/if}

            {#if selectable && (selected ?? []).includes(idx)}
                <span class="check">
                    <CheckIcon/>
                </span>
            {/if}
        </svelte:fragment>
    </Grid>
{/if}

<style>
    .direction-icon :global(svg) {
        font-size: 4.5em!important;
        color: var(--sl-color-neutral-200);
        z-index: 0;
    }

    .check {
        z-index: 1;
    }

    .check :global(svg) {
        font-size: 2rem;
        color: var(--sl-color-neutral-700);
    }
</style>