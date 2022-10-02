<script>
    import {padNumber} from "../../utils/string.js";
    import Tag from "../common/Tag.svelte";
    import Value from "../common/Value.svelte";

    export let pauses;
    export let size = 'small'

    $: duration = (pauses ?? []).reduce((sum, p) => sum + (p?.duration ?? 0), 0)
    $: total = pauses?.length ?? 0
    $: durationFormatted = duration ? (duration >= 60 ? Math.floor(duration / 60) + 'm' : '') + padNumber(Math.round(duration % 60)) + 's' : '0s'
</script>

<Tag {size} tooltip="Pauses and duration" variant="default" noRightPadding={true} noRightBorder={true}>
    Pauses

    <Tag variant="total" noLeftPadding={true} noRightPadding={true} noRightBorder={true}>
        <Tag tooltip="Total number of pauses" placement="bottom" variant="neutral" rightPadding="1.25rem" customSize={true} hoist={true}>
            <Value value={total} digits="0"/>
        </Tag>

        <Tag tooltip="Total pause time" placement="bottom" variant="neutral" leftMargin="-1rem" customSize={true} hoist={true}>
            {durationFormatted}
        </Tag>
    </Tag>
</Tag>