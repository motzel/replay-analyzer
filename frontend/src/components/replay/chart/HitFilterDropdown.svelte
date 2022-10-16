<script>
    import {formatNumber} from "../../../utils/format.js";
    import Range from "../../common/Range.svelte";
    import FilterIcon from "../../common/FilterIcon.svelte";

    export let filters

    const DEFAULT_VALUES = {
        score: [0, 115],
        before: [0, 70],
        accCut: [0, 15],
        after: [0, 30],
        timeDependence: [0, 1],
        beforeRating: [0, 300],
        afterRating: [0, 300],
    }

    function resetAll() {
        filters = {
            ...filters,
            ...DEFAULT_VALUES
        }
    }

    $: isDifferentFromDefault = Object.keys(DEFAULT_VALUES).some(key => filters?.[key]?.toString() !== DEFAULT_VALUES[key].toString())
</script>

{#if filters}
    <sl-dropdown placement="bottom-end">
        <sl-button slot="trigger" size="small" variant={isDifferentFromDefault ? "primary": "neutral"} caret>
            <span class="name">Hit <span class="icon"><FilterIcon/></span></span>
        </sl-button>

        <section>
            <div>
                <label>
                    Score: {formatNumber(filters.score[0], 0)} -{formatNumber(filters.score[1], 0)}
                </label>
                <Range bind:values={filters.score} min={0} max={115} step={1} pipstep={5} pips={false}/>

                <label>
                    Before: {formatNumber(filters.before[0], 0)} -{formatNumber(filters.before[1], 0)}
                </label>
                <Range bind:values={filters.before} min={0} max={70} step={1} pipstep={5} pips={false}/>

                <label>
                    Precision: {formatNumber(filters.accCut[0], 0)} -{formatNumber(filters.accCut[1], 0)}
                </label>
                <Range bind:values={filters.accCut} min={0} max={15} step={1} pipstep={1} pips={false}/>

                <label>
                    Before: {formatNumber(filters.after[0], 0)} -{formatNumber(filters.after[1], 0)}
                </label>
                <Range bind:values={filters.after} min={0} max={30} step={1} pipstep={1} pips={false}/>
            </div>

            <div>
                <label class="reset" on:click={resetAll}>Reset all</label>

                <label>
                    TD: {formatNumber(filters.timeDependence[0], 2)} -{formatNumber(filters.timeDependence[1], 2)}
                </label>
                <Range bind:values={filters.timeDependence} min={0} max={1} step={0.01} pipstep={10} pips={false}/>

                <label>
                    PRE: {formatNumber(filters.beforeRating[0], 0)}% -{formatNumber(filters.beforeRating[1], 0)}%
                </label>
                <Range bind:values={filters.beforeRating} min={0} max={300} step={1} pipstep={25} pips={false}/>

                <label>
                    POST: {formatNumber(filters.afterRating[0], 0)}% -{formatNumber(filters.afterRating[1], 0)}%
                </label>
                <Range bind:values={filters.afterRating} min={0} max={300} step={1} pipstep={25} pips={false}/>
            </div>
        </section>
    </sl-dropdown>
{/if}

<style>
    * :global(.range-slider) {
        width: 12em;
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
        display: flex;
        gap: 1rem;
    }

    label {
        display: block;
        text-align: left;
        padding: 0 .5em;
    }

    section > div:nth-child(2) > label {
        text-align: right;
    }

    .reset {
        margin-bottom: 2.25rem;
        text-align: right;
        font-size: 1rem;
        cursor: pointer;
    }

    .reset:hover {
        color: var(--sl-color-neutral-600);
    }
</style>