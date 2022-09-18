<script>
    import {BrowserOpenURL} from "../../../wailsjs/runtime/runtime.js";

    export let playerName
    export let playerId

    const onClick = () => {
        if (!playerId?.length) return

        BrowserOpenURL(`https://www.beatleader.xyz/u/${playerId}`)
    }

    $: clickable = !!playerId?.length
</script>

{#if playerName?.length}
    {#if clickable}
        <sl-tooltip content="Click to go to player's profile">
            <span class:clickable={clickable} on:click={onClick}>{playerName}</span>
        </sl-tooltip>
    {:else}
        <span>{playerName}</span>
    {/if}
{/if}

<style>
    .clickable {
        cursor: pointer;
    }
</style>