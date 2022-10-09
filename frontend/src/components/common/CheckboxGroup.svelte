<script>
    import {createEventDispatcher} from "svelte";

    export let items = []
    export let value = []
    export let size = "small"
    export let variant = "primary"

    const dispatch = createEventDispatcher();

    function toggle(item) {
        if (value?.includes(item.value)) {
            value = value?.filter(v => v !== item.value) ?? []
        } else {
            value = [...(value ?? []), item.value]
        }

        dispatch('change', value)
    }

    // TODO:
    function onDropdownChanged(item, e) {
        console.log(item, e?.detail?.item?.value)
    }
</script>

{#if items?.length}
    <sl-button-group>
        {#each items as item(item.value)}
            {#if !item?.items?.length}
                <sl-button class:active={value?.includes(item?.value)}
                           variant={value?.includes(item?.value) ? variant : 'default'} {size}
                           on:click={() => toggle(item)}
                >{item?.label ?? item?.value}</sl-button>
            {:else}
                <sl-dropdown on:sl-select={e => onDropdownChanged(item, e)}>
                    <sl-button {size} slot="trigger" caret>Dropdown</sl-button>
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