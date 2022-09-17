<script>
    export let value;

    $: percent = Number.isFinite(value) ? value / 100 : null
</script>

{#if percent}
    <sl-tag size="small" pill>
        <sl-format-number type="percent" lang={navigator?.language ?? 'en'}
                          value={percent}
                          minimum-fraction-digits="2"
                          maximum-fraction-digits="2"
        ></sl-format-number>
    </sl-tag>
{/if}

<style>
</style>