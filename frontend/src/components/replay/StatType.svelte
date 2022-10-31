<script>
    import {createEventDispatcher} from "svelte";

    export let value = "avg"

    const dispatch = createEventDispatcher()

    function onChange(e) {
        value = e?.target?.value ?? 'avg';

        dispatch('change', value)
    }
</script>

<sl-radio-group label="Select a stat type" {value}
                on:sl-change={onChange}>
    <sl-radio-button size="small" value="min">Min</sl-radio-button>
    <sl-radio-button size="small" value="avg">Average</sl-radio-button>
    <sl-radio-button size="small" value="med">Median</sl-radio-button>
    <sl-radio-button size="small" value="max">Max</sl-radio-button>
</sl-radio-group>