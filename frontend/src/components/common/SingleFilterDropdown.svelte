<script>
    import {formatNumber} from "../../utils/format.js";
    import Range from "./Range.svelte";

    export let label
    export let values=[0, 100]
    export let min = 0
    export let max = 100
    export let step = 1
    export let pipstep = 5
    export let digits = 0
    export let pips = true
    export let suffix
</script>

<sl-dropdown>
    <sl-button slot="trigger" size="small" variant="default" caret>
        {#if label?.length}{label}:{/if}
        {formatNumber(values[0], digits)} -{formatNumber(values[1], digits)}{#if suffix?.length}{suffix}{/if}
    </sl-button>
    <div>
        <Range {min} {max} {step} {pipstep} {pips} {suffix} bind:values/>
    </div>
</sl-dropdown>

<style>
    * :global(.range-slider) {
        width: 12em;
    }

    sl-dropdown::part(panel) {
        background-color: var(--color-background);
        text-align: center;
        padding: 1em;
    }
</style>