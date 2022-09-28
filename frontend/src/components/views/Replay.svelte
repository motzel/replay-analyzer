<script>
    import {router} from 'tinro';
    import replaysStore from '../../stores/replays.js'
    import Acc from "../replay/Acc.svelte";
    import HandsBadge from "../common/HandsBadge.svelte";
    import Song from "../replay/song/Song.svelte";
    import Badge from "../common/Badge.svelte";
    import ReplayHeader from "../replay/ReplayHeader.svelte";
    import PausesBadge from "../replay/PausesBadge.svelte";
    import StatsBadge from "../common/StatsBadge.svelte";
    import PositionGrid from "../replay/grid/PositionGrid.svelte";
    import DirectionGrid from "../replay/grid/DirectionGrid.svelte";

    export let filepath;

    let isLoading = false
    let replay, replayFull
    let error

    const hash = router.location.hash.get()

    async function loadReplay(path) {
        if (!path?.length) return

        try {
            isLoading = true
            error = null
            replay = null
            replayFull = null

            replay = await replaysStore.load(path)

            if (!data?.notes) replaysStore.load(path, true).then(r => replayFull = r).catch(_ => _)
            else replayFull = replay
        } catch (err) {
            error = err
        } finally {
            isLoading = false
        }
    }

    $: backUrl = `/replays#${hash}`
    $: path = decodeURIComponent(filepath)
    $: loadReplay(path)

    $: data = replayFull ?? replay

    $: console.warn(data)
</script>

<article>
    {#if isLoading}
        <p>Loading replay...</p>
    {:else if error}
        <div class="error">{error}</div>
    {:else if replay}
        <section class="replay">
            <ReplayHeader info={data?.info}/>

            <Song info={data?.info}/>

            <Badge label="ACC" tooltip="Accuracy">
                <Acc value={data?.info?.accuracy}/>
            </Badge>

            <Badge label="FC ACC" tooltip="Full Combo Accuracy (predicted scores for all misses)">
                <Acc value={data?.info?.fcAccuracy}/>
            </Badge>

            <Badge label="Score" digits="0" value={data?.info?.score}/>

            <Badge label="Height" digits="2" value={data?.info?.height}/>

            <Badge label="JD" tooltip="Jump Distance" digits="2" value={data?.info?.jumpDistance}/>

            <PausesBadge pauses={data?.pauses}/>

            <HandsBadge label="Notes" tooltip="Number of notes" digits="0"
                        total={data?.stats?.total?.notes}
                        left={data?.stats?.left?.notes}
                        right={data?.stats?.right?.notes}/>

            <HandsBadge label="Combo" tooltip="Maximum combo achieved" digits="0"
                        total={data?.info?.maxCombo}
                        left={data?.info?.maxLeftCombo}
                        right={data?.info?.maxRightCombo}/>

            <HandsBadge label="Misses" tooltip="Number of missed notes" digits="0"
                        total={data?.stats?.total?.misses}
                        left={data?.stats?.left?.misses}
                        right={data?.stats?.right?.misses}/>

            <HandsBadge label="Bad cuts" tooltip="Number of bad cuts" digits="0"
                        total={data?.stats?.total?.badCuts}
                        left={data?.stats?.left?.badCuts}
                        right={data?.stats?.right?.badCuts}/>

            <HandsBadge label="Bomb hits" tooltip="Number of bomb hits" digits="0"
                        total={data?.stats?.total?.bombHits}
                        left={data?.stats?.left?.bombHits}
                        right={data?.stats?.right?.bombHits}/>

            <Badge label="Wall hits" digits="0" value={data?.walls?.length ?? 0}/>

            {#each [
                {name: 'Before', tooltip: 'Points for before swing', key: 'beforeCut', digits: 0, type: 'decimal'},
                {name: 'Precision', tooltip: 'Points for precision', key: 'accCut', digits: 0, type: 'decimal'},
                {name: 'After', tooltip: 'Points for after swing', key: 'afterCut', digits: 0, type: 'decimal'},
                {name: 'Hit', tooltip: 'Total points', key: 'score', digits: 0, type: 'decimal'},
                {name: 'PRE', tooltip: 'PRE swing', key: 'preSwing', digits: 2, type: 'percent'},
                {name: 'POST', tooltip: 'POST swing', key: 'postSwing', digits: 2, type: 'percent'},
                {
                    name: 'TD',
                    tooltip: 'Time dependence',
                    key: 'timeDependence',
                    digits: 2,
                    type: 'decimal',
                    reverse: true
                },
            ] as stat}
                <div>
                    <StatsBadge variant="default" label={`${stat.name} left`} tooltip={stat.tooltip ?? null}
                                digits={stat.digits}
                                type={stat.type} reverse={stat?.reverse ?? false}
                                stat={data?.stats?.left?.[stat.key]}
                    />

                    <StatsBadge variant="neutral" label={`${stat.name} total`} tooltip={stat.tooltip ?? null}
                                digits={stat.digits}
                                type={stat.type} reverse={stat?.reverse ?? false}
                                stat={data?.stats?.total?.[stat.key]}
                    />

                    <StatsBadge variant="default" label={`${stat.name} right`} tooltip={stat.tooltip ?? null}
                                digits={stat.digits}
                                type={stat.type} reverse={stat?.reverse ?? false}
                                stat={data?.stats?.right?.[stat.key]}
                    />
                </div>
            {/each}

            Direction GRID
            <div class="grids">
                <DirectionGrid stats={data?.stats} hand="total" type="min" />
                <DirectionGrid stats={data?.stats} hand="total" type="avg" />
                <DirectionGrid stats={data?.stats} hand="total" type="med" />
                <DirectionGrid stats={data?.stats} hand="total" type="max" />
            </div>

            Position GRID
            <div class="grids">
                <PositionGrid stats={data?.stats} hand="total" type="min" />
                <PositionGrid stats={data?.stats} hand="total" type="avg" />
                <PositionGrid stats={data?.stats} hand="total" type="med" />
                <PositionGrid stats={data?.stats} hand="total" type="max" />
            </div>

        </section>
    {:else }
        <p>Can not load replay file.</p>
    {/if}

    <div style="margin-top: 3rem">
        <a href={backUrl} style="color: var(--sl-color-danger-500)">Back</a>
    </div>
</article>

<style>
    .replay {
        text-align: left;
    }

    .replay :global(> *) {
        margin-bottom: .5rem;
    }

    .error {
        color: var(--sl-color-danger-500);
    }

    .grids {
        font-size: .875rem;
    }

    /* TODO: remove it */
    .grids :global(> *) {
        margin-right: 1rem;
        margin-bottom: 1rem;
    }
</style>