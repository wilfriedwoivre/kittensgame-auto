import { UserScript } from '../UserScript';
import { Settings, SettingPercentageOption, Setting } from '../settings/Setting';
import { QoLItemSettings } from "../settings/QoLSettings";
import { objectEntries } from '../tools/Entries';
import { cerror } from '../tools/Log';

export class QoLSettingsUi {
    private _element: JQuery<HTMLElement>;

    private readonly idPrefix = "qolsettings-";
    private readonly title = "Quality of Life";

    private _settings: Settings<QoLItemSettings>;
    private _host: UserScript;

    constructor(
        host: UserScript,
        settings: Settings<QoLItemSettings>
    ) {
        this._host = host;
        this._settings = settings;
        this.constructElement();
    }

    public get element(): JQuery<HTMLElement> {
        return this._element;
    }

    private set element(val: JQuery<HTMLElement>) {
        this._element = val;
    }

    constructElement(): void {
        const panelElement = $("<li />");

        const collapsibleButton = $("<button />", { class: "kam-collapsible", text: this.title });


        collapsibleButton.on("click", event => this._collapseOrExpand(event));

        const optionsList = $("<ul />", { style: "display: none" });

        for (const [name, setting] of objectEntries(this._settings.settings)) {
            const node = $("<li />")
            const input = $("<input />", { type: "checkbox", id: this.idPrefix + name, checked: setting.enabled });

            input.on("change", event => this._updateStatus(event));
            node.append(input);

            const label = $("<label />", { for: this.idPrefix + name });
            label.text(setting.label);
            node.append(label);

            if (setting instanceof SettingPercentageOption) {
                const moreOption = $("<button />", { class: "kam-moreoption", text: "*" });

                moreOption.on("click", () => this._displayOptionSettings(name));
                node.append(moreOption);
            }

           
            optionsList.append(node);
        }

        panelElement.append(collapsibleButton);
        panelElement.append(optionsList);

        this.element = panelElement;
    }

    private _collapseOrExpand(event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>) {
        event.target.classList.toggle("active");
        var content = event.target.nextElementSibling;

        if (content.getAttribute("style") == "display: block") {
            content.setAttribute("style", "display: none");
        }
        else {
            content.setAttribute("style", "display: block");
        }
    }

    private _updateStatus(event: JQuery.ChangeEvent<HTMLElement, undefined, HTMLElement, HTMLElement>) {
        let checkbox = event.target as HTMLInputElement;
        var settingIndex = event.target.id.replace(this.idPrefix, "");
        this._settings.settings[settingIndex].enabled = checkbox.checked;

        this._host.saveEngineState();
    }

    private _displayOptionSettings(key: string): void {
        let settings = this._settings.settings[key] as SettingPercentageOption; 
        let result = window.prompt("Auto Gather percentage of your max capacity.", settings.percentage.toString());

        try {
            let newValue = Number.parseInt(result);
            if (newValue >= 0 && newValue <= 100) {
                settings.percentage = newValue; 
                this._host.saveEngineState();
            }
        }
        catch {
            cerror(`Failed to parse value ${result} as valid percentage`);
        }
    
    }
}
