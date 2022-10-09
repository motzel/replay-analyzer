<script>
    import Chart from 'chart.js/auto';

    export let datasets;
    export let options;
    export let height = '12em';

    let canvas = null;
    let chart = null;

    function setupChart(canvas, datasets, options) {
        if (!canvas || !Array.isArray(datasets) || !datasets.length) return;

        if (!chart) {
            chart = new Chart(canvas, {
                data: {datasets},
                options,
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
        height: 100%;
    }

    canvas {
        width: 100% !important;
        height: var(--height);
    }
</style>
