<script>
    import PositionGrid from "./PositionGrid.svelte";

    export let stats
    export let hand = 'total'
    export let type = 'avg'

    $: digits = type === 'avg' ? 2 : 0
</script>

{#if stats?.[hand]?.positionGrid?.[type]?.length === 12}
    <PositionGrid grid={stats[hand].positionGrid} {type}>
        <svelte:fragment slot="tooltip" let:value let:count let:idx let:digits>
            <slot name="tooltip" {value} {count} {idx} {digits}>
                Notes count: {count}
            </slot>
        </svelte:fragment>
    </PositionGrid>
{/if}

<style>
</style>