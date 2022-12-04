import { isNil, mustExist } from "../tools/Maybe";
import { QoLSettingsUi } from "./QoLSettingsUi"
import { UserScript } from '../UserScript';
import { BonfireSettingsUi } from './BonfireSettingsUi';
import { SettingsUi } from "./SettingsUi";
import { ResourceSettingsUi } from './ResourceSettingsUi';
import { ScienceSettingsUi } from './ScienceSettingsUi';
import { VillageSettingsUi } from './VillageSettingsUi';
import { TradeSettingsUi } from './TradeSettingsUi';
import { ReligionSettingsUi } from './ReligionSettingsUi';

export class UserInterface {

    private Uis: Array<SettingsUi>

    private _host: UserScript;

    constructor(host: UserScript) {
        this._host = host;
        this._addCss();

        this.Uis = [
            new QoLSettingsUi(this._host, this._host.engine.qolManager.settings),
            new BonfireSettingsUi(this._host, this._host.engine.bonfireManager.settings),
            new ResourceSettingsUi(this._host, this._host.engine.resourceManager.settings),
            new ScienceSettingsUi(this._host, this._host.engine.scienceManager.settings),
            new VillageSettingsUi(this._host, this._host.engine.villageManager.settings),
            new TradeSettingsUi(this._host, this._host.engine.tradeManager.settings),
            new ReligionSettingsUi(this._host, this._host.engine.religionManager.settings)
        ]
    }


    construct(): void {
        const title = "Kittens Automatic Manager";

        const optionsElement = $("<div />", { id: "kam" });
        const optionsTitleElement = $("<div />", { id: "kam-title", text: title });
        optionsElement.append(optionsTitleElement);

        const optionsListElement = $("<ul />");

        this.Uis.forEach(ui => {
            optionsListElement.append(ui.element);
        });


        const right = $("#rightColumn");
        right.prepend(optionsElement.append(optionsListElement));
    }

    private _addCss(): void {

        // Remove default style for list
        this._addRule(`
            #kam ul
            { 
                list-style: none;
                padding-inline-start: 0px;
            }
        `);


        this._addRule(`
            #kam .kam-collapsible
            { 
                border: none;
                cursor: pointer;
                background: none;
                text-align: left;
                width: 100%;
                outline: none;
                margin: 3px 0px 3px 0px;
            }
        `);

        this._addRule(`
            #kam .kam-collapsible:after
            { 
                content: '\\002B';
                float: right;
            }
        `);

        this._addRule(`
            #kam .kam-collapsible.active:after
            { 
                content: '\\2212';
                float: right;
            }
        `);

        this._addRule(`
            #kam .kam-moreoption
            { 
                border: none;
                background: none;
                float: right;
                cursor: help;
                margin-right: 10px;
                text-align: center;
                margin-top: 5px;
                font-size: larger;
            }
        `);
    }

    private _addRule(rule: string) {
        const styleSheetId = "kittens-auto-manager-styles";
        let styleSheet = document.getElementById(styleSheetId) as HTMLStyleElement;
        if (isNil(styleSheet)) {
            styleSheet = document.createElement("style");
            styleSheet.id = styleSheetId;
            document.head.appendChild(styleSheet);
        }
        const sheet = mustExist(styleSheet.sheet);
        sheet.insertRule(rule);
    }


}
