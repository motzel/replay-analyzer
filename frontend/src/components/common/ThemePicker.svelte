<script>
    import theme from '../../stores/theme.js'

    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('sl-theme-dark');
        } else {
            document.documentElement.classList.remove('sl-theme-dark');
        }
    }

    function onThemeChanged(e) {
        if (!e?.detail?.item?.value?.length) return;

        $theme = e.detail.item.value
    }

    $: setTheme($theme)
</script>

<sl-dropdown class="theme-picker" on:sl-select={onThemeChanged}>
    <sl-button size="small" variant="default" slot="trigger" caret pill>
        {#if $theme === 'light'}
            <sl-icon slot="prefix" name="brightness-high"></sl-icon>
        {:else}
            <sl-icon slot="prefix" name="moon"></sl-icon>
        {/if}
    </sl-button>
    <sl-menu>
        {#key $theme}
            <sl-menu-item value="light" checked={$theme === 'light' ? true : null}>Light</sl-menu-item>
            <sl-menu-item value="dark" checked={$theme === 'dark' ? true : null}>Dark</sl-menu-item>
        {/key}
    </sl-menu>
</sl-dropdown>

<style>
    .theme-picker {
        z-index: 30;
    }
</style>

