<script>
    export let rotate = 0;
</script>

<svg style:--rotate={`${rotate ?? 0}deg`}
        fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>

<style>
    svg {
        width: 1em;
        height: 1em;
        rotate: var(--rotate, 0deg);
        transform-origin: 50% 50%;
    }
</style>