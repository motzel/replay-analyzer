<script>
    import settingsStore from '../../stores/settings.js'

    function setTheme(theme) {
        if (theme === 'light') {
            document.documentElement.classList.remove('sl-theme-dark');
        } else {
            document.documentElement.classList.add('sl-theme-dark');
        }
    }

    function onThemeChanged(e) {
        if (!e?.target?.value?.length) return;

        $settingsStore = {...$settingsStore, theme: e.target.value}
    }

    $: theme = $settingsStore?.theme ?? 'dark'
    $: setTheme(theme)
</script>

<sl-radio-group label="Select a stat type" value={theme}
                on:sl-change={onThemeChanged}>
    <sl-radio-button size="small" value="dark">
        <sl-icon slot="prefix" name="moon"></sl-icon>
        Dark
    </sl-radio-button>

    <sl-radio-button size="small" value="light">
        <sl-icon slot="prefix" name="brightness-high"></sl-icon>
        Light
    </sl-radio-button>
</sl-radio-group>
