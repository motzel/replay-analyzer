<script>
    import Tag from "./Tag.svelte";
    import Value from "./Value.svelte";

    export let label = ''
    export let tooltip = null
    export let stat
    export let digits = 2
    export let size = 'small'
    export let type = 'decimal'
    export let variant = 'default'
    export let reverse = false

    $: min = stat?.min ?? 0
    $: avg = stat?.avg ?? 0
    $: median = stat?.med ?? 0
    $: max = stat?.max ?? 0
</script>

<Tag {size} {tooltip} {variant} noRightPadding={true} noRightBorder={true}>
    {label}

    <Tag {variant} noLeftPadding={true} noRightPadding={true}>
        <Tag tooltip="Minimum" placement="bottom" variant={reverse ? 'success' : 'warning'} rightPadding="1.25rem" customSize={true}>
            <Value value={min} {digits} {type}/>
        </Tag>

        <Tag tooltip="Average" placement="bottom" variant="primary" rightPadding="1rem" leftMargin="-1rem"
             customSize={true}>
            <Value value={avg} digits={2} {type}/>
        </Tag>

        <Tag tooltip="Median" placement="bottom" variant="total" rightPadding="1rem" leftMargin="-1rem"
             customSize={true}>
            <Value value={median} {digits} {type}/>
        </Tag>

        <Tag tooltip="Maximum" placement="bottom" variant={reverse ? 'warning' : 'success'} leftMargin="-1rem">
            <Value value={max} {digits} {type}/>
        </Tag>
    </Tag>
</Tag>