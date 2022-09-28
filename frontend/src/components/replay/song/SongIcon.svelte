<script>
    import Difficulty from "./Difficulty.svelte";
    import Tag from "../../common/Tag.svelte";

    export let info
</script>

{#if info?.hash?.length}
    <span class="song-icon">
        <img src={`https://eu.cdn.beatsaver.com/${info?.hash?.toLowerCase()}.jpg`}/>
        <span class="diff">
            <Difficulty diff={info?.difficulty} mode={info?.mode} short={true}/>
        </span>

        {#if info?.leftHanded}
            <span class="left-handed">
            <Tag variant="red-saber" name="LH" tooltip="Left handed"/>
            </span>
        {/if}
    </span>
{/if}

<style>
    .song-icon {
        position: relative;
        display: inline-block;
    }

    .song-icon > img {
        width: 4rem;
        height: 4rem;
        border-radius: var(--sl-border-radius-large);
    }

    .song-icon > .diff {
        position: absolute;
        bottom: 0;
        right: -.5rem;
    }

    .song-icon > .left-handed {
        position: absolute;
        top: -.5rem;
        right: -.5rem;
    }
</style>