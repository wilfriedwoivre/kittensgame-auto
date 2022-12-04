import { UserScript } from "./UserScript";
import { QoLSettings } from './settings/QoLSettings';
import { QoLManager } from './engine/QoLManager';
import { BonfireManager } from './engine/BonfireManager';
import { BonfireSettings } from './settings/BonfireSettings';
import { ResourceSettings } from './settings/ResourceSettings';
import { ResourceManager } from './engine/ResourceManager';
import { ScienceManager } from './engine/ScienceManager';
import { ScienceSettings } from './settings/ScienceSettings';
import { VillageSettings } from './settings/VillageSettings';
import { VillageManager } from './engine/VillageManager';
import { TradeSettings } from './settings/TradeSettings';
import { TradeManager } from './engine/TradeManager';
import { ReligionSettings } from './settings/ReligionSettings';
import { ReligionManager } from './engine/ReligionManager';

export type EngineState = {
    qol: QoLSettings;
    bonfire: BonfireSettings;
    resources: ResourceSettings;
    science: ScienceSettings;
    village: VillageSettings;
    trade: TradeSettings;
    religion: ReligionSettings;
};

export class Engine {

    readonly _host: UserScript;
    qolManager: QoLManager;
    bonfireManager: BonfireManager;
    resourceManager: ResourceManager;
    scienceManager: ScienceManager;
    villageManager: VillageManager;
    tradeManager: TradeManager;
    religionManager: ReligionManager;

    private _interval = 50;

    constructor(host: UserScript) {
        this._host = host;

        this.qolManager = new QoLManager(this._host);
        this.bonfireManager = new BonfireManager(this._host);
        this.resourceManager = new ResourceManager(this._host);
        this.scienceManager = new ScienceManager(this._host);
        this.villageManager = new VillageManager(this._host);
        this.tradeManager = new TradeManager(this._host);
        this.religionManager = new ReligionManager(this._host);
    }


    static newState(): EngineState {
        return {
            qol: new QoLSettings(),
            bonfire: new BonfireSettings(),
            resources: new ResourceSettings(),
            science: new ScienceSettings(),
            village: new VillageSettings(),
            trade: new TradeSettings(),
            religion: new ReligionSettings(),
        };
    }

    stateLoad(settings: EngineState) {
        this.qolManager.settings = settings.qol ?? new QoLSettings();
        this.bonfireManager.settings = settings.bonfire ?? new BonfireSettings();
        this.resourceManager.settings = settings.resources ?? new ResourceSettings();
        this.scienceManager.settings = settings.science ?? new ScienceSettings();
        this.villageManager.settings = settings.village ?? new VillageSettings();
        this.tradeManager.settings = settings.trade ?? new TradeSettings();
        this.religionManager.settings = settings.religion ?? new ReligionSettings();
    }

    stateSerialize(): EngineState {
        return {
            qol: this.qolManager.settings,
            bonfire: this.bonfireManager.settings,
            resources: this.resourceManager.settings,
            science: this.scienceManager.settings,
            village: this.villageManager.settings,
            trade: this.tradeManager.settings,
            religion: this.religionManager.settings,
        };
    }

    start(): void {
        const loop = () => {

            this._iterate().then(() => {
                setTimeout(loop, this._interval);
            })
        };

        loop();
    }

    private async _iterate(): Promise<void> {
        this.qolManager.run();
        this.bonfireManager.run();
        this.resourceManager.run();
        this.scienceManager.run();
        this.villageManager.run();
        this.tradeManager.run();
        this.religionManager.run();
    }

}