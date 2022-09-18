<script>
    import {onMount} from "svelte";
    import {Route, router} from 'tinro';
    import {setBasePath} from '@shoelace-style/shoelace/dist/utilities/base-path';
    import Splash from "./components/views/Splash.svelte";
    import Index from "./components/views/Index.svelte";
    import Replays from "./components/views/Replays.svelte";
    import Layout from "./components/views/Layout.svelte";
    import Replay from "./components/views/Replay.svelte";

    let initialized = false;

    setBasePath('/src/assets/shoelace/');

    router.mode.memory();

    async function initShoelace() {
        return Promise.all([
            import('@shoelace-style/shoelace/dist/components/button/button'),
            import('@shoelace-style/shoelace/dist/components/input/input'),
            import('@shoelace-style/shoelace/dist/components/icon/icon'),
            import('@shoelace-style/shoelace/dist/components/alert/alert'),
            import('@shoelace-style/shoelace/dist/components/dropdown/dropdown'),
            import('@shoelace-style/shoelace/dist/components/button/button'),
            import('@shoelace-style/shoelace/dist/components/menu/menu'),
            import('@shoelace-style/shoelace/dist/components/menu-item/menu-item'),
            import('@shoelace-style/shoelace/dist/components/tooltip/tooltip'),
            import('@shoelace-style/shoelace/dist/components/card/card'),
            import('@shoelace-style/shoelace/dist/components/tag/tag'),
            import('@shoelace-style/shoelace/dist/components/relative-time/relative-time'),
            import('@shoelace-style/shoelace/dist/components/format-number/format-number'),
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
    <Route path="/">
        <Splash>
            <Index/>
        </Splash>
    </Route>

    <Route path="/replays/*">
        <Route path="/">
            <Layout let:scroll let:setScroll>
                <Replays {scroll} {setScroll}/>
            </Layout>
        </Route>

        <Route path="/:filename" let:meta>
            <Layout>
                <Replay filename={meta.params.filename} />
            </Layout>
        </Route>
    </Route>
{/if}
