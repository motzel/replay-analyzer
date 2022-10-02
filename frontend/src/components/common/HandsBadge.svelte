<script>
    import Tag from "./Tag.svelte";
    import Value from "./Value.svelte";

    export let label = ''
    export let tooltip = null
    export let total = 0
    export let left = 0
    export let right = 0
    export let digits = 2
    export let size = 'small'
</script>

<Tag {size} {tooltip} variant="default" noRightPadding={true} noRightBorder={true}>
    {label}

    <Tag variant="total" noLeftPadding={true} noRightPadding={true}>
        <span class="total">
        <Tag tooltip="Total" placement="bottom" variant="neutral" rightPadding="1.25rem" customSize={true} hoist={true}>
            <Value value={total} {digits}/>
        </Tag>
            </span>

        <Tag tooltip="Left hand" placement="bottom" variant="red-saber" rightPadding="1rem" leftMargin="-1rem" customSize={true} hoist={true}>
            <Value value={left} {digits}/>
        </Tag>

        <Tag tooltip="Right hand" placement="bottom" variant="blue-saber" leftMargin="-1rem" hoist={true}>
            <Value value={right} {digits}/>
        </Tag>
    </Tag>
</Tag>

<style>
    .total {
        font-weight: bold;
    }
</style>