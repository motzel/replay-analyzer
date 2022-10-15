<script>
    import RangeSlider from "svelte-range-slider-pips";

    export let values = [0, 100]
    export let min = 0
    export let max = 100
    export let step = 1
    export let pipstep = 5
    export let pips = true
    export let suffix
</script>

<span class="range-slider"
      style:--range-slider="var(--sl-color-neutral-400)"
      style:--range-handle-inactive="var(--sl-color-primary-500)"
      style:--range-handle="var(--sl-color-primary-500)"
      style:--range-handle-focus="var(--sl-color-primary-500)"
>
    <RangeSlider range {min} {max} {step} {pipstep} bind:values float {pips} pushy={true} {suffix}
                 first="label" last="label"/>
</span>

<style>
    .range-slider {
        display: inline-block;
        width: 100%;
    }
</style>