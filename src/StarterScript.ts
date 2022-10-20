import JQuery from "jquery";

import { cdebug, cerror, cinfo, cwarn } from "./tools/Log";
import { isNil, Maybe, mustExist } from "./tools/Maybe";
import { sleep } from "./tools/Sleep";

import { GamePage } from "./types/gamePage";

import { EngineState } from "./Engine";

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
