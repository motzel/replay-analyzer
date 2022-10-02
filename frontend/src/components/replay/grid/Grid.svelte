<script>
    import Value from "../../common/Value.svelte";

    export let grid
    export let valueKey = 'value'
    export let countKey = 'count'
    export let digits = 0
    export let cols = 4
    export let rows = 3
    export let withCounts = false
</script>

{#if cols && rows && grid?.length === cols * rows}
    <section style:--rows={rows} style:--cols={cols}>
        {#each grid as item, idx}
            {@const value = item?.[valueKey] ?? null}
            {@const count = item?.[countKey] ?? null}
            {@const placementVertical = Math.floor(idx / cols) === rows - 1 ? 'top' : 'bottom'}
            {@const placementHorizontal = ((idx % cols) + 1) / cols <= 0.5 ? '-start' : '-end'}
            <sl-tooltip placement={`${placementVertical}${placementHorizontal}`}
                        disabled={!count}>
                <div slot="content">
                    <slot name="tooltip" {item} {value} {count} {idx} {digits}>
                        Notes count: {count}
                    </slot>
                </div>

                <div class="item" class:grayed={!count && !value}>
                    <span class="value">
                        <slot name="value" {item} {value} {count} {idx} {digits}>
                            {#if count}
                                <Value value={value} {digits}/>

                                {#if withCounts}
                                    <small class="count">(<Value value={count} digits={0} />)</small>
                                {/if}
                            {/if}
                        </slot>
                    </span>

                    <slot name="background" {item} {value} {count} {idx} {digits}/>
                </div>
            </sl-tooltip>
        {/each}
    </section>
{/if}

<style>
    section {
        display: inline-grid;
        grid-template-columns: repeat(var(--cols), minmax(4.5em, 33%));
        grid-template-rows: repeat(var(--rows), minmax(4.5em, 33%));
        justify-content: stretch;
        align-items: stretch;
        font-size: 1em;
        gap: .25em;
    }

    sl-tooltip, sl-tooltip::part(body), section .tooltip-content {
        font: inherit;
    }

    .item {
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 1fr;
        place-items: center;
        width: 4.5em;
        height: 4.5em;
        background: var(--sl-color-neutral-100);
        border-radius: var(--sl-border-radius-large);
        cursor: help;
        overflow: hidden;
    }

    .item.grayed {
        color: var(--sl-color-neutral-400);
    }

    .item .value {
        font-weight: bold;
        line-height: 1;
        text-align: center;
        z-index: 2;
    }

    .item :global(> *) {
        grid-row: 1/-1;
        grid-column: 1/-1;
    }

    small {
        display: block;
        font-size: .65em;
        margin-top: .25em;
    }

    small.count {
        font-weight: normal;
    }
</style>