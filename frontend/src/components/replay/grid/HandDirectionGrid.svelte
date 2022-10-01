<script>
    import DirectionGrid from "./DirectionGrid.svelte";
    import MultiGrid from "./MultiGrid.svelte";

    export let stats
    export let hand = 'total'
    export let statType = 'avg'
    export let withCounts = false
</script>

{#if stats?.[hand]?.directionGrid?.[statType]?.length === 9}
    <DirectionGrid grid={stats[hand].directionGrid} {statType} {withCounts}>
        <svelte:fragment slot="tooltip" let:item let:value let:count let:idx let:digits>
            <slot name="tooltip" {item} {value} {count} {idx} {digits}>
                <MultiGrid {stats} {hand} {statType} type="position" directionIndex={item?.idx ?? null} {withCounts} />
            </slot>
        </svelte:fragment>
    </DirectionGrid>
{/if}
