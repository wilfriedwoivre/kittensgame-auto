import { StarterScript } from "./StarterScript";

export type EngineState = {
};

export class Engine {
    readonly _host: StarterScript;

    constructor(host: StarterScript){
        this._host = host;
    }

    stateLoad(settings: EngineState) {
    }
}
