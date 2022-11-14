import { GamePage } from "./types/gamePage";

import { Engine, EngineState } from './Engine';

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

    private static readonly localStorageName = "kam";
    static _possibleEngineState: EngineState = undefined;


    readonly gamePage: GamePage;

    engine: Engine;
    private _userInterface: UserInterface;

    private _lastMessage: string;
    private _lastMessageElt: { span: HTMLElement; };
    private _lastMessageRepeat = 0;

    constructor(
        gamePage: GamePage,
    ) {
        this.gamePage = gamePage;

        this.engine = new Engine(this);

        if (UserScript._possibleEngineState === undefined) {
            this.engine.stateLoad(Engine.newState());
        }
        if (UserScript._possibleEngineState !== undefined) {
            this.engine.stateLoad(UserScript._possibleEngineState);
        }

        this._userInterface = new UserInterface(this);
        this._userInterface.construct();

    }

    run(): void {
        this.printMessage("Update default color");
        this.gamePage.toggleScheme("dark");

        this.printMessage("Update Max messages");
        this.gamePage.console.maxMessages = 1000;

        this.engine.start();


    }

    printMessage(msg: string) {
        if (this._lastMessage !== msg) {
            this._lastMessageRepeat = 0;

            var item = this.gamePage.msg(msg, "", "", true);
            $(item.span).css("color", "#009933");

            this._lastMessageElt = item;
            this._lastMessage = msg;
        } else {
            $(this._lastMessageElt.span).text(`${this._lastMessage} (x${this._lastMessageRepeat})`);
            this._lastMessageRepeat++;
        }
    }

    get saveManager() {
        return this._saveManager;
    }

    private _saveManager = {
        load: (saveData: Record<string, unknown>) => {
            const state = UserScript._tryEngineStateFromSaveData(saveData);
            if (!state) {
                return;
            }
        },
        save: (saveData: Record<string, unknown>) => {
            saveData.kam = { state: [this.getSettings()] };
        },
    };

    installSaveManager() {
        cinfo("EXPERIMENTAL: Installing save game manager...");
        this.gamePage.managers.push(this.saveManager);
    }

    private static _tryEngineStateFromSaveData(
        saveData: Record<string, unknown>
    ): EngineState | undefined {
        if ("kam" in saveData === false) {
            cdebug("Failed: `kam` not found in save data.");
            return;
        }

        const ksData = saveData.kam as { state?: Array<EngineState> };
        if ("state" in ksData === false) {
            cdebug("Failed: `kam.state` not found in save data.");
            return;
        }

        const state = ksData.state;
        if (!Array.isArray(state)) {
            cdebug("Failed: `kam.state` not `Array`.");
            return;
        }

        return state[0];
    }

    getSettings() {
        return this.engine.stateSerialize();
    }

    setSettings(settings: EngineState) {
        cinfo("Loading engine state...");
        this.engine.stateLoad(settings);
    }

    saveSettings(): void {
        this.gamePage.managers
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

            UserScript.window.dojo.subscribe("server/load", (saveData: { kam?: { state?: Array<EngineState> } }) => {
                console.log("server load, get kam settings");

                const state = UserScript._tryEngineStateFromSaveData(saveData);
                if (!state) {
                    return;
                }

                UserScript._possibleEngineState = state;
            })
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

        if (!isNil(UserScript._possibleEngineState)) {
            try {
                instance.setSettings(UserScript._possibleEngineState);
            } catch (error) {
                cerror("The previous engine state could not be processed!", error);
            }
        }

        instance.installSaveManager();

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
