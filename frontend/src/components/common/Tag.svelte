<script>
    export let name = null;
    export let placement = 'top'
    export let size = 'small'
    export let variant = 'neutral'
    export let tooltip = null
    export let noLeftPadding = false
    export let noRightPadding = false
    export let noRightBorder = false
    export let custom = false
    export let customSize = false

    export let color = 'var(--sl-color-neutral-800)'
    export let bgColor = 'var(--sl-color-neutral-50)'
    export let borderColor = 'var(--sl-color-neutral-200)'
    export let leftPadding = '.5rem'
    export let rightPadding = '.5rem'
    export let leftMargin = '0'

    function updateStyle(variant) {
        switch (variant) {
            case 'red-saber':
                color = 'var(--sl-color-red-800)'
                bgColor = 'var(--sl-color-red-50)'
                borderColor = 'var(--sl-color-red-200)'
                break;

            case 'blue-saber':
                color = 'var(--sl-color-blue-800)'
                bgColor = 'var(--sl-color-blue-50)'
                borderColor = 'var(--sl-color-blue-200)'
                break;

            case 'default':
                color = 'var(--sl-color-neutral-800)'
                bgColor = 'var(--sl-color-neutral-200)'
                borderColor = 'var(--sl-color-neutral-300)'
                break;

            case 'success':
                color = 'var(--sl-color-success-800)'
                bgColor = 'var(--sl-color-success-50)'
                borderColor = 'var(--sl-color-success-200)'
                break;

            case 'danger':
                color = 'var(--sl-color-danger-800)'
                bgColor = 'var(--sl-color-danger-50)'
                borderColor = 'var(--sl-color-danger-200)'
                break;

            case 'warning':
                color = 'var(--sl-color-warning-800)'
                bgColor = 'var(--sl-color-warning-50)'
                borderColor = 'var(--sl-color-warning-200)'
                break;

            case 'primary':
                color = 'var(--sl-color-primary-800)'
                bgColor = 'var(--sl-color-primary-50)'
                borderColor = 'var(--sl-color-primary-200)'
                break;

            case 'neutral':
            default:
                color = 'var(--sl-color-neutral-800)'
                bgColor = 'var(--sl-color-neutral-50)'
                borderColor = 'var(--sl-color-neutral-200)'
                break;
        }

        if (!customSize) {
            leftPadding = noLeftPadding ? '0' : '.5rem'
            rightPadding = noRightPadding ? '0' : '.5rem'
        }
    }

    $: if (!custom) updateStyle(variant)
</script>

<sl-tooltip content={tooltip} {placement} disabled={!tooltip ? true : null}>
    <sl-tag {size} pill
            style:--color={color}
            style:--bg-color={bgColor}
            style:--border-color={borderColor}
            style:--padding-left={leftPadding}
            style:--padding-right={rightPadding}
            style:--left-margin={leftMargin}
            style:--right-border-style={noRightBorder ? 'none' : 'solid'}
    >
        <slot>
            {name}
        </slot>
    </sl-tag>
</sl-tooltip>

<style>
    sl-tag::part(base) {
        color: var(--color);
        background: var(--bg-color);
        border-color: var(--border-color);
        padding-left: var(--padding-left);
        padding-right: var(--padding-right);
        margin-left: var(--left-margin);
        border-right-style: var(--right-border-style);
    }
</style>