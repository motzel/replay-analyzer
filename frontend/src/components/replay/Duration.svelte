<script>
    import {padNumber} from "../../utils/string";
    import Tag from "../common/Tag.svelte";

    export let duration;

    function format(duration) {
        if (!Number.isFinite(duration)) return null;

        const rounded = Math.round(duration)
        const minutes = Math.floor(rounded / 60)
        const seconds = padNumber(Math.round(rounded % 60))

        return Number.isFinite(duration)
            ? `${minutes}:${seconds}`
            : null
    }

    $: formatted = format(duration)
</script>

{#if formatted?.length}
    <Tag tooltip="Duration" digits="0">
        {formatted}
    </Tag>
{/if}