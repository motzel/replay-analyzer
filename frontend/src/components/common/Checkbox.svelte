<script>
    import {createEventDispatcher} from "svelte";

    export let checked = true
    export let label = ""

    const dispatch = createEventDispatcher()
</script>

<sl-checkbox {checked} on:sl-change={e => dispatch('change', !!(e?.target?.checked ?? false))}
>
    {label}
</sl-checkbox>
