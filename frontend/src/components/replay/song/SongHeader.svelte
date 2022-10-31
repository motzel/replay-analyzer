<script>
    import MultiAccRing from "../MultiAccRing.svelte";
    import Difficulty from "./Difficulty.svelte";
    import HandsBadge from "../../common/HandsBadge.svelte";
    import Badge from "../../common/Badge.svelte";
    import PausesBadge from "../PausesBadge.svelte";
    import Tag from "../../common/Tag.svelte";
    import Duration from "../Duration.svelte";

    export let data

    $: info = data?.info
    $: stats = data?.stats
    $: walls = data?.walls
    $: pauses = data?.pauses
    $: fullCombo = !stats?.total?.misses && !stats?.total?.badCuts && !stats?.total?.bombHits && !walls?.length
</script>

{#if info}
    <section
            style:--bg-image-url={`url(https://eu.cdn.beatsaver.com/${info?.hash?.toLowerCase()}.jpg)`}
    >
        <div class="wrapper">
            <div class="acc">
                <MultiAccRing value={info?.accuracy ? info.accuracy / 100 : null}
                              label="Accuracy"
                              tooltip="Map accuracy"
                              value2={info?.fcAccuracy ? info.fcAccuracy / 100 : null}
                              label2="FC"
                              tooltip2="Full Combo Accuracy (predicted scores for all misses)"
                              size="9em"
                />
            </div>

            <div class="song-info">
                <span class="name">
                    <span>{info?.songName}</span>
                    <small class="mapper">{info?.mapper}</small>
                </span>
                <div>
                    <span class="diff">
                        <Difficulty diff={info?.difficulty} mode={info?.mode}/>
                        {#if info?.modifiers?.length}
                            <span class="mods">
                                {#each info.modifiers as mod}
                                    <Tag name={mod}/>
                                {/each}
                            </span>
                        {/if}
                    </span>

                    <Duration duration={info?.endTime}/>

                    <HandsBadge label="Notes" tooltip="Number of notes" digits="0"
                                total={stats?.total?.notes}
                                left={stats?.left?.notes}
                                right={stats?.right?.notes}/>
                </div>
            </div>

            <footer>
                {#if stats}
                    {#if fullCombo}
                        <Tag variant="success" tooltip="Full combo">FC</Tag>
                    {:else}
                        {#if stats?.total?.misses}
                            <HandsBadge label="Misses" tooltip="Number of missed notes" digits="0"
                                        total={stats?.total?.misses}
                                        left={stats?.left?.misses}
                                        right={stats?.right?.misses}/>
                        {/if}

                        {#if stats?.total.badCuts}
                            <HandsBadge label="Bad cuts" tooltip="Number of bad cuts" digits="0"
                                        total={stats?.total?.badCuts}
                                        left={stats?.left?.badCuts}
                                        right={stats?.right?.badCuts}/>
                        {/if}

                        {#if stats?.total?.bombHits}
                            <HandsBadge label="Bomb hits" tooltip="Number of bomb hits" digits="0"
                                        total={stats?.total?.bombHits}
                                        left={stats?.left?.bombHits}
                                        right={stats?.right?.bombHits}/>
                        {/if}
                    {/if}
                {/if}

                {#if walls?.length}
                    <Badge label="Wall hits" tooltip="Number of wall hits" digits="0" value={walls?.length ?? 0}/>
                {/if}

                {#if pauses?.length}
                    <PausesBadge {pauses}/>
                {/if}

                {#if !fullCombo}
                    <HandsBadge label="Combo" tooltip="Maximum combo achieved" digits="0"
                                total={info?.maxCombo}
                                left={info?.maxLeftCombo}
                                right={info?.maxRightCombo}/>
                {/if}

                <Badge label="JD" tooltip="Jump Distance" digits="2" value={info?.jumpDistance}/>

                <Badge label="Score" tooltip="Just a score" digits="0" value={info?.score}/>
            </footer>
        </div>
    </section>
{/if}

<style>
    section {
        display: flex;
        background-color: var(--sl-color-neutral-200);
        background-image: var(--bg-image-url);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        height: 11em;
    }

    .wrapper {
        position: relative;
        height: 100%;
        flex: 1;
        background: rgba(255, 255, 255, .75);
        display: grid;
        grid-template-columns: 10em 1fr;
        grid-template-rows: 2.5em 1fr;
        grid-template-areas:
                "acc song"
                "acc  song"
                "acc  footer";
        overflow: hidden;
    }

    :global(.sl-theme-dark) .wrapper {
        background: rgba(0, 0, 0, .75);
    }

    .diff {
        display: inline-block;
        justify-self: center;
        align-self: center;
    }

    .acc {
        grid-area: acc;
        margin: 0 .5em;
        place-self: center;
    }

    .song-info {
        grid-area: song;
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 100%;
        overflow: hidden;
    }

    .name {
        font-weight: 900;
        font-size: 1.5em;
        line-height: 1.35;
        padding: .25em .25em .25em 0;
        word-break: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .mapper {
        color: var(--sl-color-neutral-600);
        font-size: .6em;
    }

    footer {
        padding: .25em 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-end;
        gap: .5em;
    }

    @media screen and (max-width: 599px) {
        .mapper {
            display: none;
        }
    }
</style>