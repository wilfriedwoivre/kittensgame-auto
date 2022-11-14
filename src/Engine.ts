import { UserScript } from "./UserScript";
import { QoLSettings } from './settings/QoLSettings';
import { QoLManager } from './engine/QoLManager';
import { BonfireManager } from './engine/BonfireManager';
import { BonfireSettings } from './settings/BonfireSettings';
import { ResourceSettings } from './settings/ResourceSettings';
import { ResourceManager } from './engine/ResourceManager';
import { ScienceManager } from './engine/ScienceManager';
import { ScienceSettings } from './settings/ScienceSettings';

export type EngineState = {
    qol: QoLSettings;
    bonfire: BonfireSettings;
    resources: ResourceSettings;
    science: ScienceSettings;
};

export class Engine {

    readonly _host: UserScript;
    qolManager: QoLManager;
    bonfireManager: BonfireManager;
    resourceManager: ResourceManager;
    scienceManager: ScienceManager;

    private _interval = 50;

    constructor(host: UserScript) {
        this._host = host;

        this.qolManager = new QoLManager(this._host);
        this.bonfireManager = new BonfireManager(this._host);
        this.resourceManager = new ResourceManager(this._host);
        this.scienceManager = new ScienceManager(this._host);
    }


    static newState(): EngineState {
        return {
            qol: new QoLSettings(),
            bonfire: new BonfireSettings(),
            resources: new ResourceSettings(),
            science: new ScienceSettings()
        };
    }

    stateLoad(settings: EngineState) {
        this.qolManager.settings = settings.qol ?? new QoLSettings();
        this.bonfireManager.settings = settings.bonfire ?? new BonfireSettings();
        this.resourceManager.settings = settings.resources ?? new ResourceSettings();
        this.scienceManager.settings = settings.science ?? new ScienceSettings();
    }

    stateSerialize(): EngineState {
        return {
            qol: this.qolManager.settings,
            bonfire: this.bonfireManager.settings,
            resources: this.resourceManager.settings,
            science: this.scienceManager.settings
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
    }

}