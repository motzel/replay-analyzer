<script>
    import Grid from "./Grid.svelte";

    export let stats
    export let hand = 'total'
    export let type = 'avg'

    $: digits = type === 'avg' ? 2 : 0
</script>

{#if stats?.[hand]?.positionGrid?.[type]}
    <Grid grid={stats[hand].positionGrid[type]} count={stats?.[hand]?.positionGrid?.count} {digits} cols={4} rows={3}>
        <svelte:fragment slot="tooltip" let:value let:count let:idx>
            <header>Notes count: {count}</header>
        </svelte:fragment>
    </Grid>
{/if}

<style>
    header {
        font-weight: bold;
    }
</style>