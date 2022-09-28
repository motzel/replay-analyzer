<script>
    import SongIcon from "./SongIcon.svelte";
    import Tag from "../../common/Tag.svelte";

    export let info
</script>

{#if info}
    <section>
        <SongIcon {info}/>

        <div class="replay">
            <span class="name">{info?.songName}</span>
            <span class="mapper">{info?.mapper}</span>
        </div>
    </section>
{/if}

<style>
    section {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    section > div {
        display: flex;
        flex-direction: column;
    }

    .name {
        font-weight: 900;
        font-size: 1.25em;
    }

    .mapper {
        color: var(--sl-color-neutral-500)
    }
</style>