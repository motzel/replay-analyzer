<script>
    import Tag from "./Tag.svelte";

    export let diff;
    export let mode
    export let short = false;

    const diffColors = {
        easy: 'MediumSeaGreen',
        normal: '#59b0f4',
        hard: 'tomato',
        expert: '#bf2a42',
        expertplus: '#8f48db',
    };

    const diffShortNames = {
        easy: 'E',
        normal: 'N',
        hard: 'H',
        expert: 'Ex',
        expertplus: 'E+',
    }

    $: bgColor = diffColors?.[diff?.toLowerCase()] ?? 'var(--sl-color-neutral-0)'
    $: name = short ? diffShortNames?.[diff?.toLowerCase()] ?? null : diff ?? null
</script>

{#if name?.length}
    <Tag custom={true} color="white" {bgColor}
         borderColor={bgColor}>{name} {!short && mode?.length && mode != 'Standard' ? `/ ${mode}` : ''}</Tag>
{/if}

<style>
    sl-tag::part(base) {
        color: var(--fg);
        background-color: var(--bg);
        border-color: var(--bg);
    }
</style>