<script>
    import logo from '../../assets/images/logo.png'
</script>

<main>
    <img alt="App logo" id="logo" src="{logo}">
    <h1>Beat Leader<br/>Replay Analyzer</h1>

    <slot>
        <p><small>Initializing...</small></p>
    </slot>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        align-items: center;
    }

    img {
        max-height: min(25rem, 50%)
    }

    h1 {
        line-height: 1.5;
    }
</style>