import JQuery from "jquery";

import { GamePage } from "./types/gamePage";

import { Engine, EngineState } from "./Engine";

import { UserInterface } from "./ui/UserInterface";

import { Maybe, isNil, mustExist } from "./tools/Maybe";
import { cerror, cdebug, cinfo } from "./tools/Log";
import { sleep } from "./tools/Sleep";

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

export class UserScript {
    /**
     * Stores if we caught the `game/start` signal from the game.
     */
    private static _gameStartSignal: Promise<boolean>;
    private static _gameStartSignalResolver: undefined | ((value: boolean) => void);
    private static _possibleEngineState: EngineState | undefined = undefined;


    readonly gamePage: GamePage;

    engine: Engine;
    private _userInterface : UserInterface

    constructor(
        gamePage: GamePage,
    ) {
        this.gamePage = gamePage;

        this.engine = new Engine(this);
        this._userInterface = new UserInterface(this);
        this._userInterface.construct();

    }

    getSettings() {
        return this.engine.stateSerialize();
    }
    setSettings(settings: EngineState) {
        cinfo("Loading engine state...");
        this.engine.stateLoad(settings);
    }


    run(): void {
        this.printMessage("Update default color");
        this.gamePage.toggleScheme("dark");
        
        this.printMessage("Update Max messages");
        this.gamePage.console.maxMessages = 1000;

        
    }

    private printMessage(msg: string) {
        var item = this.gamePage.msg(msg, "", "", true);
        $(item.span).css("color", "#009933");
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

        if (isNil(UserScript._gameStartSignal) && typeof UserScript.window.dojo !== "undefined") {
            UserScript._gameStartSignal = new Promise((resolve) => {
                UserScript._gameStartSignalResolver = resolve;
            });

            UserScript.window.dojo.subscribe("game/start", () => {
                cdebug("`game/start` signal caught. Fast-tracking script load...");
                mustExist(UserScript._gameStartSignalResolver)(true);
            });

            UserScript.window.dojo.subscribe(
                "server/load",
                (saveData: { ks?: { state?: Array<EngineState> } }) => {
                    cinfo(
                        "EXPERIMENTAL: `server/load` signal caught. Looking for Kitten Scientists engine state in save data..."
                    );

                    const state = UserScript._tryEngineStateFromSaveData(saveData);
                    if (!state) {
                        return;
                    }

                    cinfo(
                        "EXPERIMENTAL: Found! Provided save data will be used as seed for next userscript instance."
                    );
                    UserScript._possibleEngineState = state;
                }
            );
        }

        if (!isNil(UserScript._gameStartSignal)) {
            signals.push(UserScript._gameStartSignal);
        }

        if (timeout < 0) {
            throw new Error("Unable to find game page. Giving up.");
        }

        if (UserScript._isGameLoaded()) {
            return mustExist(UserScript.window.gamePage);
        }

        cdebug(`Waiting for game... (timeout: ${Math.round(timeout / 1000)}s)`);

        await Promise.race(signals);
        return UserScript.waitForGame(timeout - 2000);
    }

    static getDefaultInstance(): UserScript {
        const instance = new UserScript(
            mustExist(UserScript.window.gamePage),
        );

        // We can already attempt to load the possible engine state and see if this produces errors.
        // As the startup is orchestrated right now by `index.ts`, if there are legacy options, they
        // will be loaded into the instance after we return it from here.
        // Thus, legacy options will overrule modern settings, if they are present.
        if (!isNil(UserScript._possibleEngineState)) {
            try {
                instance.setSettings(UserScript._possibleEngineState);
            } catch (error) {
                cerror("The previous engine state could not be processed!", error);
            }
        }

        //instance.installSaveManager();
        return instance;
    }

    private static _isGameLoaded(): boolean {
        return !isNil(UserScript.window.gamePage);
    }

    static get window(): Window {
        try {
            return unsafeWindow as Window;
        } catch (error) {
            return window;
        }
    }
}
