<script>
    import Value from "../common/Value.svelte";
    import AccRing from "./AccRing.svelte";

    export let stats
    export let key = 'score'
    export let hand = 'total'
    export let statType = 'avg'
    export let type = 'decimal'
    export let size = "6em"
    export let width = '0.4em'
    export let trackColor = 'var(--sl-color-neutral-200)'
    export let trackWidth = '0.25em'
    export let withLabel = true

    function process(stats, hand, key, statType) {
        const keyName = ['beforeCut', 'accCut', 'afterCut', 'score'].includes(key) ? key : 'score'
        let label = key
        const statValue = stats?.[hand]?.[keyName]?.[statType]
        let maxValue = 115
        switch (keyName) {
            case 'beforeCut':
                maxValue = 70;
                label = 'Before';
                break;
            case 'accCut':
                maxValue = 15;
                label = 'Precision';
                break;
            case 'afterCut':
                maxValue = 30;
                label = 'After';
                break;
            case 'score':
                maxValue = 115;
                label = type === 'percent' ? 'Acc' : 'Hit';
                break;
        }

        return {
            keyName,
            label,
            statValue,
            maxValue
        }
    }

    $: ({keyName, label, statValue, maxValue} = process(stats, hand, key, statType))
    $: percentageValue = Number.isFinite(statValue) && statValue >= 0 && statValue <= maxValue ? statValue / maxValue : null
    $: value = type === 'percent' ? percentageValue : statValue
    $: digits = statType === 'avg' || type === 'percent' ? 2 : 0

    $: altValue = type === 'percent' ? statValue : percentageValue
    $: altType = type === 'percent' ? 'decimal' : 'percent'
    $: altDigits = statType === 'avg' || type !== 'percent' ? 2 : 0

    $: color = hand === 'right' ? 'var(--blue-saber)' : (hand === 'left' ? 'var(--red-saber)' : 'deeppink')
</script>

<AccRing value={percentageValue} label={withLabel ? label : null} {size} {color} {width} {trackColor} {trackWidth}>
    <svelte:fragment slot="value">
        <Value {value} {type} {digits}/>
    </svelte:fragment>

    <svelte:fragment slot="tooltip">
        <Value value={altValue} type={altType} digits={altDigits}/>
    </svelte:fragment>
</AccRing>
