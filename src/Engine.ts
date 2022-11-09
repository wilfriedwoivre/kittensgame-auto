import { UserScript } from "./UserScript";
import { QoLSettings } from './settings/QoLSettings';
import { QoLManager } from './engine/QoLManager';

export type EngineState = {
    qol: QoLSettings;
};

export class Engine {

    readonly _host: UserScript;
    qolManager: QoLManager;

    constructor(host: UserScript) {
        this._host = host;

        this.qolManager = new QoLManager(this._host);
    }

    stateLoad(settings: EngineState) {

    }

    stateSerialize(): EngineState {
        return {
            qol: this.qolManager.settings
        };
    }

}