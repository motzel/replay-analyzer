<script>
    import Nav from "../common/Nav.svelte";

    let scroll = 0
    let el

    const onScroll = e => scroll = e?.target?.scrollTop ?? 0

    const setScroll = value => {
        if (!el) return

        el.scrollTop = value
    }
</script>

<main>
    <Nav/>

    <article bind:this={el} on:scroll={onScroll}>
        <slot {scroll} {setScroll}/>
    </article>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow-y: hidden;
    }

    article {
        flex: 1;
        overflow-x: hidden;
        overflow-y: scroll;
        padding: 1rem;
    }

    article::-webkit-scrollbar {
        width: 0.25rem;
    }
    article::-webkit-scrollbar-track {
        background: var(--color-background);
    }
    article::-webkit-scrollbar-thumb {
        background-color: var(--sl-color-primary-500);
        border-radius: 6px;
        border: 3px solid var(--sl-color-primary-500);
    }
</style>