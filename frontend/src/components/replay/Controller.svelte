<script>
    import Tag from "../common/Tag.svelte";

    export let controller

    $: name = controller && controller !== 'Unknown' ? controller : null
</script>

{#if name}
    <Tag tooltip="Controllers">{name}</Tag>
{/if}