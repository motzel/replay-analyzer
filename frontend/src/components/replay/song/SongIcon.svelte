<script>
    import Difficulty from "./Difficulty.svelte";
    import Tag from "../../common/Tag.svelte";
    import Acc from "../Acc.svelte";

    export let info
</script>

{#if info?.hash?.length}
    <span class="song-icon">
        <img src={`https://eu.cdn.beatsaver.com/${info?.hash?.toLowerCase()}.jpg`}/>
        <span class="diff">
            <Difficulty diff={info?.difficulty} mode={info?.mode} short={true}/>
        </span>

        <span class="acc">
            <Tag>
                <Acc value={info?.accuracy} />
            </Tag>
        </span>
    </span>
{/if}

<style>
    .song-icon {
        position: relative;
        display: inline-block;
    }

    .song-icon > img {
        width: 3.5rem;
        max-height: 3.5rem;
        border-radius: var(--sl-border-radius-large);
    }

    .song-icon > .diff {
        position: absolute;
        top: -.5rem;
        left: -.75rem;
    }

    .song-icon > .acc {
        position: absolute;
        bottom: .5rem;
        left: -.75rem;
    }
</style>