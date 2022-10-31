<script>
    import settingsStore from '../../stores/settings.js'
    import {objSet} from "../../utils/obj.js";
    import ThemePicker from "../common/ThemePicker.svelte";
    import StatType from "../replay/StatType.svelte";
    import ChartType from "../replay/ChartType.svelte";

    function onSettingChange(e, key) {
        if (!e?.detail?.length) return;

        $settingsStore = objSet($settingsStore, key, e.detail)
    }
</script>

<sl-tab-group>
    <sl-tab slot="nav" panel="general">General</sl-tab>
    <sl-tab slot="nav" panel="stats">Stats</sl-tab>
    <sl-tab slot="nav" panel="map-chart">Map Acc chart</sl-tab>
    <sl-tab slot="nav" panel="hit-chart">Hit Acc chart</sl-tab>

    <sl-tab-panel name="general">
        <label>Application theme</label>
        <ThemePicker/>

        <label>Replays directory</label>
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
        <label>Default metric</label>
        <StatType value={$settingsStore?.stats?.metric ?? 'avg'} on:change={e => onSettingChange(e, 'stats.metric')} />

        <label>Default chart</label>
        <ChartType value={$settingsStore?.stats?.chart ?? 'map'} on:change={e => onSettingChange(e, 'stats.chart')} />
    </sl-tab-panel>

    <sl-tab-panel name="map-chart">
        <label>Default types</label>
        <div>TODO</div>
    </sl-tab-panel>

    <sl-tab-panel name="hit-chart">
        <label>Default hit bucket</label>
        <div>TODO</div>

        <label>Add custom hit buckets</label>
        <div>TODO</div>
    </sl-tab-panel>
</sl-tab-group>

<style>
    label {
        display: block;
        font-weight: normal;
        margin: 2rem 0 .5rem 0;
    }

    label:first-of-type {
        margin-top: 0;
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