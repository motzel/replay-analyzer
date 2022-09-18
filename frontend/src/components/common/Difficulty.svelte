<script>
    export let diff;
    export let mode

    const diffColors = {
        easy: 'MediumSeaGreen',
        normal: '#59b0f4',
        hard: 'tomato',
        expert: '#bf2a42',
        expertplus: '#8f48db',
    };

    $: bgColor = diffColors?.[diff?.toLowerCase()] ?? 'var(--sl-color-neutral-0)'
</script>

{#if diff?.length}
    <sl-tag size="small" pill style:--fg="white" style:--bg={bgColor}>{diff} {mode?.length && mode != 'Standard' ? `/ ${mode}` : ''}</sl-tag>
{/if}

<style>
    sl-tag::part(base) {
        color: var(--fg);
        background-color: var(--bg);
        border-color: var(--bg);
    }
</style>