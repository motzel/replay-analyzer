<script>
    import {createEventDispatcher} from "svelte";

    export let value = 0
    export let min = null
    export let max = null
    export let step = 1

    const dispatch = createEventDispatcher()

    let error = null;

    function onValueUpdate(e) {

        const value = e?.target?.valueAsNumber ?? NaN;
        if (isNaN(value) || (Number.isFinite(min) && value < min) || (Number.isFinite(max) && value > max)) {
            error = true
        } else {
            error = null
            dispatch('input', value)
        }
    }
</script>

<sl-input class:error={error} type="number" size="small"
          {step} {value} {min} {max}
          required
          on:sl-input={onValueUpdate}
></sl-input>

<style>
    sl-input.error {
        --sl-input-help-text-color: var(--sl-color-danger-700);

        --sl-input-border-color: var(--sl-color-danger-300);
        --sl-input-border-color-hover: var(--sl-color-danger-300);
        --sl-input-border-color-focus: var(--sl-color-danger-300);
        --sl-input-ring-color: var(--sl-color-danger-500);
        --sl-input-focus-ring-color: var(--sl-color-danger-500);
        --sl-input-hover-ring-color: var(--sl-color-danger-500);
    }
</style>