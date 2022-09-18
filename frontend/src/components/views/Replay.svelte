<script>
    import {router} from 'tinro';
    export let filename;

    const hash = router.location.hash.get()

    $: backUrl = `/replays#${hash}`
</script>

<section>
    TODO: load {filename}

    <div>
        <a href={backUrl}>Back</a>
    </div>
</section>

<style>
</style>