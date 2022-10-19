<script>
    import {createEventDispatcher} from "svelte";

    export let items = []
    export let value = []
    export let size = "small"
    export let variant = "primary"
    export let disabled = false

    const dispatch = createEventDispatcher();

    function toggle(item) {
        if (value?.includes(item.value)) {
            value = value?.filter(v => v !== item.value) ?? []
        } else {
            value = [...(value ?? []), item.value]
        }

        dispatch('change', value)
    }

    function onDropdownChanged(item, e) {
        if (!item?.value || !e?.detail?.item?.value) return;

        value = value
                ?.filter(v => !v.startsWith(`${item.value}:`))
                ?.concat([`${item.value}:${e.detail.item.value}`])
            ?? []
        item.itemValue = e.detail.item.value;
        items = items;

        dispatch('change', value)
    }
</script>

{#if items?.length}
    <sl-button-group>
        {#each items as item(item.value)}
            {#if !item?.items?.length}
                <sl-button class:active={value?.includes(item?.value)}
                           variant={value?.includes(item?.value) ? variant : 'default'} {size} {disabled}
                           on:click={() => toggle(item)}
                >{item?.label ?? item?.value}</sl-button>
            {:else}
                {@const selectedItem = item.items.find(i => i.value === item.itemValue)}
                <sl-dropdown on:sl-select={e => onDropdownChanged(item, e)} {disabled}>
                    <sl-button class:active={!selectedItem?.notActive} variant={selectedItem?.notActive ? "default" : variant} {size} {disabled} slot="trigger" caret>
                        {selectedItem?.label ?? selectedItem?.value ?? item?.label ?? item?.value}
                    </sl-button>
                    <sl-menu>
                        {#each item.items as subItem (subItem.value)}
                            <sl-menu-item value={subItem.value} checked={item?.itemValue === subItem.value}>{subItem.label}</sl-menu-item>
                        {/each}
                    </sl-menu>
                </sl-dropdown>
            {/if}
        {/each}
    </sl-button-group>
{/if}

<style>
    sl-button:not(.active):not(:hover)::part(base) {
        background: none;
    }
</style>