<script>
    let alertEl
</script>

<sl-alert bind:this={alertEl} variant="primary" duration="3000" closable>
    <sl-icon slot="icon" name="info-circle"></sl-icon>
    <strong>This is super informative</strong><br/>
    You can tell by how pretty the alert is.
</sl-alert>

<sl-button variant="primary" size="small" on:click={() => alertEl.toast()}>
    <sl-icon slot="prefix" name="info-circle"></sl-icon>
    Alert test
</sl-button>