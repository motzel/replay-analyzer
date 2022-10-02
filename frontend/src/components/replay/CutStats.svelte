<script>
    import Grid from "./Grid.svelte";
    import HandRing from "./HandRing.svelte";
    import Tag from "../common/Tag.svelte";
    import Value from "../common/Value.svelte";
    import Badge from "../common/Badge.svelte";

    export let stats
    export let withCounts = true

    let statType = "avg"
    let hand = "total"
</script>

{#if stats}
    <section>
        <header class="stats">
            <sl-radio-group label="Select a stat type" name={statType} value="avg"
                            on:sl-change={e => statType = e?.target?.value}>
                <sl-radio-button size="small" value="min">Min</sl-radio-button>
                <sl-radio-button size="small" value="avg">Average</sl-radio-button>
                <sl-radio-button size="small" value="med">Median</sl-radio-button>
                <sl-radio-button size="small" value="max">Max</sl-radio-button>
            </sl-radio-group>
        </header>

        <div class="cut stats left">
            <Tag tooltip="Before" placement="bottom">
                <Value value={stats?.left?.beforeCut?.[statType]} digits="2"/>
            </Tag>

            <Tag tooltip="Precision" placement="bottom">
                <Value value={stats?.left?.accCut?.[statType]} digits="2"/>
            </Tag>

            <Tag tooltip="After" placement="bottom">
                <Value value={stats?.left?.afterCut?.[statType]} digits="2"/>
            </Tag>
        </div>

        <div class="ring left">
            <HandRing stats={stats} key="score" hand="left" {statType}/>
        </div>

        <div class="alt stats left">
            <Badge label="TD" tooltip="Time dependence">
                <Value value={stats?.left?.timeDependence?.[statType]} digits="3"/>
            </Badge>

            <Badge label="PRE" tooltip="Pre swing">
                <Value value={stats?.left?.preSwing?.[statType]} type="percent" digits="2"/>
            </Badge>

            <Badge label="POST" tooltip="Post swing">
                <Value value={stats?.left?.postSwing?.[statType]} type="percent" digits="2"/>
            </Badge>
        </div>

        <div class="ring right">
            <HandRing stats={stats} key="score" hand="right" {statType}/>
        </div>

        <div class="cut stats right">
            <Tag tooltip="Before" placement="bottom">
                <Value value={stats?.right?.beforeCut?.[statType]} digits="2"/>
            </Tag>

            <Tag tooltip="Precision" placement="bottom">
                <Value value={stats?.right?.accCut?.[statType]} digits="2"/>
            </Tag>

            <Tag tooltip="After" placement="bottom">
                <Value value={stats?.right?.afterCut?.[statType]} digits="2"/>
            </Tag>
        </div>

        <div class="alt stats right">
            <Badge label="TD" tooltip="Time dependence" reversed={true}>
                <Value value={stats?.right?.timeDependence?.[statType]} digits="3"/>
            </Badge>

            <Badge label="PRE" tooltip="Pre swing" reversed={true}>
                <Value value={stats?.right?.preSwing?.[statType]} type="percent" digits="2"/>
            </Badge>

            <Badge label="POST" tooltip="Post swing" reversed={true}>
                <Value value={stats?.right?.postSwing?.[statType]} type="percent" digits="2"/>
            </Badge>
        </div>

        <header class="grid">
            <sl-radio-group label="Select a hand" name={hand} value="total" on:sl-change={e => hand = e?.target?.value}>
                <sl-radio-button size="small" value="total">Both</sl-radio-button>
                <sl-radio-button size="small" value="left">Left</sl-radio-button>
                <sl-radio-button size="small" value="right">Right</sl-radio-button>
            </sl-radio-group>
        </header>

        <div class="grid position">
            <Grid {stats} {hand} {statType} {withCounts} />
        </div>

        <div class="grid direction">
            <Grid type="direction" {stats} {hand} {statType} {withCounts} />
        </div>
    </section>
{/if}

<style>
    section {
        display: inline-grid;
        grid-template-columns: repeat(5, max-content);
        grid-template-rows: repeat(4, max-content);
        grid-template-areas:
        "shead shead shead shead ghead ghead"
        "lstats lring rring rstats pgrid dgrid"
        "lalt   lalt  ralt  ralt   pgrid dgrid";
        column-gap: .5em;
        row-gap: .5em;
    }

    header {
        justify-self: center;
    }

    header.stats {
        grid-area: shead;
    }

    header.grid {
        grid-area: ghead;
    }

    .cut.stats {
        place-self: center;
        min-width: 3.25em;
    }

    .cut.stats.right {
        grid-area: rstats;
    }

    .cut.stats.left {
        grid-area: lstats;
    }

    .stats {
        display: flex;
        flex-direction: column;
        justify-items: center;
        gap: .125em;
        align-items: flex-start;
    }

    .stats.left {
        align-items: flex-end;
    }

    .ring {
        place-self: center;
    }

    .ring.left {
        grid-area: lring;
    }

    .ring.right {
        grid-area: rring;
    }

    .ring :global(> *) {
        display: flex;
    }

    .alt.stats.left {
        grid-area: lalt;
    }

    .alt.stats.right {
        grid-area: ralt;
    }

    .grid {
        font-size: .875em;
        margin-left: 1em;
    }

    .grid.direction {
        grid-area: dgrid;
    }

    .grid.position {
        grid-area: pgrid;
    }
</style>
