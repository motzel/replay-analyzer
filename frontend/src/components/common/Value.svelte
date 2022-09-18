<script>
    export let value
    export let type = 'decimal'
    export let digits = 2
</script>

{#if Number.isFinite(value)}
    <sl-format-number {type} lang={navigator?.language ?? 'en'}
                      {value}
                      minimum-fraction-digits={digits}
                      maximum-fraction-digits={digits}
    ></sl-format-number>
{/if}

<style>
</style>