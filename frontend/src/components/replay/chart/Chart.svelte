<script>
    import Chart from 'chart.js/auto';
    import {CrosshairPlugin} from 'chartjs-plugin-crosshair';
    import regionsPlugin from './utils/regions-plugin';

    export let datasets;
    export let options;
    export let height = '12em';

    Chart.register(CrosshairPlugin);

    let canvas = null;
    let chart = null;

    function setupChart(canvas, datasets, options) {
        if (!canvas || !Array.isArray(datasets) || !datasets.length) return;

        if (!chart) {
            chart = new Chart(canvas, {
                data: {datasets},
                options,
                plugins: [regionsPlugin],
            });
        } else {
            chart.options = options;
            chart.data = {datasets};
            chart.update();
        }
    }

    $: setupChart(canvas, datasets, options);
</script>

{#if datasets?.length}
    <section class="chart" style="--height: {height}">
        <canvas class="chartjs" bind:this={canvas}/>
        <slot name="tooltip" />
    </section>
{/if}

<style>
    .chart {
        position: relative;
        height: 100%;
    }

    canvas {
        width: 100% !important;
        height: var(--height);
    }

    section :global(.reset-zoom) {
        position: absolute;
        top: .25rem;
        right: .5rem;
        border-color: var(--sl-color-danger-600);
        background-color: var(--sl-color-danger-600);
        padding: .25rem;
    }
</style>
