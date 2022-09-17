<script>
    import {router} from 'tinro';
    import Difficulty from "../common/Difficulty.svelte"
    import Acc from "../common/Acc.svelte"
    import Date from "../common/Date.svelte";

    export let replay
</script>

{#if replay}
    <sl-card class="replay" style="--border-radius: var(--sl-border-radius-large);">
        <div slot="image">
            <div class="bg-image"
                 style:background-image={`url(https://eu.cdn.beatsaver.com/${replay?.info?.hash?.toLowerCase()}.jpg)`}
                 on:click={() => router.goto(`/replays/${replay?.filename}`)}
            >
                <div class="line">
                    <span></span>

                    <Difficulty diff={replay?.info?.difficulty}/>
                </div>

                <div class="line">
                    {#if replay?.info?.accuracy === replay?.info.fcAccuracy}
                        <sl-tag size="small" variant="success" pill>
                            FC
                        </sl-tag>
                    {:else}
                        <span></span>
                    {/if}

                    <Acc value={replay?.info?.accuracy}/>
                </div>
            </div>
        </div>

        <div class="body">
            <header>
                {replay?.info?.songName}
            </header>
        </div>

        <div slot="footer">
            <small>
                <Date date={replay?.info?.timeSet} />
            </small>
            <sl-button variant="primary" size="small" pill
                       on:click={() => router.goto(`/replays/${replay?.filename}`)}>
                Analyze
            </sl-button>
        </div>
    </sl-card>
{/if}

<style>
    .replay {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .replay::part(base) {
        height: 100%;
        justify-content: space-between;
    }

    .replay::part(image) {
        height: 8rem;
    }

    .replay::part(body) {
        flex: 1;
    }

    .replay::part(footer) {
        padding: .75rem 1rem;
    }

    .replay .bg-image {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        width: 100%;
        height: 8rem;
        padding: .5rem;
        background-color: var(--sl-color-neutral-200);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        cursor: pointer;
    }

    .replay .bg-image .line {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .replay .body {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }

    .replay .body header {
        font-weight: 700;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box !important;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        white-space: normal;
    }

    .replay [slot='footer'] {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .replay [slot='footer'] small {
        color: var(--sl-color-neutral-500);
    }
</style>