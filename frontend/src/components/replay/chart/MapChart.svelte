<script>
    import {tick} from "svelte";
    import Chart from "./Chart.svelte";
    import theme from '../../../stores/theme.js'
    import {formatNumber, formatTime} from "../../../utils/format.js";
    import Value from "../../common/Value.svelte";
    import Badge from "../../common/Badge.svelte";
    import Tag from "../../common/Tag.svelte";
    import BlockGrid from "../grid/BlockGrid.svelte";

    export let replay

    let tooltipEl;
    let tooltipData;

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
            tooltipData = {
                title: (tooltip?.title ?? []),
                values: (tooltip?.body ?? []).map((v, idx) => {
                    return {
                        color: tooltip?.labelTextColor?.[idx] ?? 'white',
                        backgroundColor: tooltip?.labelColors?.[idx]?.backgroundColor ?? 'gray',
                        borderColor: tooltip?.labelColors?.[idx]?.borderColor ?? 'gray',
                        borderWidth: tooltip?.labelColors?.[idx]?.borderWidth ?? 0,
                        data: tooltip?.dataPoints?.[idx] ?? null,
                    }
                })
            }

            await tick();

            const chartRect = ctx.chart.canvas.getBoundingClientRect();
            const ttRect = tooltipEl.getBoundingClientRect()

            let left = chartRect.left + tooltip.caretX + window.scrollX;
            if (left - ttRect.width / 2 < 10) left = ttRect.width / 2 + 10

            if (chartRect.right - chartRect.left - tooltip.caretX < ttRect.width / 2) {
                left -= (ttRect.width / 2) - (chartRect.right - chartRect.left - tooltip.caretX)
            }

            let top = chartRect.top + tooltip.caretY + 6;
            if (window.innerHeight < top + ttRect.height) {
                top = window.innerHeight - ttRect.height - 6
            }

            tooltipEl.style.opacity = 1;
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.left = `${left}px`;
            tooltipEl.style.top = `${top}px`;
            tooltipEl.style.padding = tooltip.padding + 'px ' + tooltip.padding + 'px';
            tooltipEl.style.font = tooltip.options.bodyFont.string;
        }
    }

    function getAccChartDataFromReplay(replay) {
        if (!replay?.notes) return null;

        const skipped = (ctx, value) => (ctx.p0.skip || ctx.p1.skip ? value : undefined);

        let minValue = null, maxValue = null

        const allEvents = replay.notes?.map(n => ({...n, type: 'hit', typeName: null}))
            .concat((replay?.misses ?? []).map(m => ({...m, type: 'miss', typeName: 'Miss'})))
            .concat((replay?.badCuts ?? []).map(b => ({...b, type: 'badCut', typeName: 'Bad cut'})))
            .concat((replay?.bombHits ?? []).map(b => ({...b, type: 'bombHit', typeName: 'Bomb hit'})))
            .concat((replay?.walls ?? []).map(w => ({...w, eventTime: w?.time, type: 'wallHit', typeName: 'Wall hit'})))
            .sort((a, b) => a.eventTime === b.eventTime ? a.idx - b.idx : a.eventTime - b.eventTime)
            .reduce((acc, event) => {
                if (Number.isFinite(event?.accCut) && Number.isFinite(event?.beforeCut) && Number.isFinite(event?.afterCut))
                    event.score = event.beforeCut + event.accCut + event.afterCut

                // TODO: add filtering
                const shouldBeFilteredOut = false; //Math.random() > 0.5;

                acc.acc.push({
                    x: event.eventTime,
                    y: shouldBeFilteredOut ? null : event.accuracy,
                    ...event
                })

                acc.fcAcc.push({
                    x: event.eventTime,
                    y: shouldBeFilteredOut ? null : event.fcAccuracy,
                    ...event
                })

                if (minValue === null || event.accuracy < minValue) minValue = event.accuracy
                if (minValue === null || event.fcAccuracy < minValue) minValue = event.fcAccuracy

                if (maxValue === null || event.accuracy > maxValue) maxValue = event.accuracy
                if (maxValue === null || event.fcAccuracy > maxValue) maxValue = event.fcAccuracy

                return acc;
            }, {acc: [], fcAcc: []})

        minValue -= minValue * 0.02;
        if (minValue < 0) minValue = 0;
        maxValue += maxValue * 0.02;
        if (maxValue > 100) maxValue = 100;

        return {
            datasets: [
                {
                    type: 'line',
                    data: allEvents.acc,
                    fill: false,
                    color: 'white',
                    borderWidth: 2,
                    hitRadius: 3,
                    hoverRadius: 3,
                    cubicInterpolationMode: 'monotone',
                    tension: 0.4,
                    label: 'Acc',
                    spanGaps: true,
                    segment: {
                        borderWidth: ctx => skipped(ctx, 1),
                        borderDash: ctx => skipped(ctx, [6, 6]),
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

                        return 'deeppink'
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

                        return 'deeppink'
                    },
                    pointRadius: ctx => {
                        if (ctx?.raw?.type === 'hit') return 0;

                        return 6;
                    },
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
            ],
            options: {
                responsive: true,
                maintainAspectRatio: true,
                layout: {
                    padding: {
                        right: 0,
                    },
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        display: false,
                        position: 'top',
                        labels: {
                            color: $theme === 'light' ? 'black' : 'white',
                        }
                    },
                    title: {
                        display: false,
                    },
                    tooltip: {
                        enabled: false,
                        position: 'nearest',
                        callbacks: {
                            title: function (ctx) {
                                if (!ctx?.[0]?.parsed?.x) return '';

                                return formatTime(ctx[0].parsed.x);
                            },
                        },
                        external: tooltipHandler,
                    }
                },
                scales: {
                    xAxis: {
                        type: 'linear',
                        display: true,
                        title: {
                            display: true,
                            text: 'Time',
                            color: $theme === 'light' ? 'black' : 'white',
                        },
                        ticks: {
                            callback: val => val === Math.floor(val) ? formatTime(val) : null,
                            autoSkip: false,
                            major: {
                                enabled: true,
                            },
                            font: function (context) {
                                if (context.tick && context.tick.major) {
                                    return {
                                        weight: 'bold',
                                    };
                                }
                            },
                            color: $theme === 'light' ? 'black' : 'white',
                        },

                        grid: {
                            color: 'rgba(60,60,60,.5)',
                        },
                    },
                    yAxis: {
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Acc',
                            color: $theme === 'light' ? 'black' : 'white',
                        },
                        ticks: {
                            callback: val => (val === Math.floor(val) ? val + '%' : null),
                            precision: 0,
                            color: $theme === 'light' ? 'black' : 'white',
                        },
                        min: minValue,
                        max: maxValue,
                        grid: {
                            color: 'rgba(60,60,60,.5)',
                        }
                    }
                }
            },
        }
    }

    $: ({datasets, options} = getAccChartDataFromReplay(replay, $theme) ?? {})
</script>

<Chart {datasets} {options}>
    <svelte:fragment slot="tooltip">
        <div bind:this={tooltipEl} class="tooltip">
            {#if tooltipData}
                {@const event = tooltipData?.values?.[0]?.data?.raw}
                {@const hand = event?.colorType === 0 ? 'left' : 'right'}
                {@const valueVariant = event?.type !== 'wallHit' ? (hand === 'left' ? 'red-saber' : 'blue-saber') : 'neutral'}

                {#if tooltipData?.title?.length}
                    {#each tooltipData.title as title}
                        <header>
                            <label>Time:</label>
                            <span>{title}</span>

                            {#if event?.eventType !== 0}
                                <Tag variant={valueVariant}>{event?.typeName}</Tag>
                            {/if}
                        </header>
                    {/each}
                {/if}

                {#if tooltipData?.values?.length}
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
                            <BlockGrid block={event} />
                        </div>
                    </section>
                {/if}
            {/if}
        </div>
    </svelte:fragment>
</Chart>

<style>
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
