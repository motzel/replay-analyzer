<script>
    import {tick} from "svelte";
    import Chart from "./Chart.svelte";
    import settingsStore, {DEFAULT_HIT_GROUPS} from '../../../stores/settings.js'
    import {formatNumber, formatTime} from "../../../utils/format.js";
    import {getPositionIdx, LAYERS_COUNT, LINES_COUNT} from "../grid/utils/position";
    import {gridOrder} from "../grid/utils/direction.js";
    import {debounce} from "../../../debounce.js";
    import TypesFilter, {FILTER_TYPES} from './TypesFilter.svelte'
    import Value from "../../common/Value.svelte";
    import Badge from "../../common/Badge.svelte";
    import Tag from "../../common/Tag.svelte";
    import BlockGrid from "../grid/BlockGrid.svelte";
    import HitFilterDropdown from "./HitFilterDropdown.svelte";
    import PositionFilterDropdown from "./PositionFilterDropdown.svelte";
    import DirectionFilterDropdown from "./DirectionFilterDropdown.svelte";
    import ChartType from "../ChartType.svelte";
    import Select from "../../common/Select.svelte";

    export let replay
    export let hand = "total"

    const mainColor = 'deeppink'

    let datasets = null
    let options = null

    let chartType = $settingsStore?.stats?.chart ?? "map"

    let hitGroups = $settingsStore?.hitChart?.hitGroups?.length
        ? $settingsStore.hitChart.hitGroups
        : DEFAULT_HIT_GROUPS

    let hitGroup = hitGroups[Number.isFinite($settingsStore.hitChart?.defaultHitGroup) ? $settingsStore.hitChart.defaultHitGroup : 0]

    const getScoreAssessment = (score, hitGroup) => {
        if (!hitGroup?.items?.length) return {value: 0, label: '???', color: mainColor};

        for (const item of hitGroup.items) {
            if (score >= item.value) return item;
        }

        return hitGroup.items[hitGroup.items.length - 1];
    }

    let tooltipEl;
    let tooltipData;

    let filters = {
        type: $settingsStore?.mapChart?.types ?? FILTER_TYPES.map(t => t?.items?.length ? `${t?.value}:${t?.itemValue}` : t?.value),
        hand: "total",
        score: [0, 115],
        before: [0, 70],
        accCut: [0, 15],
        after: [0, 30],
        timeDependence: [0, 1],
        beforeRating: [0, 300],
        afterRating: [0, 300],
        position: Array(LAYERS_COUNT * LINES_COUNT).fill(0).map((_, idx) => idx),
        direction: Array(gridOrder?.length ?? 0).fill(0).map((_, idx) => idx),
    }

    const tooltipHandler = async ctx => {
        tooltipData = null;

        if (!tooltipEl) return;

        tooltipEl.style.opacity = 0;

        const {chart, tooltip} = ctx ?? {};

        if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
        }

        if (tooltip.body) {
            const datasetIndexes = [];

            tooltipData = {
                title: (tooltip?.title ?? []),
                values: (tooltip?.body ?? [])
                    .map((v, idx) => {
                        const datasetIndex = tooltip?.dataPoints?.[idx]?.datasetIndex;
                        if(!Number.isFinite(datasetIndex) || datasetIndexes.includes(datasetIndex)) return null;

                        datasetIndexes.push(datasetIndex);

                        return {
                            color: tooltip?.labelTextColor?.[idx] ?? 'white',
                            backgroundColor: tooltip?.labelColors?.[idx]?.backgroundColor ?? 'gray',
                            borderColor: tooltip?.labelColors?.[idx]?.borderColor ?? 'gray',
                            borderWidth: tooltip?.labelColors?.[idx]?.borderWidth ?? 0,
                            data: tooltip?.dataPoints?.[idx] ?? null,
                        }
                    })
                    .filter(v => v)
            }

            await tick();

            const chartRect = chart.canvas.getBoundingClientRect();
            const ttRect = tooltipEl.getBoundingClientRect()

            let left = chartRect.left + tooltip.caretX + window.scrollX;
            if (left - ttRect.width / 2 < 10) left = ttRect.width / 2 + 10

            if (chartRect.right - chartRect.left - tooltip.caretX < ttRect.width / 2) {
                left -= (ttRect.width / 2) - (chartRect.right - chartRect.left - tooltip.caretX)
            }

            let top = -ttRect.height - 6 + (chart?.scales?.y?.top ?? 0);
            if (window.innerHeight < top) {
                top = window.innerHeight - 6
            }

            tooltipEl.style.opacity = 1;
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.left = `${left}px`;
            tooltipEl.style.top = `${top}px`;
            tooltipEl.style.padding = tooltip.padding + 'px ' + tooltip.padding + 'px';
            tooltipEl.style.font = tooltip.options.bodyFont.string;
        }
    }

    const shouldEventBeIncluded = (event, filters) => {
        if (!event) return false;

        if (chartType === 'hit' && event.type !== 'hit') return false;

        let val = filters.type.includes(event.type)

        if (val && hand !== 'total' && ['hit', 'miss', 'badCut'].includes(event.type)) {
            val &&= ((event.colorType === 0 && hand === 'left') || (event.colorType === 1 && hand === 'right'))
        }

        if (event.type === 'hit') {
            val &&= event.score >= filters.score[0] && event.score <= filters.score[1]
            val &&= event.beforeCut >= filters.before[0] && event.beforeCut <= filters.before[1]
            val &&= event.accCut >= filters.accCut[0] && event.accCut <= filters.accCut[1]
            val &&= event.afterCut >= filters.after[0] && event.afterCut <= filters.after[1]

            val &&= event.timeDependence >= filters.timeDependence[0] && event.timeDependence <= filters.timeDependence[1]
            val &&= event.beforeCutRating * 100 >= filters.beforeRating[0] && event.beforeCutRating * 100 <= filters.beforeRating[1]
            val &&= event.afterCutRating * 100 >= filters.afterRating[0] && event.afterCutRating * 100 <= filters.afterRating[1]
        }

        if (Number.isFinite(event.lineIdx) && Number.isFinite(event.lineLayer) && filters.position?.length !== LAYERS_COUNT * LINES_COUNT) {
            const positionIdx = getPositionIdx(event.lineLayer, event.lineIdx)
            val &&= filters.position.includes(positionIdx)
        }

        if (Number.isFinite(event.cutDirection) && filters.direction?.length !== gridOrder?.length) {
            const directionIdxs = filters.direction
                .map(idx => gridOrder?.findIndex(go => go?.order === idx))
                .filter(v => v >= 0)
            val &&= directionIdxs.includes(event.cutDirection);
        }

        return val;
    }

    function getAccChartDataFromReplay(replay, filters, chartType, hitGroup, theme) {
        if (!replay?.notes) return null;

        hitGroup.items.sort((a, b) => b.value - a.value)

        const skipped = (ctx, value) => (ctx.p0.skip || ctx.p1.skip ? value : undefined);

        let minValue = null, maxValue = null

        const pauseType = filters.type.find(f => f.startsWith('pause:'))?.substr('pause:'.length) ?? 'no'

        const pauses = (replay?.pauses ?? []).sort((a, b) => a?.time - b?.time)
        let currentPausesIdx = 0
        let totalPauseOffset = 0

        const hitGroupCount = hitGroup.items.map(item => ({...item, count: 0}))

        let pauseRegions = (pauseType !== 'no' ? pauses : [])
            .map(p => ({
                min: p?.time,
                max: p?.time + (pauseType === 'block' ? p?.duration : 0),
                color: pauseType === 'block'
                    ? (theme === 'dark' ? '#333' : '#eee')
                    : 'gray',
                labelColor: pauseType === 'block' || theme === 'dark' ? 'gray' : '#333',
                labelRotate: pauseType === 'marker',
                label: 'Pause',
                type: 'vertical',
                position: {vertical: 'top', horizontal: pauseType === 'block' ? 'right' : 'left'},
            }))
            .filter(p => Number.isFinite(p.min))

        const allEvents = replay.notes?.map(n => ({...n, type: 'hit', typeName: null}))
            .concat((replay?.misses ?? []).map(m => ({...m, type: 'miss', typeName: 'Miss'})))
            .concat((replay?.badCuts ?? []).map(b => ({...b, type: 'badCut', typeName: 'Bad cut'})))
            .concat((replay?.bombHits ?? []).map(b => ({...b, type: 'bombHit', typeName: 'Bomb hit'})))
            .concat((replay?.walls ?? []).map(w => ({...w, eventTime: w?.time, type: 'wallHit', typeName: 'Wall hit'})))
            .sort((a, b) => a.eventTime === b.eventTime ? a.idx - b.idx : a.eventTime - b.eventTime)
            .reduce((acc, event) => {
                if (Number.isFinite(event?.accCut) && Number.isFinite(event?.beforeCut) && Number.isFinite(event?.afterCut))
                    event.score = event.beforeCut + event.accCut + event.afterCut

                const shouldBeIncluded = shouldEventBeIncluded(event, filters);

                if (pauseType === 'block' && currentPausesIdx < pauses.length && pauses[currentPausesIdx].time <= event.eventTime) {
                    totalPauseOffset += pauses[currentPausesIdx].duration ?? 0

                    acc.acc.push({
                        x: pauses[currentPausesIdx].time,
                        y: null,
                    })

                    acc.fcAcc.push({
                        x: pauses[currentPausesIdx].time,
                        y: null,
                    })

                    currentPausesIdx++
                }

                const hitGroupItem = getScoreAssessment(event?.score ?? 0, hitGroup)

                if (shouldBeIncluded) {
                    const hitGroupCountItem = hitGroupCount.find(i => i.value === hitGroupItem.value)
                    if (hitGroupCountItem) hitGroupCountItem.count++;
                }

                acc.acc.push({
                    x: event.eventTime + totalPauseOffset,
                    y: !shouldBeIncluded ? null : (chartType === 'map' ? event.accuracy : event.score),
                    totalPauseOffset,
                    ...event,
                    hitGroupItem,
                })

                acc.fcAcc.push({
                    x: event.eventTime + totalPauseOffset,
                    y: !shouldBeIncluded ? null : (chartType === 'map' ? event.fcAccuracy : event.score),
                    totalPauseOffset,
                    ...event
                })

                if (shouldBeIncluded) {
                    const accVal = acc.acc[acc.acc.length - 1].y
                    const fcAccVal = acc.fcAcc[acc.fcAcc.length - 1].y

                    if (minValue === null || accVal < minValue) minValue = accVal
                    if (chartType === 'map' && (minValue === null || fcAccVal < minValue)) minValue = fcAccVal

                    if (maxValue === null || accVal > maxValue) maxValue = accVal
                    if (chartType === 'map' && (maxValue === null || fcAccVal > maxValue)) maxValue = fcAccVal
                }

                return acc;
            }, {acc: [], fcAcc: []})

        minValue -= chartType === 'map' ? minValue * 0.01 : 1;
        if (minValue < 0) minValue = 0;
        maxValue += maxValue * 0.01;
        if (chartType === 'map' && maxValue > 100) maxValue = 100;

        datasets = [
            {
                type: chartType === 'map' ? 'line' : 'scatter',
                data: allEvents.acc,
                fill: false,
                color: 'white',
                borderWidth: 2,
                cubicInterpolationMode: 'monotone',
                tension: 0.4,
                label: chartType === 'map' ? 'Acc' : 'Hit acc',
                spanGaps: true,
                segment: {
                    borderWidth: ctx => skipped(ctx, 1),
                    borderDash: ctx => skipped(ctx, [6, 6]),
                    borderColor: ctx => skipped(ctx, 'gray'),
                },

                backgroundColor: ctx => {
                    switch (ctx?.raw?.type) {
                        case 'miss':
                        case 'badCut':
                        case 'wallHit':
                            return 'orange';

                        case 'bombHit':
                            return 'orange';
                    }

                    if (chartType === 'map') return mainColor;

                    return ctx?.raw?.hitGroupItem?.color ?? mainColor
                },
                borderColor: ctx => {
                    switch (ctx?.raw?.type) {
                        case 'miss':
                        case 'badCut':
                        case 'wallHit':
                            return 'orange';

                        case 'bombHit':
                            return 'orange';
                    }

                    if (chartType === 'map') return mainColor;

                    return ctx?.raw?.hitGroupItem?.color ?? mainColor
                },
                pointRadius: ctx => {
                    if (chartType === 'hit') return 2;

                    if (ctx?.raw?.type === 'hit') return 1;

                    return 6;
                },
                hoverRadius: ctx => {
                    if (ctx?.raw?.type === 'hit') return 6;

                    return 10;
                },
                hoverBorderWidth: 6,
                pointStyle: ctx => {
                    if (ctx?.raw?.type === 'hit') return null;

                    switch (ctx?.raw?.type) {
                        case 'miss':
                            return 'crossRot';
                        case 'badCut':
                            return 'triangle';
                        case 'wallHit':
                            return 'rect';
                        case 'bombHit':
                            return 'star';
                    }

                    return null;
                },
            },
        ]

        if (chartType === 'map') datasets.push(
            {
                hidden: allEvents.fcAcc.length && allEvents.acc.length && allEvents.fcAcc[allEvents.fcAcc.length - 1].y === allEvents.acc[allEvents.acc.length - 1].y,
                type: 'line',
                data: allEvents.fcAcc,
                fill: false,
                borderColor: 'green',
                backgroundColor: 'green',
                borderWidth: 1,
                pointRadius: 0,
                cubicInterpolationMode: 'monotone',
                tension: 0.4,
                label: 'FC Acc',
                spanGaps: true,
                segment: {
                    borderWidth: ctx => skipped(ctx, 1),
                    borderDash: ctx => skipped(ctx, [6, 6]),
                },
            },
        )

        options = {
            responsive: true,
            maintainAspectRatio: true,
            layout: {
                padding: 0,
            },
            interaction: {
                intersect: false,
                mode: 'nearest',
                axis: 'x',
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: theme === 'light' ? 'black' : 'white',
                        generateLabels: chartType === 'hit'
                            ? chart => {

                                const sum = hitGroupCount.reduce((sum, item) => sum + item.count, 0)
                                return hitGroupCount
                                    .filter(item => item.count)
                                    .map(item => ({
                                        text: `${item.label ?? ''} x${item.count} / ${sum ? formatNumber(item.count / sum * 100, 2) : 0}%`,
                                        datasetIndex: 0,
                                        fillStyle: item?.color ?? mainColor,
                                        strokeStyle: item?.color ?? mainColor,
                                    }))
                            }
                            : undefined,
                    },
                    onClick: chartType === 'hit' ? () => {
                    } : undefined,
                },
                title: {
                    display: false,
                },
                tooltip: {
                    enabled: false,
                    external: tooltipHandler,
                },
                regions: {
                    regions: pauseRegions,
                },
                crosshair: {
                    line: {
                        color: '#F66',
                        width: 1,
                    },
                    sync: {
                        enabled: false
                    },
                    zoom: {
                        enabled: true,
                        zoomboxBackgroundColor: 'rgba(66,133,244,0.2)',
                        zoomboxBorderColor: '#48F',
                        zoomButtonText: 'Reset Zoom',
                        zoomButtonClass: 'reset-zoom',
                    },
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    display: true,
                    title: {
                        display: true,
                        text: 'Time',
                        color: theme === 'light' ? 'black' : 'white',
                    },
                    ticks: {
                        callback: val => Number.isFinite(val) ? formatTime(val) : null,
                        autoSkip: true,
                        stepSize: 5,
                        font: function (context) {
                            if (context.tick && context.tick.major) {
                                return {
                                    weight: 'bold',
                                };
                            }
                        },
                        color: theme === 'light' ? 'black' : 'white',
                    },

                    grid: {
                        color: 'rgba(60,60,60,.5)',
                    },
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: chartType === 'map' ? 'Map Acc' : 'Hit Acc',
                        color: theme === 'light' ? 'black' : 'white',
                    },
                    ticks: {
                        callback: val => chartType === 'map'
                            ? formatNumber(val, val === Math.floor(val) ? 0 : 1) + '%'
                            : val >= 0 && val <= 115 ? formatNumber(val, 0) : null,
                        autoSkip: true,
                        stepSize: chartType === 'map' ? .5 : 1,
                        includeBounds: chartType !== 'map',
                        precision: chartType === 'map' ? 1 : 0,
                        color: theme === 'light' ? 'black' : 'white',
                    },
                    min: minValue,
                    max: chartType === 'map' || maxValue < 115 ? maxValue : 116,
                    grid: {
                        color: 'rgba(60,60,60,.5)',
                    }
                }
            }
        }
    }

    function onChartTypeChange(e) {
        chartType = e?.detail ?? 'map'

        if (chartType === 'hit') filters.type = [...new Set([...filters.type, 'hit'])]
    }

    function updateHitGroups(hg) {
        if (!hg?.length) return

        hitGroups = hg
        hitGroup = hitGroups[Number.isFinite($settingsStore.hitChart?.defaultHitGroup) ? $settingsStore.hitChart.defaultHitGroup : 0]
    }

    const debouncedGetAccChartDataFromReplay = debounce((replay, filters, chartType, hitGroup, theme) => getAccChartDataFromReplay(replay, filters, chartType, hitGroup, theme), 300)

    $: updateHitGroups($settingsStore?.hitChart?.hitGroups)
    $: theme = $settingsStore?.theme ?? 'dark'
    $: if (hand !== filters.hand) filters.hand = hand

    $: debouncedGetAccChartDataFromReplay(replay, filters, chartType, hitGroup, theme)
</script>

<aside>
    <div>
        <ChartType value={chartType} on:change={onChartTypeChange} />
    </div>

    <div>
        <HitFilterDropdown bind:filters/>
        <PositionFilterDropdown bind:filters/>
        <DirectionFilterDropdown bind:filters/>

        {#if chartType === 'hit'}
            <Select items={hitGroups} bind:value={hitGroup} prefix="Grouping: " variant="neutral" />
        {/if}
    </div>

    {#if chartType === 'map'}
        <div>
            <TypesFilter bind:value={filters.type} disabled={chartType !== 'map'} />
        </div>
    {/if}
</aside>

<Chart {datasets} {options}>
    <svelte:fragment slot="tooltip">
        <div bind:this={tooltipEl} class="tooltip">
            {#if tooltipData}
                {@const event = tooltipData?.values?.[0]?.data?.raw}
                {@const hand = event?.colorType === 0 ? 'left' : 'right'}
                {@const valueVariant = event?.type !== 'wallHit' ? (hand === 'left' ? 'red-saber' : 'blue-saber') : 'neutral'}

                {#if Number.isFinite(event?.eventTime)}
                    <header>
                        <label>Time:</label>
                        <span>
                            {formatTime(event.eventTime)}
                            {#if event.totalPauseOffset > 0}
                                <small>(+{formatTime(event.totalPauseOffset)})</small>
                            {/if}
                        </span>

                        {#if event?.eventType !== 0}
                            <Tag variant={valueVariant}>{event?.typeName}</Tag>
                        {/if}
                    </header>
                {/if}

                {#if tooltipData?.values?.length}
                    {#if chartType !== 'hit'}
                        <section class="datasets">
                            {#each tooltipData.values as value}
                                {#if value?.data}
                                    <section class="dataset" style:--color={value.color}>
                                        <div class="box"
                                             style:--bg-color={value.backgroundColor}
                                             style:--border-color=(value.borderColor}
                                             style:--border-width=(value.borderWidth}
                                        ></div>
                                        <label>{value?.data?.dataset?.label}</label>
                                        <span>{formatNumber(value?.data?.raw?.y)}%</span>
                                    </section>
                                {/if}
                            {/each}
                        </section>
                    {/if}

                    <section class="block">
                        <div class="stats">
                            {#if event?.score}
                                <div>
                                    <Badge label="Before" {valueVariant}>
                                        <Value value={event?.beforeCut} digits="0"/>
                                    </Badge>

                                    <Badge label="Precision" {valueVariant}>
                                        <Value value={event?.accCut} digits="0"/>
                                    </Badge>

                                    <Badge label="After" {valueVariant}>
                                        <Value value={event?.afterCut} digits="0"/>
                                    </Badge>
                                </div>
                            {/if}

                            <div>
                                {#if Number.isFinite(event?.timeDependence)}
                                    <Badge label="TD" tooltip="Time dependence" {valueVariant}>
                                        <Value value={event?.timeDependence} digits="3"/>
                                    </Badge>
                                {/if}

                                {#if event?.score}
                                    <Badge label="PRE" tooltip="Pre swing" {valueVariant}>
                                        <Value value={event?.beforeCutRating} type="percent" digits="2"/>
                                    </Badge>

                                    <Badge label="POST" tooltip="Post swing" {valueVariant}>
                                        <Value value={event?.afterCutRating} type="percent" digits="2"/>
                                    </Badge>
                                {/if}
                            </div>
                        </div>

                        <div class="grid">
                            <BlockGrid block={event}/>
                        </div>
                    </section>
                {/if}
            {/if}
        </div>
    </svelte:fragment>
</Chart>

<style>
    aside {
        margin-top: 1rem;
        display: flex;
        align-items: center;
    }

    aside > *:not(:last-child) {
        margin-right: .5rem;
    }

    .tooltip {
        position: fixed;
        background-color: var(--sl-color-neutral-400);
        border-radius: 3px;
        opacity: 1;
        pointer-events: none;
        transform: translate(-50%, 0);
        width: 360px;
        transition: all 100ms ease;
        padding: .25rem;
        font-size: .875rem;
        overflow: hidden;
        z-index: 10;
    }

    :global(.sl-theme-dark) .tooltip {
        background-color: rgba(0, 0, 0, 0.85);
    }

    header {
        font-size: 1rem;
        text-align: center;
        color: white;
    }

    header span {
        font-weight: bold;
        margin-right: .5rem;
    }

    .datasets {
        text-align: center;
    }

    .dataset {
        display: inline-flex;
        align-items: center;
        gap: .25rem;
        margin-right: 1rem;
        color: var(--color, white);
    }

    .dataset span {
        font-weight: bold;
    }

    .box {
        width: .875em;
        height: .875em;
        border: var(--border-width, 0) solid gray;
        background-color: var(--bg-color, gray);
    }

    .block {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: .5rem;
    }

    .stats > div {
        margin-bottom: .25rem;
        text-align: right;
    }

    .stats > div:not(:last-of-type) {
        margin-bottom: .25rem;
    }

    .grid {
        font-size: .75rem;
    }
</style>
