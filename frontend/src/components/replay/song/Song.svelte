<script>
    import SongIcon from "./SongIcon.svelte";
    import Date from "../../common/Date.svelte";

    export let info
</script>

{#if info}
    <section on:click>
        <SongIcon {info}/>

        <div class="replay">
            <div class="song">
                <span class="name">{info?.songName}</span>
                <span class="mapper">{info?.mapper}</span>
            </div>

            <div>
                <span class="player-name">{info?.playerName}</span>
                <span class="timeset"><Date date={info?.timeSet} sync={true}/></span>
            </div>
        </div>
    </section>
{/if}

<style>
    section {
        display: flex;
        align-items: center;
        gap: .75rem;
        line-height: 1;
    }

    section .replay {
        display: flex;
        flex-direction: column;
    }

    .song {
        white-space: nowrap;
        overflow: hidden;
        padding-bottom: .75em;
    }

    .name {
        font-weight: 900;
        font-size: 1em;
    }

    .mapper, .timeset {
        color: var(--sl-color-neutral-500);
        margin-left: .5em;
    }

</style>