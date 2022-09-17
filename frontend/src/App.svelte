<script>
    import {onMount} from "svelte";
    import {Route, router} from 'tinro';
    import {setBasePath} from '@shoelace-style/shoelace/dist/utilities/base-path';
    import Nav from "./components/common/Nav.svelte";
    import Splash from "./components/views/Splash.svelte";
    import Index from "./components/views/Index.svelte";
    import Replays from "./components/views/Replays.svelte";

    let initialized = false;

    setBasePath('/src/assets/shoelace/');

    router.mode.memory();

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

{#if !initialized}
    <Splash>
        <p><small>Initializing...</small></p>
    </Splash>
{:else}
    <Nav/>

    <Route path="/">
        <Splash>
            <Index/>
        </Splash>
    </Route>

    <Route path="/replays">
        <Replays />
    </Route>
{/if}
