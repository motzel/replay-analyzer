<script>
    import Tag from "./Tag.svelte";
    import Value from "./Value.svelte";

    export let label = ''
    export let value = 0
    export let digits = 2
    export let size = 'small'
    export let tooltip = null
    export let variant = 'default'
    export let valueVariant = 'neutral'
</script>

<Tag {size} {variant} {tooltip} noRightPadding={true} noRightBorder={true}>
    <span>
        {label}
    </span>

    <Tag variant={valueVariant}>
        <slot>
            <Value {value} {digits}/>
        </slot>
    </Tag>
</Tag>

<style>
    span {
        padding-right: .125em;
    }
</style>