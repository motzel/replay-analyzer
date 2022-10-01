<script>
    import Value from "../common/Value.svelte";

    export let value
    export let label = ''

    export let size = "6em"
    export let color = 'deeppink'
    export let width = '0.4em'
    export let trackColor = 'var(--sl-color-neutral-300)'
    export let trackWidth = '0.25em'
</script>

{#if Number.isFinite(value) && value >=0 && value <= 1}
    <sl-tooltip placement="bottom" disabled={!$$slots.tooltip}>
        <sl-progress-ring value={value * 100}
                          style:--size={size}
                          style:--indicator-width={width}
                          style:--indicator-color={color}
                          style:--track-color={trackColor}
                          style:--track-width={trackWidth}
        >

            {#if label}<small>{label}</small>{/if}

            <slot name="value" {value}>
                <Value {value} type="percent" digits={2}/>
            </slot>
        </sl-progress-ring>

        <div slot="content" {value}>
            <slot name="tooltip"></slot>
        </div>
    </sl-tooltip>
{/if}

<style>
    sl-progress-ring::part(label) {
        font-size: .875em;
        flex-direction: column;
        font-weight: 900;
    }

    small {
        line-height: 1.2;
        color: var(--sl-color-neutral-600);
        font-weight: normal;
    }
</style>