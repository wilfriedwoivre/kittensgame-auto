import JQuery from "jquery";

import { cdebug, cerror, cinfo, cwarn } from "./tools/Log";
import { isNil, Maybe, mustExist } from "./tools/Maybe";
import { sleep } from "./tools/Sleep";

import { GamePage } from "./types/gamePage";

import { EngineState, Engine } from "./Engine";

declare global {
    let unsafeWindow: Window | undefined;
    interface Window {
        dojo: {
            clone: <T>(subject: T) => T;
            subscribe: (event: string, handler: (...args: any[]) => void) => void;
        };
        gamePage?: Maybe<GamePage>;
        $: JQuery;
    }
}

export class StarterScript {
    /**
     * Stores if we caught the `game/start` signal from the game.
     */
    private static _gameStartSignal: Promise<boolean>;
    private static _gameStartSignalResolver: undefined | ((value: boolean) => void);
    private static _possibleEngineState: EngineState | undefined = undefined;


    readonly gamePage: GamePage;
    engine: Engine;

    constructor(
        gamePage: GamePage,
    ) {
        this.gamePage = gamePage;
    }

    run(): void {
        this.gamePage.toggleScheme("dark");
    }

    setSettings(settings: EngineState) {
        cinfo("Loading engine state...");
        this.engine.stateLoad(settings);
    }

    private static _tryEngineStateFromSaveData(
        saveData: Record<string, unknown>
    ): EngineState | undefined {
        if ("ks" in saveData === false) {
            cdebug("Failed: `ks` not found in save data.");
            return;
        }

        const ksData = saveData.ks as { state?: Array<EngineState> };
        if ("state" in ksData === false) {
            cdebug("Failed: `ks.state` not found in save data.");
            return;
        }

        const state = ksData.state;
        if (!Array.isArray(state)) {
            cdebug("Failed: `ks.state` not `Array`.");
            return;
        }

        return state[0];
    }

    static async waitForGame(timeout = 30000): Promise<GamePage> {
        const signals: Array<Promise<unknown>> = [sleep(2000)];

        if (isNil(StarterScript._gameStartSignal) && typeof StarterScript.window.dojo !== "undefined") {
            StarterScript._gameStartSignal = new Promise((resolve) => {
                StarterScript._gameStartSignalResolver = resolve;
            });

            StarterScript.window.dojo.subscribe("game/start", () => {
                cdebug("`game/start` signal caught. Fast-tracking script load...");
                mustExist(StarterScript._gameStartSignalResolver)(true);
            });

            StarterScript.window.dojo.subscribe(
                "server/load",
                (saveData: { ks?: { state?: Array<EngineState> } }) => {
                    cinfo(
                        "EXPERIMENTAL: `server/load` signal caught. Looking for Kitten Scientists engine state in save data..."
                    );

                    const state = StarterScript._tryEngineStateFromSaveData(saveData);
                    if (!state) {
                        return;
                    }

                    cinfo(
                        "EXPERIMENTAL: Found! Provided save data will be used as seed for next userscript instance."
                    );
                    StarterScript._possibleEngineState = state;
                }
            );
        }

        if (!isNil(StarterScript._gameStartSignal)) {
            signals.push(StarterScript._gameStartSignal);
        }

        if (timeout < 0) {
            throw new Error("Unable to find game page. Giving up.");
        }

        if (StarterScript._isGameLoaded()) {
            return mustExist(StarterScript.window.gamePage);
        }

        cdebug(`Waiting for game... (timeout: ${Math.round(timeout / 1000)}s)`);

        await Promise.race(signals);
        return StarterScript.waitForGame(timeout - 2000);
    }

    static getDefaultInstance(): StarterScript {
        const instance = new StarterScript(
            mustExist(StarterScript.window.gamePage),
        );

        // We can already attempt to load the possible engine state and see if this produces errors.
        // As the startup is orchestrated right now by `index.ts`, if there are legacy options, they
        // will be loaded into the instance after we return it from here.
        // Thus, legacy options will overrule modern settings, if they are present.
        if (!isNil(StarterScript._possibleEngineState)) {
            try {
                instance.setSettings(StarterScript._possibleEngineState);
            } catch (error) {
                cerror("The previous engine state could not be processed!", error);
            }
        }

        //instance.installSaveManager();
        return instance;
    }

    private static _isGameLoaded(): boolean {
        return !isNil(StarterScript.window.gamePage);
    }

    static get window(): Window {
        try {
            return unsafeWindow as Window;
        } catch (error) {
            return window;
        }
    }
}
