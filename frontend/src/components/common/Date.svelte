<script>
    export let date
</script>

{#if date?.length}
    <sl-relative-time date={date} lang={navigator?.language ?? 'en'}></sl-relative-time>
{/if}