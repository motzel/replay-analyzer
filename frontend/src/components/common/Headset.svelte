<script>
    import Tag from "./Tag.svelte";

    export let hmd

    $: name = hmd ?? null
</script>

{#if name}
    <Tag tooltip="Headset">{name}</Tag>
{/if}