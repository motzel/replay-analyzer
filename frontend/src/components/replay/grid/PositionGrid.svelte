<script>
    import Grid from "./Grid.svelte";

    export let grid
    export let statType = 'avg'
    export let withCounts = false

    $: digits = statType === 'avg' ? 2 : 0

    $: finalGrid = grid?.[statType]?.map((value, idx) => ({
        value,
        idx,
        count: grid?.count?.[idx] ?? null
    })) ?? null
</script>

{#if finalGrid?.length === 12}
    <Grid grid={finalGrid} {digits} cols={4} rows={3} {withCounts}>
        <svelte:fragment slot="tooltip" let:item let:value let:count let:idx let:digits>
            <slot name="tooltip" {item} {value} {count} {idx} {digits}>
                Notes count: {count}
            </slot>
        </svelte:fragment>
    </Grid>
{/if}
