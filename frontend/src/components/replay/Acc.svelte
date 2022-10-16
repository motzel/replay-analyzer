<script>
    import Value from "../common/Value.svelte";

    export let value

    $: percent = Number.isFinite(value) ? value / 100 : null
</script>

{#if percent}
    <Value type="percent" value={percent}/>
{/if}
