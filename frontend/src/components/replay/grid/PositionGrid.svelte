<script>
    import Grid from "./Grid.svelte";
    import CheckIcon from "../../common/CheckIcon.svelte";

    export let grid
    export let statType = 'avg'
    export let withCounts = false
    export let selectable = false;
    export let selected = [];

    $: digits = statType === 'avg' ? 2 : 0

    $: finalGrid = grid?.[statType]?.map((value, idx) => ({
        value,
        idx,
        count: grid?.count?.[idx] ?? null
    })) ?? null
</script>

{#if finalGrid?.length === 12}
    <Grid grid={finalGrid} {digits} cols={4} rows={3} {withCounts} on:click>
        <svelte:fragment slot="tooltip" let:item let:value let:count let:idx let:digits>
            <slot name="tooltip" {item} {value} {count} {idx} {digits}>
                Notes count: {count}
            </slot>
        </svelte:fragment>

        <svelte:fragment slot="background" let:idx>
            {#if selectable && (selected ?? []).includes(idx)}
                <span class="bg">
                    <CheckIcon/>
                </span>
            {/if}
        </svelte:fragment>
    </Grid>
{/if}

<style>
    .bg :global(svg) {
        font-size: 2rem;
        color: var(--sl-color-neutral-700);
    }
</style>
