<script>
    import {gridOrder} from "../grid/utils/direction.js";
    import FilterIcon from "../../common/FilterIcon.svelte";
    import DirectionGrid from "../grid/DirectionGrid.svelte";

    export let filters

    function clearAll() {
        filters.direction = [];
    }

    function setAll() {
        filters.direction = Array(gridOrder?.length ?? 0).fill(0).map((_, idx) => idx);
    }

    function toggleIdx(e) {
        if (!Number.isFinite(e?.detail)) return;

        if (!filters.direction) setAll();

        if (filters.direction.includes(e.detail))
            filters.direction = filters.direction.filter(v => v !== e.detail)
        else
            filters.direction = [...filters.direction, e.detail]
    }

    $: grid = {avg: Array(gridOrder?.length ?? 0).fill(0)}
</script>

{#if filters}
    <sl-dropdown placement="bottom-end">
        <sl-button slot="trigger" size="small" variant={filters.direction?.length !== gridOrder?.length ? "primary" : "neutral"} caret>
            <span class="name">Direction <span class="icon"><FilterIcon/></span></span>
        </sl-button>

        <section>
            <div class="actions">
                <label on:click={clearAll}>Clear all</label>
                <label on:click={setAll}>Set all</label>
            </div>

            <DirectionGrid {grid} selectable={true} selected={filters.direction} on:click={toggleIdx}/>
        </section>
    </sl-dropdown>
{/if}

<style>
    * :global(.item) {
        cursor: pointer !important;
    }

    .name {
        display: inline-flex;
        align-items: center;
        line-height: 1;
        gap: .25rem;
    }

    .icon :global(svg) {
        font-size: 1.25rem;
        margin-top: .25em;
    }

    sl-dropdown::part(panel) {
        background-color: var(--color-background);
        text-align: center;
        padding: 1em;
    }

    section {
        font-size: .85rem;
    }

    .actions {
        text-align: right;
        font-size: 1rem;
        padding: 0 .5rem;
        margin-bottom: .5rem;
    }

    .actions > * {
        margin-right: .5rem;
        cursor: pointer;
    }

    .actions > *:last-child {
        margin-right: 0;
    }

    .actions > *:hover {
        color: var(--sl-color-neutral-600);
    }
</style>