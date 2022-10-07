export namespace main {
	
	export class HandStat {
	    accCut: buffer.Stats[uint16];
	    beforeCut: buffer.Stats[uint16];
	    afterCut: buffer.Stats[uint16];
	    score: buffer.Stats[uint16];
	    timeDependence: buffer.Stats[float64];
	    preSwing: buffer.Stats[float64];
	    postSwing: buffer.Stats[float64];
	    notes: number;
	    misses: number;
	    badCuts: number;
	    bombHits: number;
	    maxCombo: number;
	
	    static createFrom(source: any = {}) {
	        return new HandStat(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.accCut = this.convertValues(source["accCut"], buffer.Stats[uint16]);
	        this.beforeCut = this.convertValues(source["beforeCut"], buffer.Stats[uint16]);
	        this.afterCut = this.convertValues(source["afterCut"], buffer.Stats[uint16]);
	        this.score = this.convertValues(source["score"], buffer.Stats[uint16]);
	        this.timeDependence = this.convertValues(source["timeDependence"], buffer.Stats[float64]);
	        this.preSwing = this.convertValues(source["preSwing"], buffer.Stats[float64]);
	        this.postSwing = this.convertValues(source["postSwing"], buffer.Stats[float64]);
	        this.notes = source["notes"];
	        this.misses = source["misses"];
	        this.badCuts = source["badCuts"];
	        this.bombHits = source["bombHits"];
	        this.maxCombo = source["maxCombo"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Stats {
	    left: HandStat;
	    right: HandStat;
	    total: HandStat;
	
	    static createFrom(source: any = {}) {
	        return new Stats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.left = this.convertValues(source["left"], HandStat);
	        this.right = this.convertValues(source["right"], HandStat);
	        this.total = this.convertValues(source["total"], HandStat);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Info {
	    modVersion: string;
	    gameVersion: string;
	    // Go type: time.Time
	    timeSet: any;
	    playerId: string;
	    playerName: string;
	    platform: string;
	    trackingSystem: string;
	    hmd: string;
	    controller: string;
	    hash: string;
	    songName: string;
	    mapper: string;
	    difficulty: string;
	    score: number;
	    mode: string;
	    environment: string;
	    modifiers: string[];
	    jumpDistance: number;
	    leftHanded: boolean;
	    height: number;
	    startTime: number;
	    failTime: number;
	    speed: number;
	    endTime: number;
	    calcScore: number;
	    accuracy: number;
	    calcAccuracy: number;
	    fcAccuracy: number;
	    maxCombo: number;
	    maxLeftCombo: number;
	    maxRightCombo: number;
	    wallHits: number;
	    pauses: number;
	
	    static createFrom(source: any = {}) {
	        return new Info(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.modVersion = source["modVersion"];
	        this.gameVersion = source["gameVersion"];
	        this.timeSet = this.convertValues(source["timeSet"], null);
	        this.playerId = source["playerId"];
	        this.playerName = source["playerName"];
	        this.platform = source["platform"];
	        this.trackingSystem = source["trackingSystem"];
	        this.hmd = source["hmd"];
	        this.controller = source["controller"];
	        this.hash = source["hash"];
	        this.songName = source["songName"];
	        this.mapper = source["mapper"];
	        this.difficulty = source["difficulty"];
	        this.score = source["score"];
	        this.mode = source["mode"];
	        this.environment = source["environment"];
	        this.modifiers = source["modifiers"];
	        this.jumpDistance = source["jumpDistance"];
	        this.leftHanded = source["leftHanded"];
	        this.height = source["height"];
	        this.startTime = source["startTime"];
	        this.failTime = source["failTime"];
	        this.speed = source["speed"];
	        this.endTime = source["endTime"];
	        this.calcScore = source["calcScore"];
	        this.accuracy = source["accuracy"];
	        this.calcAccuracy = source["calcAccuracy"];
	        this.fcAccuracy = source["fcAccuracy"];
	        this.maxCombo = source["maxCombo"];
	        this.maxLeftCombo = source["maxLeftCombo"];
	        this.maxRightCombo = source["maxRightCombo"];
	        this.wallHits = source["wallHits"];
	        this.pauses = source["pauses"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ReplayItem {
	    dir: string;
	    filename: string;
	    absPath: string;
	    info?: Info;
	    stats?: Stats;
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new ReplayItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.dir = source["dir"];
	        this.filename = source["filename"];
	        this.absPath = source["absPath"];
	        this.info = this.convertValues(source["info"], Info);
	        this.stats = this.convertValues(source["stats"], Stats);
	        this.error = source["error"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	

}

export namespace buffer {
	
	export class Stats[uint16] {
	    min: number;
	    avg: number;
	    med: number;
	    max: number;
	
	    static createFrom(source: any = {}) {
	        return new Stats[uint16](source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.min = source["min"];
	        this.avg = source["avg"];
	        this.med = source["med"];
	        this.max = source["max"];
	    }
	}
	export class Stats[float64] {
	    min: number;
	    avg: number;
	    med: number;
	    max: number;
	
	    static createFrom(source: any = {}) {
	        return new Stats[float64](source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.min = source["min"];
	        this.avg = source["avg"];
	        this.med = source["med"];
	        this.max = source["max"];
	    }
	}
	export class StatsSlice[uint16] {
	    min: number[];
	    avg: number[];
	    med: number[];
	    max: number[];
	    count: number[];
	
	    static createFrom(source: any = {}) {
	        return new StatsSlice[uint16](source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.min = source["min"];
	        this.avg = source["avg"];
	        this.med = source["med"];
	        this.max = source["max"];
	        this.count = source["count"];
	    }
	}

}

export namespace bsor {
	
	export class HandStat {
	    accCut: buffer.Stats[uint16];
	    beforeCut: buffer.Stats[uint16];
	    afterCut: buffer.Stats[uint16];
	    score: buffer.Stats[uint16];
	    timeDependence: buffer.Stats[float64];
	    preSwing: buffer.Stats[float64];
	    postSwing: buffer.Stats[float64];
	    positionGrid: buffer.StatsSlice[uint16];
	    directionGrid: buffer.StatsSlice[uint16];
	    positionAndDirectionGrid: buffer.StatsSlice[uint16];
	    notes: number;
	    misses: number;
	    badCuts: number;
	    bombHits: number;
	    maxCombo: number;
	
	    static createFrom(source: any = {}) {
	        return new HandStat(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.accCut = this.convertValues(source["accCut"], buffer.Stats[uint16]);
	        this.beforeCut = this.convertValues(source["beforeCut"], buffer.Stats[uint16]);
	        this.afterCut = this.convertValues(source["afterCut"], buffer.Stats[uint16]);
	        this.score = this.convertValues(source["score"], buffer.Stats[uint16]);
	        this.timeDependence = this.convertValues(source["timeDependence"], buffer.Stats[float64]);
	        this.preSwing = this.convertValues(source["preSwing"], buffer.Stats[float64]);
	        this.postSwing = this.convertValues(source["postSwing"], buffer.Stats[float64]);
	        this.positionGrid = this.convertValues(source["positionGrid"], buffer.StatsSlice[uint16]);
	        this.directionGrid = this.convertValues(source["directionGrid"], buffer.StatsSlice[uint16]);
	        this.positionAndDirectionGrid = this.convertValues(source["positionAndDirectionGrid"], buffer.StatsSlice[uint16]);
	        this.notes = source["notes"];
	        this.misses = source["misses"];
	        this.badCuts = source["badCuts"];
	        this.bombHits = source["bombHits"];
	        this.maxCombo = source["maxCombo"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Stats {
	    left: HandStat;
	    right: HandStat;
	    total: HandStat;
	
	    static createFrom(source: any = {}) {
	        return new Stats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.left = this.convertValues(source["left"], HandStat);
	        this.right = this.convertValues(source["right"], HandStat);
	        this.total = this.convertValues(source["total"], HandStat);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class Pause {
	    duration: number;
	    time: number;
	
	    static createFrom(source: any = {}) {
	        return new Pause(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.duration = source["duration"];
	        this.time = source["time"];
	    }
	}
	export class WallHitEvent {
	    idx: number;
	    accuracy: number;
	    fcAccuracy: number;
	    multiplier: number;
	    lineIdx: number;
	    obstacleType: number;
	    width: number;
	    energy: number;
	    time: number;
	    spawnTime: number;
	
	    static createFrom(source: any = {}) {
	        return new WallHitEvent(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.idx = source["idx"];
	        this.accuracy = source["accuracy"];
	        this.fcAccuracy = source["fcAccuracy"];
	        this.multiplier = source["multiplier"];
	        this.lineIdx = source["lineIdx"];
	        this.obstacleType = source["obstacleType"];
	        this.width = source["width"];
	        this.energy = source["energy"];
	        this.time = source["time"];
	        this.spawnTime = source["spawnTime"];
	    }
	}
	export class BombHitEvent {
	    idx: number;
	    eventType: number;
	    scoringType: number;
	    lineIdx: number;
	    lineLayer: number;
	    colorType: number;
	    cutDirection: number;
	    eventTime: number;
	    accuracy: number;
	    fcAccuracy: number;
	    multiplier: number;
	
	    static createFrom(source: any = {}) {
	        return new BombHitEvent(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.idx = source["idx"];
	        this.eventType = source["eventType"];
	        this.scoringType = source["scoringType"];
	        this.lineIdx = source["lineIdx"];
	        this.lineLayer = source["lineLayer"];
	        this.colorType = source["colorType"];
	        this.cutDirection = source["cutDirection"];
	        this.eventTime = source["eventTime"];
	        this.accuracy = source["accuracy"];
	        this.fcAccuracy = source["fcAccuracy"];
	        this.multiplier = source["multiplier"];
	    }
	}
	export class BadCutEvent {
	    idx: number;
	    eventType: number;
	    scoringType: number;
	    lineIdx: number;
	    lineLayer: number;
	    colorType: number;
	    cutDirection: number;
	    eventTime: number;
	    accuracy: number;
	    fcAccuracy: number;
	    multiplier: number;
	    predictedScore: number;
	    timeDependence: number;
	
	    static createFrom(source: any = {}) {
	        return new BadCutEvent(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.idx = source["idx"];
	        this.eventType = source["eventType"];
	        this.scoringType = source["scoringType"];
	        this.lineIdx = source["lineIdx"];
	        this.lineLayer = source["lineLayer"];
	        this.colorType = source["colorType"];
	        this.cutDirection = source["cutDirection"];
	        this.eventTime = source["eventTime"];
	        this.accuracy = source["accuracy"];
	        this.fcAccuracy = source["fcAccuracy"];
	        this.multiplier = source["multiplier"];
	        this.predictedScore = source["predictedScore"];
	        this.timeDependence = source["timeDependence"];
	    }
	}
	export class MissedNoteEvent {
	    idx: number;
	    eventType: number;
	    scoringType: number;
	    lineIdx: number;
	    lineLayer: number;
	    colorType: number;
	    cutDirection: number;
	    eventTime: number;
	    accuracy: number;
	    fcAccuracy: number;
	    multiplier: number;
	    predictedScore: number;
	
	    static createFrom(source: any = {}) {
	        return new MissedNoteEvent(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.idx = source["idx"];
	        this.eventType = source["eventType"];
	        this.scoringType = source["scoringType"];
	        this.lineIdx = source["lineIdx"];
	        this.lineLayer = source["lineLayer"];
	        this.colorType = source["colorType"];
	        this.cutDirection = source["cutDirection"];
	        this.eventTime = source["eventTime"];
	        this.accuracy = source["accuracy"];
	        this.fcAccuracy = source["fcAccuracy"];
	        this.multiplier = source["multiplier"];
	        this.predictedScore = source["predictedScore"];
	    }
	}
	export class GoodNoteCutEvent {
	    idx: number;
	    eventType: number;
	    scoringType: number;
	    lineIdx: number;
	    lineLayer: number;
	    colorType: number;
	    cutDirection: number;
	    eventTime: number;
	    accuracy: number;
	    fcAccuracy: number;
	    multiplier: number;
	    predictedScore: number;
	    timeDependence: number;
	    cutDistanceToCenter: number;
	    beforeCutRating: number;
	    afterCutRating: number;
	    beforeCut: number;
	    afterCut: number;
	    accCut: number;
	
	    static createFrom(source: any = {}) {
	        return new GoodNoteCutEvent(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.idx = source["idx"];
	        this.eventType = source["eventType"];
	        this.scoringType = source["scoringType"];
	        this.lineIdx = source["lineIdx"];
	        this.lineLayer = source["lineLayer"];
	        this.colorType = source["colorType"];
	        this.cutDirection = source["cutDirection"];
	        this.eventTime = source["eventTime"];
	        this.accuracy = source["accuracy"];
	        this.fcAccuracy = source["fcAccuracy"];
	        this.multiplier = source["multiplier"];
	        this.predictedScore = source["predictedScore"];
	        this.timeDependence = source["timeDependence"];
	        this.cutDistanceToCenter = source["cutDistanceToCenter"];
	        this.beforeCutRating = source["beforeCutRating"];
	        this.afterCutRating = source["afterCutRating"];
	        this.beforeCut = source["beforeCut"];
	        this.afterCut = source["afterCut"];
	        this.accCut = source["accCut"];
	    }
	}
	export class ReplayEventsInfo {
	    modVersion: string;
	    gameVersion: string;
	    // Go type: time.Time
	    timeSet: any;
	    playerId: string;
	    playerName: string;
	    platform: string;
	    trackingSystem: string;
	    hmd: string;
	    controller: string;
	    hash: string;
	    songName: string;
	    mapper: string;
	    difficulty: string;
	    score: number;
	    mode: string;
	    environment: string;
	    modifiers: string[];
	    jumpDistance: number;
	    leftHanded: boolean;
	    height: number;
	    startTime: number;
	    failTime: number;
	    speed: number;
	    endTime: number;
	    calcScore: number;
	    accuracy: number;
	    calcAccuracy: number;
	    fcAccuracy: number;
	    maxCombo: number;
	    maxLeftCombo: number;
	    maxRightCombo: number;
	
	    static createFrom(source: any = {}) {
	        return new ReplayEventsInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.modVersion = source["modVersion"];
	        this.gameVersion = source["gameVersion"];
	        this.timeSet = this.convertValues(source["timeSet"], null);
	        this.playerId = source["playerId"];
	        this.playerName = source["playerName"];
	        this.platform = source["platform"];
	        this.trackingSystem = source["trackingSystem"];
	        this.hmd = source["hmd"];
	        this.controller = source["controller"];
	        this.hash = source["hash"];
	        this.songName = source["songName"];
	        this.mapper = source["mapper"];
	        this.difficulty = source["difficulty"];
	        this.score = source["score"];
	        this.mode = source["mode"];
	        this.environment = source["environment"];
	        this.modifiers = source["modifiers"];
	        this.jumpDistance = source["jumpDistance"];
	        this.leftHanded = source["leftHanded"];
	        this.height = source["height"];
	        this.startTime = source["startTime"];
	        this.failTime = source["failTime"];
	        this.speed = source["speed"];
	        this.endTime = source["endTime"];
	        this.calcScore = source["calcScore"];
	        this.accuracy = source["accuracy"];
	        this.calcAccuracy = source["calcAccuracy"];
	        this.fcAccuracy = source["fcAccuracy"];
	        this.maxCombo = source["maxCombo"];
	        this.maxLeftCombo = source["maxLeftCombo"];
	        this.maxRightCombo = source["maxRightCombo"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ReplayEventsWithStats {
	    // Go type: ReplayEventsInfo
	    info: any;
	    notes: GoodNoteCutEvent[];
	    misses: MissedNoteEvent[];
	    badCuts: BadCutEvent[];
	    bombHits: BombHitEvent[];
	    walls: WallHitEvent[];
	    pauses: Pause[];
	    stats: Stats;
	
	    static createFrom(source: any = {}) {
	        return new ReplayEventsWithStats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.info = this.convertValues(source["info"], null);
	        this.notes = this.convertValues(source["notes"], GoodNoteCutEvent);
	        this.misses = this.convertValues(source["misses"], MissedNoteEvent);
	        this.badCuts = this.convertValues(source["badCuts"], BadCutEvent);
	        this.bombHits = this.convertValues(source["bombHits"], BombHitEvent);
	        this.walls = this.convertValues(source["walls"], WallHitEvent);
	        this.pauses = this.convertValues(source["pauses"], Pause);
	        this.stats = this.convertValues(source["stats"], Stats);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

