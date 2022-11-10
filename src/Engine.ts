import { UserScript } from "./UserScript";
import { QoLSettings } from './settings/QoLSettings';
import { QoLManager } from './engine/QoLManager';
import { time } from "console";

export type EngineState = {
    qol: QoLSettings;
};

export class Engine {

    readonly _host: UserScript;
    qolManager: QoLManager;

    private _interval = 1000;

    constructor(host: UserScript) {
        this._host = host;

        this.qolManager = new QoLManager(this._host);
    }

    static newState(): EngineState {
        return {
            qol: new QoLSettings()
        };
    }

    stateLoad(settings: EngineState) {
        this.qolManager.settings = settings.qol;
    }

    stateSerialize(): EngineState {
        return {
            qol: this.qolManager.settings
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
        await this.qolManager.run();
    }

}