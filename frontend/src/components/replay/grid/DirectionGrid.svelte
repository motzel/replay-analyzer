<script>
    import Grid from "./Grid.svelte";
    import ArrowIcon from "../../common/ArrowIcon.svelte";
    import DotIcon from "../../common/DotIcon.svelte";

    export let grid
    export let statType = 'avg'
    export let withCounts = false

    const gridOrder = [
        {order: 1, rotate: 0}, // TopCenter
        {order: 7, rotate: 180}, // BottomCenter
        {order: 3, rotate: 270}, // MiddleLeft
        {order: 5, rotate: 90}, // MiddleRight
        {order: 0, rotate: 325}, // TopLeft
        {order: 2, rotate: 45}, // TopRight
        {order: 6, rotate: 225}, // BottomLeft
        {order: 8, rotate: 135}, // BottomRight
        {order: 4, rotate: null}, // Dot
    ]

    $: digits = statType === 'avg' ? 2 : 0
    $: gridSorted = grid?.[statType]?.length === 9
        ? grid[statType].map((value, idx) => ({
            value,
            idx,
            count: grid?.count[idx] ?? null, ...gridOrder[idx]
        })).sort((a, b) => {
            return a.order - b.order
        })
        : null
</script>

{#if gridSorted?.length === 9}
    <Grid grid={gridSorted} {digits} cols={3} rows={3} {withCounts}>
        <svelte:fragment slot="tooltip" let:item let:value let:count let:idx let:digits>
            <slot name="tooltip" {item} {value} {count} {idx} {digits}>
                Notes count: {count}
            </slot>
        </svelte:fragment>

        <svelte:fragment slot="background" let:idx>
            {#if gridSorted?.[idx]}
                {#if Number.isFinite(gridSorted[idx].rotate)}
                    <ArrowIcon rotate={gridSorted[idx].rotate}/>
                {:else}
                    <DotIcon/>
                {/if}
            {/if}
        </svelte:fragment>
    </Grid>
{/if}

<style>
    :global(svg) {
        font-size: 4.5em;
        color: var(--sl-color-neutral-200);
        z-index: 0;
    }
</style>