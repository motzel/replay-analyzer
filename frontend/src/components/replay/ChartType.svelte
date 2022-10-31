<script>
    import {createEventDispatcher} from "svelte";

    export let value = "map"

    const dispatch = createEventDispatcher()

    function onChange(e) {
        value = e?.target?.value ?? 'map';

        dispatch('change', value)
    }
</script>

<sl-radio-group label="Select a chart type" {value}
                on:sl-change={onChange}>
    <sl-radio-button size="small" value="map">Map acc</sl-radio-button>
    <sl-radio-button size="small" value="hit">Hit acc</sl-radio-button>
</sl-radio-group>