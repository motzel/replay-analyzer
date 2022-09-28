<script>
    import Grid from "./Grid.svelte";
    import ArrowIcon from "./ArrowIcon.svelte";
    import DotIcon from "./DotIcon.svelte";

    export let grid
    export let type = 'avg'

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

    $: digits = type === 'avg' ? 2 : 0
    $: gridSorted = grid?.[type]?.length === 9
        ? grid[type].map((value, idx) => ({
            value,
            idx,
            count: grid?.count[idx] ?? null, ...gridOrder[idx]
        })).sort((a, b) => {
            return a.order - b.order
        })
        : null

    $: finalGrid = gridSorted?.map(g => g?.value ?? null) ?? null
    $: count = gridSorted?.map(g => g?.count ?? null) ?? null
</script>

{#if finalGrid?.length === 9}
    <Grid grid={finalGrid} {count} {digits} cols={3} rows={3}>
        <svelte:fragment slot="background" let:idx>
            {#if gridSorted?.[idx]}
                <span class="icon">
                {#if Number.isFinite(gridSorted[idx].rotate)}
                    <ArrowIcon rotate={gridSorted[idx].rotate}/>
                {:else}
                    <DotIcon/>
                {/if}
                </span>
            {/if}
        </svelte:fragment>
    </Grid>
{/if}

<style>
    .icon {
        position: absolute;
        top: -.175em;
        font-size: 3.5em;
        color: var(--sl-color-neutral-200);
        z-index: 0;
    }
</style>