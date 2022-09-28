<script>
    import Grid from "./Grid.svelte";

    export let grid
    export let type = 'avg'

    $: digits = type === 'avg' ? 2 : 0
</script>

{#if grid?.[type]}
    <Grid grid={grid[type]} count={grid?.count} {digits} cols={4} rows={3}/>
{/if}