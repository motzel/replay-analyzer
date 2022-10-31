<script>
    import {createEventDispatcher} from "svelte";

    export let value
    export let items = []
    export let variant = 'neutral'
    export let size = 'small'
    export let disabled = false

    const dispatch =createEventDispatcher()

    function onDropdownChanged(e) {
        if (!e?.detail?.item?.value) return;

        value = e.detail.item.value

        dispatch('change', value)
    }
</script>

<sl-dropdown on:sl-select={onDropdownChanged} {disabled}>
    <sl-button class:active={true} {variant} {size} {disabled} slot="trigger" caret>
        {value?.label ?? value?.value}
    </sl-button>
    <sl-menu>
        {#each items as item (item)}
            <sl-menu-item value={item} checked={item === value}>{item.label ?? item}</sl-menu-item>
        {/each}
    </sl-menu>
</sl-dropdown>