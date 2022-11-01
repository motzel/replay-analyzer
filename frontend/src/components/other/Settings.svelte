<script>
    import settingsStore, {DEFAULT_BUCKETS} from '../../stores/settings.js'
    import {objSet} from "../../utils/obj.js";
    import ThemePicker from "../common/ThemePicker.svelte";
    import StatType from "../replay/StatType.svelte";
    import ChartType from "../replay/ChartType.svelte";
    import TypesFilter from "../replay/chart/TypesFilter.svelte";
    import Select from "../common/Select.svelte";

    let buckets = $settingsStore?.hitChart?.buckets?.length
        ? $settingsStore.hitChart.buckets
        : DEFAULT_BUCKETS

    let bucket = buckets[Number.isFinite($settingsStore.hitChart?.defaultBucket) ? $settingsStore.hitChart.defaultBucket : 0]

    function onSettingChange(e, key, type = 'string') {
        if (
            (type === 'string' && !e?.detail?.length) ||
            (type === 'array' && !Array.isArray(e?.detail)) ||
            (type === 'number' && !Number.isFinite(e?.detail))
        )
            return;

        $settingsStore = objSet($settingsStore, key, e.detail)
    }

    function onDefaultBucketChange(e) {
        if (!e?.detail) return;

        const idx = buckets?.findIndex(b => b === e.detail)
        if (idx >= 0) onSettingChange({detail: idx}, 'hitChart.defaultBucket', 'number')
    }
</script>

<sl-tab-group>
    <sl-tab slot="nav" panel="general">General</sl-tab>
    <sl-tab slot="nav" panel="stats">Stats</sl-tab>
    <sl-tab slot="nav" panel="map-chart">Map Acc chart</sl-tab>
    <sl-tab slot="nav" panel="hit-chart">Hit Acc chart</sl-tab>

    <sl-tab-panel name="general">
        <label>
            Application theme
            <small>Change if you like it when the screen burns your eyes.</small>
        </label>
        <ThemePicker/>

        <label>
            Replays directory
            <small>Select the directory containing replays. If BS is installed in the default location it is:<br />C:\Program Files (x86)\Steam\steamapps\common\Beat Saber\UserData\BeatLeader\Replays</small>
        </label>

        <div class="replays-directory-container">
            <sl-tooltip content="Not implemented yet">
                <sl-button variant="primary" size="small" pill disabled>
                    <sl-icon slot="prefix" name="gear"></sl-icon>
                    Select
                </sl-button>

                Not implemented yet
            </sl-tooltip>
        </div>
    </sl-tab-panel>

    <sl-tab-panel name="stats">
        <label>
            Default metric
            <small>Metric displayed by default</small>
        </label>
        <StatType value={$settingsStore?.stats?.metric ?? 'avg'} on:change={e => onSettingChange(e, 'stats.metric')} />

        <label>
            Default chart
            <small>Chart displayed by default</small>
        </label>
        <ChartType value={$settingsStore?.stats?.chart ?? 'map'} on:change={e => onSettingChange(e, 'stats.chart')} />
    </sl-tab-panel>

    <sl-tab-panel name="map-chart">
        <label>
            Default types
            <small>Item types displayed by default</small>
        </label>
        <TypesFilter on:change={e => onSettingChange(e, 'mapChart.types'), 'array'} />
    </sl-tab-panel>

    <sl-tab-panel name="hit-chart">
        <label>
            Default hit bucket
            <small>Default acc bucket selected</small>
        </label>
        <Select items={buckets} bind:value={bucket} variant="neutral"
                on:change={onDefaultBucketChange} />

        <label>
            Add custom hit buckets
            <small>Add your own acc buckets. You can then select them when displaying the Hit Acc chart.</small>
        </label>
        <div>TODO</div>
    </sl-tab-panel>
</sl-tab-group>

<style>
    label {
        display: block;
        font-weight: normal;
        margin: 2rem 0 .5rem 0;
        line-height: 1.5;
    }

    label:first-of-type {
        margin-top: 0;
    }

    label small {
        display: block;
        color: var(--sl-color-neutral-500);
        font-weight: normal;
    }

    .replays-directory-container {
        display: flex;
        align-items: center;
        gap: .5rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>