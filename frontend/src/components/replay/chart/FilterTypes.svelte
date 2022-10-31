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
</script>

<CheckboxGroup items={FILTER_TYPES} bind:value {disabled} on:change />