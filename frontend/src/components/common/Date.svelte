<script>
    export let date
    export let sync = false
</script>

{#if date?.length}
    <sl-relative-time date={date} lang={navigator?.language ?? 'en'} sync={sync ? true : null}></sl-relative-time>
{/if}