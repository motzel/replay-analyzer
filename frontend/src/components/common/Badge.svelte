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
    export let reversed = false
</script>

<Tag {size} {variant} {tooltip} noRightPadding={!reversed} noRightBorder={!reversed} noLeftPadding={reversed} noLeftBorder={reversed}>
    {#if !reversed}
    <span>
        {label}
    </span>
    {/if}

    <Tag variant={valueVariant}>
        <slot>
            <Value {value} {digits}/>
        </slot>
    </Tag>

    {#if reversed}
    <span class="reversed">
        {label}
    </span>
    {/if}
</Tag>

<style>
    span {
        padding-right: .125em;
    }
    span.reversed {
        padding-left: .125em;
    }
</style>