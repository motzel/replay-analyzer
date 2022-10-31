<script>
    import nav from "../../stores/nav.js";
    import search from '../../stores/search.js'
    import filteredReplaysStore from "../../stores/filtered-replays.js";
    import logo from '../../../assets/images/logo.png'
    import ThemePicker from "./ThemePicker.svelte";
    import ArrowIcon from "./ArrowIcon.svelte";
    import Song from "../replay/song/Song.svelte";

    const NUM_OF_RESULTS = 7;

    let searchPopupActive = false;

    function onSearchChange(e) {
        search.updateValue(e?.target?.value ?? '')
    }

    function onSearchFocus() {
        if ($search.global) searchPopupActive = true
    }

    function onSearchBlur() {
        setTimeout(() => searchPopupActive = false, 300)
    }

    $: searchResults = $filteredReplaysStore?.slice(0, NUM_OF_RESULTS)?.sort((a,b) => b?.info?.timeSet?.localeCompare(a?.info?.timeSet)) ?? []
</script>

<nav>
    {#if $nav?.length > 1}
        <sl-tooltip content="Back">
                <span class="back" on:click={() => nav.back()}>
                    <ArrowIcon rotate={270}/>
                </span>
        </sl-tooltip>
    {:else}
        <img alt="App logo" id="logo" src="{logo}">
    {/if}

    <section class="center">
        <sl-popup placement="bottom-start" distance="2" active={searchPopupActive}>
            <span class="input-box" slot="anchor">
                <sl-input placeholder="Search..." size="medium" pill on:input={onSearchChange} value={$search.value}
                          on:focus={onSearchFocus} on:blur={onSearchBlur}>
                    <sl-icon name="search" slot="suffix"></sl-icon>
                </sl-input>
            </span>

            <div class="search-dropdown">
                {#if searchResults.length}
                    {#each searchResults as result(result?.absPath ?? Math.random())}
                        <Song info={result?.info} on:click={() => nav.go(`/replays/${result?.absPath}`)} />
                    {/each}

                    {#if $filteredReplaysStore?.length > NUM_OF_RESULTS}
                        <a href="/replays">More replays...</a>
                    {/if}
                {:else}
                    <p>No results.</p>
                {/if}
            </div>
        </sl-popup>
    </section>

    <section class="right">
        <sl-tooltip content="Settings not implemented yet" placement="bottom">
            <sl-icon-button class="settings" name="gear" label="Settings"></sl-icon-button>
        </sl-tooltip>

        <ThemePicker/>
    </section>
</nav>

<style>
    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 3.5rem;
        padding: .25rem .5rem;
        background-color: var(--color-nav);
    }

    #logo, .back {
        font-size: 2rem;
        max-height: 2.5rem;
        margin-right: 1rem;
        grid-row: 1/-1;
        grid-column: 1/-1;
    }

    .back {
        cursor: pointer;
        margin-right: 1.5rem;
        color: var(--sl-color-neutral-600);
    }

    .center {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .center .input-box, .center sl-input {
        width: 100%;
        max-width: min(50rem, 100%);
    }

    sl-popup::part(popup) {
        z-index: var(--sl-z-index-dropdown);
    }

    .search-dropdown {
        width: min(50rem, calc(100vw - 186px));
        background-color: var(--color-background);
        border: 1px solid var(--sl-color-neutral-300);
        border-radius: var(--sl-border-radius-large);
        text-align: left;
        overflow: hidden;
        padding: 1em 0;
    }

    .search-dropdown :global(> *) {
        padding: .5rem 1em;
        cursor: pointer;
        transition: all 300ms;
    }

    .search-dropdown :global(> .song:hover) {
        background-color: var(--sl-color-primary-100);
    }

    .search-dropdown a {
        display: inline-block;
        margin-top: .5em;
        color: var(--sl-color-primary-500);
        text-decoration: none;
    }

    .search-dropdown a:hover {
        font-weight: bold;
        background-color: transparent;
    }

    .search-dropdown p {
        text-align: center;
        cursor: auto;
    }

    .right {
        display: flex;
        align-items: center;
        gap: .25rem;
        margin-left: 1rem;
    }

    .settings {
        font-size: 1.25rem;
    }
</style>