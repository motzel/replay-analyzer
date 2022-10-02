<script>
    import {capitalize} from "../../utils/string.js";
    import PlayerName from "./PlayerName.svelte";
    import Date from "../common/Date.svelte";
    import Headset from "./Headset.svelte";
    import Controller from "./Controller.svelte";
    import Tag from "../common/Tag.svelte";
    import Badge from "../common/Badge.svelte";

    export let info
</script>

<h1>
    <div class="left">
        <PlayerName playerName={info?.playerName} playerId={info?.playerId}/>

        <small>
            <Date date={info?.timeSet} sync={true}/>
        </small>
    </div>

    <small class="tags">
        <Badge label="Height" tooltip="Player height" digits="2" value={info?.height}/>
        <Headset hmd={info?.hmd}/>
        <Badge tooltip="Game platform and version" label={capitalize(info?.platform)}>
            {info?.gameVersion}
        </Badge>
        <Badge tooltip="Mod version" label="Mod">
            {info?.modVersion}
        </Badge>
    </small>
</h1>

<style>
    h1 {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 1rem;
        line-height: 1;
        font-size: 2rem;
        margin: 0;
        padding: 0 0 .5rem 0;
        border-bottom: 1px solid var(--sl-color-neutral-300)
    }

    h1 .left {
        display: inline-flex;
        align-items: baseline;
        gap: 1rem;
    }

    h1 small {
        font-size: .5em;
        color: var(--sl-color-neutral-500);
    }

    h1 small.tags {
        font-weight: normal;
    }
</style>