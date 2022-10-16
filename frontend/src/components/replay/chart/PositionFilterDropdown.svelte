<script>
    import {LAYERS_COUNT, LINES_COUNT} from "../grid/utils/position.js";
    import FilterIcon from "../../common/FilterIcon.svelte";
    import PositionGrid from "../grid/PositionGrid.svelte";

    export let filters

    function clearAll() {
        filters.position = [];
    }

    function setAll() {
        filters.position = Array(LAYERS_COUNT * LINES_COUNT).fill(0).map((_, idx) => idx);
    }

    function toggleIdx(e) {
        if (!Number.isFinite(e?.detail)) return;

        if (!filters.position) setAll();

        if (filters.position.includes(e.detail))
            filters.position = filters.position.filter(v => v !== e.detail)
        else
            filters.position = [...filters.position, e.detail]
    }

    $: grid = {avg: Array(LAYERS_COUNT * LINES_COUNT).fill(0)}
</script>

{#if filters}
    <sl-dropdown placement="bottom-end">
        <sl-button slot="trigger" size="small" variant={filters.position?.length !== LAYERS_COUNT * LINES_COUNT ? "primary" : "neutral"} caret>
            <span class="name">Position <span class="icon"><FilterIcon/></span></span>
        </sl-button>

        <section>
            <div class="actions">
                <label on:click={clearAll}>Clear all</label>
                <label on:click={setAll}>Set all</label>
            </div>

            <PositionGrid {grid} selectable={true} selected={filters.position} on:click={toggleIdx}/>
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