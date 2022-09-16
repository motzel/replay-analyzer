<script>
    import {onMount} from "svelte";
    import {setBasePath} from '@shoelace-style/shoelace/dist/utilities/base-path';
    import ThemePicker from "./components/common/ThemePicker.svelte";
    import Index from "./components/pages/Index.svelte";
    import Splash from "./components/pages/Splash.svelte";

    let initialized = false;

    setBasePath('/src/assets/shoelace/');

    async function initShoelace() {
        return Promise.all([
            import('@shoelace-style/shoelace/dist/components/button/button'),
            import('@shoelace-style/shoelace/dist/components/icon/icon'),
            import('@shoelace-style/shoelace/dist/components/alert/alert'),
            import('@shoelace-style/shoelace/dist/components/dropdown/dropdown'),
            import('@shoelace-style/shoelace/dist/components/button/button'),
            import('@shoelace-style/shoelace/dist/components/menu/menu'),
            import('@shoelace-style/shoelace/dist/components/menu-item/menu-item'),
        ])
    }

    onMount(async () => {
        await initShoelace();

        initialized = true
    })
</script>

<ThemePicker/>

<Splash>
    {#if initialized}
        <Index/>
    {:else}
        <p><small>Initializing...</small></p>
    {/if}
</Splash>

