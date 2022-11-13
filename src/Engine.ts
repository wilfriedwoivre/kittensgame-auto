import { UserScript } from "./UserScript";
import { QoLSettings } from './settings/QoLSettings';
import { QoLManager } from './engine/QoLManager';
import { BonfireManager } from './engine/BonfireManager';
import { BonfireSettings } from './settings/BonfireSettings';

export type EngineState = {
    qol: QoLSettings;
    bonfire: BonfireSettings;
};

export class Engine {

    readonly _host: UserScript;
    qolManager: QoLManager;
    bonfireManager: BonfireManager;

    private _interval = 50;

    constructor(host: UserScript) {
        this._host = host;

        this.qolManager = new QoLManager(this._host);
        this.bonfireManager = new BonfireManager(this._host);
    }

    static newState(): EngineState {
        return {
            qol: new QoLSettings(),
            bonfire: new BonfireSettings()
        };
    }

    stateLoad(settings: EngineState) {
        this.qolManager.settings = settings.qol;
        this.bonfireManager.settings = settings.bonfire;
    }

    stateSerialize(): EngineState {
        return {
            qol: this.qolManager.settings,
            bonfire: this.bonfireManager.settings
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
    }

}