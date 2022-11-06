<script>
    import {createEventDispatcher} from "svelte";
    import ArrowIcon from "../common/ArrowIcon.svelte";

    export let group
    export let removable = true
    export let addNew = false

    const dispatch = createEventDispatcher()

    let editedGroup = null

    function updateMinMax() {
        if (!editedGroup) return;

        editedGroup.items = editedGroup.items
            .sort((a, b) => a.value - b.value)
            .reduce((carry, item) => {
                carry.push({
                    ...item,
                    min: carry.length ? Math.max(carry[carry.length - 1].value + 1, 0) : 0
                })

                return carry
            }, [])
            .sort((a, b) => b.value - a.value)
            .reduce((carry, item) => {
                carry.push({
                    ...item,
                    max: carry.length ? Math.min(carry[carry.length - 1].value - 1, 115) : 115
                })

                return carry
            }, [])
    }

    function onValueUpdate(idx, e) {
        if (!editedGroup?.items?.[idx]) return

        const item = editedGroup.items[idx]
        const value = e?.target?.valueAsNumber ?? NaN;
        if (isNaN(value) || value < item.min || value > item.max) {
            item.error = true
        } else {
            item.value = value
            item.error = false
            updateMinMax()
        }

        editedGroup = editedGroup
    }

    function onColorChange(idx, e) {
        if (!editedGroup?.items?.[idx]) return

        editedGroup.items[idx].color = e?.target?.value ?? '#808080'
    }

    function onEdit() {
        if (!group) return

        editedGroup = structuredClone(group)
        updateMinMax()
    }

    function onSave() {
        if (!editedGroup) return

        dispatch('edit', editedGroup)

        if (!addNew) editedGroup = null
    }

    function onAddBucket(idx) {
        if (!editedGroup?.items?.[idx]) return

        editedGroup.items = editedGroup.items.slice(0, idx + 1)
            .concat([{value: editedGroup.items[idx].value - 1, label: 'Label', color: 'gray'}])
            .concat(editedGroup.items.slice(idx + 1, editedGroup.items.length))

        updateMinMax()
    }

    function onRemoveBucket(idx) {
        if (!editedGroup?.items?.[idx]) return

        editedGroup.items = editedGroup.items.filter((i, iIdx) => iIdx !== idx)

        updateMinMax()
    }

    $: if (addNew) onEdit()
    $: currentValue = editedGroup ?? group
    $: isValid = editedGroup?.label?.length && editedGroup?.items?.every(i => i?.label?.length && !i.error)
</script>

{#if currentValue}
    <section class:edit={currentValue !== group}>
        <header>
            <sl-input class:error={!currentValue.label.length} placeholder="Group name..." size="small"
                      minlength="1" maxlength="30"
                      value={currentValue.label}
                      required disabled={currentValue === group}
                      help-text={!currentValue.label.length ? 'Group name is required' : ''}
                      on:sl-input={e => editedGroup.label = e?.target?.value ?? ''}
            ></sl-input>
        </header>

        {#each currentValue.items as item, idx}
            <div class="item" style:--input-color={currentValue?.items?.[idx]?.color ?? 'var(--sl-color-neutral-900)'}>
                <sl-tooltip content="Bucket color">
                    <sl-color-picker size="small" hoist value={item.color}
                                     disabled={currentValue === group}
                                     on:sl-change={e => onColorChange(idx, e)}
                    ></sl-color-picker>
                </sl-tooltip>

                <sl-tooltip content="Bucket name">
                    <sl-input class:error={!item.label.length} placeholder="Bucket name..." size="small"
                              minlength="1" maxlength="30"
                              value={item.label}
                              help-text={!item.label.length ? 'Bucket name is required' : ''}
                              required disabled={currentValue === group}
                              on:sl-input={e => editedGroup.items[idx].label = e?.target?.value ?? ''}
                    ></sl-input>
                </sl-tooltip>

                <sl-tooltip content="The lower limit of the hit value for this bucket">
                    <sl-input class:error={item.error} type="number" size="small" step="1" value={item.value}
                              min={item.min} max={item.max}
                              required disabled={currentValue === group || item.value === 0}
                              on:sl-input={e => onValueUpdate(idx, e)}
                    ></sl-input>
                </sl-tooltip>

                {#if currentValue === editedGroup && editedGroup?.items?.length > 2 && item.value < 115}
                    <div class="icons">
                        {#if item.value !== 0}
                            <sl-tooltip content="Remove bucket">
                                <sl-icon-button class="remove" name="trash" size="small"
                                                on:click={() => onRemoveBucket(idx)}
                                ></sl-icon-button>
                            </sl-tooltip>
                        {/if}
                    </div>
                {/if}
            </div>

            {#if item.value > 0}
                <div class="item icons">
                    <div></div>
                    <div>
                        {#if currentValue === editedGroup && editedGroup?.items?.[idx + 1]?.value < item.value - 1}
                            <sl-tooltip content="Add new bucket">
                                <sl-icon-button name="plus-circle" on:click={() => onAddBucket(idx)}></sl-icon-button>
                            </sl-tooltip>
                        {/if}
                    </div>
                    <div style:color={currentValue?.items?.[idx + 1]?.color ?? 'var(--sl-color-neutral-600)'}>
                        <ArrowIcon/>
                    </div>
                </div>
            {/if}
        {/each}
    </section>

    <div class="buttons">
        {#if currentValue !== group || addNew}
            <sl-button variant="primary" size="small" disabled={!isValid} on:click={onSave}>
                <sl-icon slot="prefix" name="check-lg"></sl-icon>

                Save
            </sl-button>

            {#if !addNew}
                <sl-button variant="neutral" size="small" on:click={() => editedGroup = null}>Cancel</sl-button>
            {/if}
        {/if}

        {#if currentValue !== editedGroup && !addNew}
            <sl-button variant="primary" size="small" on:click={onEdit}>
                <sl-icon slot="prefix" name="pencil"></sl-icon>

                Edit group
            </sl-button>

            {#if removable}
                <sl-button variant="danger" size="small" on:click={() => dispatch('remove')}>
                    <sl-icon slot="prefix" name="trash"></sl-icon>

                    Remove group
                </sl-button>
            {/if}
        {/if}
    </div>
{/if}

<style>
    section {
        display: flex;
        flex-direction: column;
        gap: .125rem;
        max-width: 25rem;
    }

    header {
        margin-bottom: 1rem;
    }

    header sl-input {
        width: 19.25rem;
        margin-left: 2.25rem;
    }

    .item {
        display: flex;
        align-items: flex-start;
        gap: .5rem;
    }

    .item :global(> *:nth-child(1)) {
        width: 2.25rem;
    }

    .item :global(> *:nth-child(2)), .item :global(*:nth-child(2) sl-input) {
        width: 14rem;
    }

    .item.icons :global(sl-icon-button::part(base)) {
        padding: 0;
    }

    .item :global(>*:nth-child(3)), .item :global(*:nth-child(3) sl-input) {
        width: 4.5rem;
    }

    .item :global(*:nth-child(3) sl-input::part(input)) {
        color: var(--input-color, var(--sl-color-neutral-900));
        text-align: center;
    }

    .item :global(*:nth-child(3) sl-input::part(base)) {
        opacity: 1;
    }

    .item.icons :global(*:nth-child(3) > *) {
        margin-left: .5rem;
    }

    .item.icons {
        gap: 0;
        margin: 0;
        padding: 0;
        color: var(--sl-color-neutral-600);
    }

    .item.icons > * {
        text-align: center;
        line-height: 1;
    }

    .item .icons {
        margin-top: .5rem;
    }

    .buttons {
        margin-top: 1rem;
        margin-left: 2.25rem;
    }

    header .buttons {
        margin-top: 0;
        margin-bottom: 1rem;
    }

    sl-input.error {
        --sl-input-help-text-color: var(--sl-color-danger-700);

        --sl-input-border-color: var(--sl-color-danger-300);
        --sl-input-border-color-hover: var(--sl-color-danger-300);
        --sl-input-border-color-focus: var(--sl-color-danger-300);
        --sl-input-ring-color: var(--sl-color-danger-500);
        --sl-input-focus-ring-color: var(--sl-color-danger-500);
        --sl-input-hover-ring-color: var(--sl-color-danger-500);
    }

    sl-color-picker {
        position: relative;
        top: -.25rem
    }

    sl-color-picker::part(trigger) {
        opacity: 1;
    }

    .icons {
        display: inline-flex;
        align-items: center;
    }

    sl-icon-button.remove::part(base) {
        padding: 0;
    }

    sl-icon-button.remove::part(base):active,
    sl-icon-button.remove::part(base):focus {
        color: var(--sl-color-neutral-600);
    }

    sl-icon-button.remove::part(base):hover {
        color: var(--sl-color-danger-600);
    }
</style>