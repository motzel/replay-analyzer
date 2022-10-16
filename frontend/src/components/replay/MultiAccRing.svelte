<script>
    import AccRing from "./AccRing.svelte";
    import Value from "../common/Value.svelte";

    export let value
    export let value2
    export let label
    export let label2
    export let size = '7em'
    export let tooltip
    export let tooltip2
</script>

<div class="multi-ring" style:--size={size}>
    <div>
        <AccRing value={value2} label={label2} {size} color="green" hoist={true}>
            <svelte:fragment slot="label" let:label>
                <small style="top: 1.45em;">
                    {label}
                </small>
            </svelte:fragment>

            <svelte:fragment slot="value" let:value>
                <small class="value2" style="top: 1.75em;">
                    <Value {value} type="percent"/>
                </small>
            </svelte:fragment>

            <span slot="tooltip">
                {tooltip2}
            </span>
        </AccRing>
    </div>

    <div>
        <AccRing value={value} label={label} size={`calc(${size} - 1em)`} hoist={true}>
            <svelte:fragment slot="label" let:label>
                <small class="main" style="top: -1.35em;">
                    {label}
                </small>
            </svelte:fragment>

            <svelte:fragment slot="value" let:value>
                <span style="top: -.9em;">
                    <Value {value} type="percent"/>
                </span>
            </svelte:fragment>

            <span slot="tooltip">
                {tooltip}
            </span>
        </AccRing>
    </div>
</div>

<style>
    .multi-ring {
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 1fr;
        place-items: center;
        width: var(--size, 7em);
        height: var(--size, 7em);
        overflow: hidden;
    }

    .multi-ring :global(> *) {
        grid-column: 1/-1;
        grid-row: 1/-1;
    }

    span, small {
        position: relative;
        line-height: 1;
    }

    small {
        color: var(--sl-color-neutral-600);
        font-weight: normal;
    }

    small.value2 {
        font-size: 0.75em;
    }

    small.main {
        font-weight: bold;
    }
</style>