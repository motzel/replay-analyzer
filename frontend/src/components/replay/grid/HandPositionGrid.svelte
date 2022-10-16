<script>
    import {LAYERS_COUNT, LINES_COUNT} from "./utils/position.js";
    import PositionGrid from "./PositionGrid.svelte";
    import MultiGrid from "./MultiGrid.svelte";

    export let stats
    export let hand = 'total'
    export let statType = 'avg'
    export let withCounts = false

    $: digits = statType === 'avg' ? 2 : 0
</script>

{#if stats?.[hand]?.positionGrid?.[statType]?.length === LAYERS_COUNT * LINES_COUNT}
    <PositionGrid grid={stats[hand].positionGrid} {statType} {withCounts}>
        <svelte:fragment slot="tooltip" let:item let:value let:count let:idx let:digits>
            <slot name="tooltip" {item} {value} {count} {idx} {digits}>
                <MultiGrid {stats} {hand} {statType} type="direction" positionIndex={item?.idx ?? null} {withCounts} />
            </slot>
        </svelte:fragment>
    </PositionGrid>
{/if}
