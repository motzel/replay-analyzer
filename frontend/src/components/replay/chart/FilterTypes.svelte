<script context="module">
    export const FILTER_TYPES = [
        {value: 'hit', label: 'Hit'},
        {value: 'miss', label: 'Miss'},
        {value: 'badCut', label: 'Bad cut'},
        {value: 'bombHit', label: 'Bomb hit'},
        {value: 'wallHit', label: 'Wall hit'},
        {
            value: 'pause',
            itemValue: 'marker',
            label: 'Pause',
            items: [
                {value: 'no', label: 'No pauses', notActive: true},
                {value: 'marker', label: 'Pause markers'},
                {value: 'block', label: 'Pause blocks'},
            ]
        },
    ]
</script>

<script>
    import CheckboxGroup from "../../common/CheckboxGroup.svelte";

    export let value = FILTER_TYPES.map(t => t?.items?.length ? `${t?.value}:${t?.itemValue}` : t?.value)
    export let disabled = false

    $: items = FILTER_TYPES?.reduce((carry, item) => {
        if (item.value === 'pause') {
            item.itemValue = (value ?? []).find(v => v?.startsWith('pause:'))?.substr(6) ?? 'marker';
        }

        carry.push(item)

        return carry
    }, [])
</script>

<CheckboxGroup items={FILTER_TYPES} bind:value {disabled} on:change />