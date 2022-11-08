import { isNil, mustExist } from "../tools/Maybe";
import { QoLSettingsUi } from "./QoLSettingsUi"

export class UserInterface {

    private _qolUi: QoLSettingsUi;

    constructor() {
        this._addCss();

        this._qolUi = new QoLSettingsUi();
    }


    construct(): void {
        const title = "Kittens Automatic Manager";

        const optionsElement = $("<div />", { id: "kam" });
        const optionsTitleElement = $("<div />", { id: "kam-title", text: title });
        optionsElement.append(optionsTitleElement);

        const optionsListElement = $("<ul />");

        optionsListElement.append(this._qolUi.element);


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
