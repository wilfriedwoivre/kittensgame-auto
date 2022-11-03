import { UserScript } from "./UserScript";

export type EngineState = {

};

export class Engine {

    readonly _host: UserScript;

    constructor(host: UserScript) {

        this._host = host;
    }

    stateLoad(settings: EngineState) {

    }

    stateSerialize(): EngineState {
        return {

        };
    }

}