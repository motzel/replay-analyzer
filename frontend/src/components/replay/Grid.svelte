<script>
    import HandDirectionGrid from "./grid/HandDirectionGrid.svelte";
    import HandPositionGrid from "./grid/HandPositionGrid.svelte";

    export let stats;
    export let type = 'position'
    export let hand = 'total'
    export let statType = 'avg'
    export let withCounts = true
</script>

{#if stats}
    {#if type === 'direction'}
        <HandDirectionGrid {stats} {hand} {statType} {withCounts}/>
    {:else}
        <HandPositionGrid {stats} {hand} {statType} {withCounts}/>
    {/if}
{/if}