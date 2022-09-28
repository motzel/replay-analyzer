<script>
    import DirectionGrid from "./DirectionGrid.svelte";

    export let stats
    export let hand = 'total'
    export let type = 'avg'
</script>

{#if stats?.[hand]?.directionGrid?.[type]?.length === 9}
    <DirectionGrid grid={stats[hand].directionGrid} {type}>
        <svelte:fragment slot="tooltip" let:value let:count let:idx let:digits>
            <slot name="tooltip" {value} {count} {idx} {digits}>
                Notes count: {count}
            </slot>
        </svelte:fragment>
    </DirectionGrid>
{/if}

<style>
</style>