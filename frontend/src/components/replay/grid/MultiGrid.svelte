<script>
    import {LAYERS_COUNT, LINES_COUNT} from "./utils/position.js";
    import {gridOrder} from "./utils/direction.js";
    import PositionGrid from "./PositionGrid.svelte";
    import DirectionGrid from "./DirectionGrid.svelte";

    export let stats
    export let type = 'position'
    export let hand = 'total'
    export let statType = 'avg'
    export let positionIndex = null
    export let directionIndex = null
    export let withCounts = false

    const DIRECTIONS_COUNT = gridOrder?.length ?? 0
    const POSITIONS_COUNT = LAYERS_COUNT * LINES_COUNT

    function getDirectionGrid(statsArr, index) {
        let ret = [];
        let counts = [];

        if (!Number.isFinite(index) || index < 0 || index > POSITIONS_COUNT - 1) return null;

        const startIdx = index * DIRECTIONS_COUNT;

        for (let i = startIdx; i < startIdx + DIRECTIONS_COUNT; i++) {
            ret.push(statsArr[i]);
            counts.push(stats?.[hand]?.positionAndDirectionGrid?.count?.[i] ?? null)
        }

        return {
            [statType]: ret,
            count: counts,
        }
    }

    function getPositionGrid(statsArr, index) {
        let ret = [];
        let counts = [];

        if (!Number.isFinite(index) || index < 0 || index > DIRECTIONS_COUNT - 1) return null;

        for (let i = index; i < POSITIONS_COUNT * DIRECTIONS_COUNT; i += DIRECTIONS_COUNT) {
            ret.push(statsArr[i]);
            counts.push(stats?.[hand]?.positionAndDirectionGrid?.count?.[i] ?? null)
        }

        return {
            [statType]: ret,
            count: counts,
        }
    }

    $: statsArr = stats?.[hand]?.positionAndDirectionGrid?.[statType] ?? null
    $: grid = statsArr?.length === DIRECTIONS_COUNT * POSITIONS_COUNT
        ? (type === 'direction' ? getDirectionGrid(statsArr, positionIndex) : getPositionGrid(statsArr, directionIndex))
        : null
</script>

{#if (type === 'position' && grid?.[statType]?.length === POSITIONS_COUNT) || (type === 'direction' && grid?.[statType]?.length === DIRECTIONS_COUNT)}
    {#if type === 'direction'}
        <DirectionGrid {grid} {statType} {withCounts}>
            <svelte:fragment slot="tooltip" let:value let:count let:idx let:digits>
                <slot name="tooltip" {value} {count} {idx} {digits}>
                    Notes count: {count}
                </slot>
            </svelte:fragment>
        </DirectionGrid>
    {:else}
        <PositionGrid {grid} {statType} {withCounts}>
            <svelte:fragment slot="tooltip" let:value let:count let:idx let:digits>
                <slot name="tooltip" {value} {count} {idx} {digits}>
                    Notes count: {count}
                </slot>
            </svelte:fragment>
        </PositionGrid>
    {/if}
{/if}