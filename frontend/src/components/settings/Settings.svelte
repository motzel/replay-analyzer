<script>
    import settingsStore, {DEFAULT_HIT_GROUPS} from '../../stores/settings.js'
    import {objSet} from "../../utils/obj.js";
    import ThemePicker from "../common/ThemePicker.svelte";
    import StatType from "../replay/StatType.svelte";
    import ChartType from "../replay/ChartType.svelte";
    import TypesFilter from "../replay/chart/TypesFilter.svelte";
    import Select from "../common/Select.svelte";
    import HitGroupEdit from "./HitGroupEdit.svelte";

    let hitGroupsTabs = null;

    const NEW_HIT_GROUP = {
        label: 'New group',
        items: [
            {value: 115, label: 'Perfect', color: 'gray'},
            {value: 100, label: 'Ok', color: 'green'},
            {value: 0, label: 'Bad', color: 'red'},
        ]
    }

    function onSettingChange(e, key, type = 'string') {
        if (
            (type === 'string' && !e?.detail?.length) ||
            (type === 'array' && !Array.isArray(e?.detail)) ||
            (type === 'number' && !Number.isFinite(e?.detail))
        )
            return;

        $settingsStore = objSet($settingsStore, key, e.detail)
    }

    function onDefaultHitGroupChange(e) {
        if (!e?.detail) return;

        const idx = hitGroups?.findIndex(b => b === e.detail)
        if (idx >= 0) onSettingChange({detail: idx}, 'hitChart.defaultHitGroup', 'number')
    }

    function onRemoveHitGroup(idx) {
        if ($settingsStore?.hitChart?.hitGroups?.length <= 1) return;

        $settingsStore = objSet($settingsStore, 'hitChart.hitGroups', $settingsStore.hitChart.hitGroups.filter((hg, hgIdx) => hgIdx !== idx))

        if (hitGroupsTabs) hitGroupsTabs.show(`hit-group-${idx < hitGroups.length - 1 ? idx : idx - 1}`)
    }

    function onHitGroupEdit(idx, e) {
        if (!Number.isFinite(idx) || !e?.detail) return;

        $settingsStore = objSet($settingsStore, `hitChart.hitGroups.${idx}`, e.detail)
    }

    async function onHitGroupAdd(e) {
        if (!e?.detail || !Array.isArray(hitGroups)) return;

        $settingsStore = objSet($settingsStore, `hitChart.hitGroups`, [...hitGroups, e.detail])

        if (hitGroupsTabs) {
            setTimeout(() => hitGroupsTabs.show(`hit-group-${hitGroups.length - 1}`), 50)
        }
    }

    $: hitGroups = $settingsStore?.hitChart?.hitGroups?.length
        ? $settingsStore.hitChart.hitGroups
        : DEFAULT_HIT_GROUPS

    $: hitGroup = hitGroups[Number.isFinite($settingsStore.hitChart?.defaultHitGroup) ? $settingsStore.hitChart.defaultHitGroup : 0]
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
            <small>Select the directory containing replays. If BS is installed in the default location it is:<br/>C:\Program
                Files (x86)\Steam\steamapps\common\Beat Saber\UserData\BeatLeader\Replays</small>
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
        <StatType value={$settingsStore?.stats?.metric ?? 'avg'} on:change={e => onSettingChange(e, 'stats.metric')}/>

        <label>
            Default chart
            <small>Chart displayed by default</small>
        </label>
        <ChartType value={$settingsStore?.stats?.chart ?? 'map'} on:change={e => onSettingChange(e, 'stats.chart')}/>
    </sl-tab-panel>

    <sl-tab-panel name="map-chart">
        <label>
            Default types
            <small>Item types displayed by default</small>
        </label>
        <TypesFilter on:change={e => onSettingChange(e, 'mapChart.types'), 'array'}/>
    </sl-tab-panel>

    <sl-tab-panel name="hit-chart">
        <label>
            Default hit group
            <small>Default acc group selected</small>
        </label>
        <Select items={hitGroups} bind:value={hitGroup} variant="neutral"
                on:change={onDefaultHitGroupChange}/>

        <label>
            Custom hit groups
            <small>Create your own acc groups. You can then select them when displaying the Hit Acc chart.</small>
        </label>
        <div>
            <sl-tab-group bind:this={hitGroupsTabs}>
                {#each hitGroups as group, idx}
                    <sl-tab slot="nav" panel={`hit-group-${idx}`}>{group.label}</sl-tab>
                {/each}
                <sl-tab slot="nav" panel={`hit-group-new`}>Add new</sl-tab>

                {#each hitGroups as group, idx}
                    <sl-tab-panel name={`hit-group-${idx}`}>
                        <HitGroupEdit {group} removable={hitGroups?.length > 1}
                                      on:edit={e => onHitGroupEdit(idx, e)} on:remove={() => onRemoveHitGroup(idx)}/>
                    </sl-tab-panel>
                {/each}

                <sl-tab-panel name={`hit-group-new`}>
                    {#key hitGroups?.length}
                        <HitGroupEdit group={structuredClone(NEW_HIT_GROUP)}
                                      removable={hitGroups?.length > 1} addNew={true}
                                      on:edit={e => onHitGroupAdd(e)}/>
                    {/key}
                </sl-tab-panel>
            </sl-tab-group>
        </div>
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