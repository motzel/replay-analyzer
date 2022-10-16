<script>
    import Tag from "../common/Tag.svelte";

    export let hmd

    $: name = hmd ?? null
</script>

{#if name?.length}
    <Tag tooltip="Headset">{name?.replace(/_/g, ' ')}</Tag>
{/if}