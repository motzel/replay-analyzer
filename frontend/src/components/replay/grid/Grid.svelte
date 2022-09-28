<script>
    import Value from "../../common/Value.svelte";

    export let grid
    export let count
    export let digits = 0
    export let cols = 4
    export let rows = 3
</script>

{#if cols && rows && grid?.length === cols * rows}
    <section style:--rows={rows} style:--cols={cols}>
        {#each grid as value, idx}
            {@const valueCount = count?.[idx] ?? null}
            {@const placementVertical = Math.floor(idx / cols) === rows - 1 ? 'top' : 'bottom'}
            {@const placementHorizontal = ((idx % cols) + 1) / cols <= 0.5 ? '-start' : '-end'}
            <sl-tooltip placement={`${placementVertical}${placementHorizontal}`}
                        disabled={!valueCount}>
                <div slot="content">
                    <slot name="tooltip" {value} count={valueCount} {idx} {digits}>
                        Notes count: {valueCount}
                    </slot>
                </div>

                <div class="item" class:grayed={!valueCount && !value}>
                    <span class="value">
                        <slot name="value" {value} {digits} {idx}>
                            {#if valueCount}
                                <Value value={value} {digits}/>
                            {/if}
                        </slot>
                    </span>

                    <slot name="background" {value} {digits} {idx}/>
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

    .item {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        width: 4.5em;
        height: 4.5em;
        background: var(--sl-color-neutral-100);
        border-radius: var(--sl-border-radius-large);
        cursor: help;
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
</style>