<script>
    import logo from '../../assets/images/logo.png'
    import ThemePicker from "./ThemePicker.svelte";
</script>

<nav>
    <img alt="App logo" id="logo" src="{logo}">

    <section class="center">
        <sl-tooltip content="Search not implemented yet">
            <sl-input placeholder="Search..." size="medium" pill>
                <sl-icon name="search" slot="suffix"></sl-icon>
            </sl-input>
        </sl-tooltip>
    </section>

    <section class="right">
        <sl-tooltip content="Settings not implemented yet">
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

    #logo {
        max-height: 2.5rem;
        margin-right: 1rem;
    }

    .center {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .center sl-input {
        width: 100%;
        max-width: min(50rem, 100%);
    }

    .center sl-input::part(input) {
        cursor: not-allowed;
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