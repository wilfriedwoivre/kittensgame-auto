import { SettingPercentageOption, Settings, Setting } from '../settings/Setting';
import { UserScript } from '../UserScript';
import { cerror } from '../tools/Log';
import { QoLItemSettings } from '../settings/QoLSettings';
import { BonfireItemSettings } from '../settings/BonfireSettings';
import { ResourceItemSettings } from '../settings/ResourceSettings';
import { ScienceItemSettings } from '../settings/ScienceSettings';


export abstract class SettingsUi {
    private _element: JQuery<HTMLElement>;
    _host: UserScript;

    abstract idPrefix: string;
    abstract title: string; 
    abstract _settings: Settings<QoLItemSettings | BonfireItemSettings | ResourceItemSettings | ScienceItemSettings>;
    
    constructor(
        host: UserScript
    ) {
        this._host = host;
    }


    public get element(): JQuery<HTMLElement> {
        return this._element;
    }

    set element(val: JQuery<HTMLElement>) {
        this._element = val;
    }

    abstract constructElement(): void;

    constructPanel(): JQuery<HTMLElement> {
        const panelElement = $("<li />");

        const collapsibleButton = $("<button />", { class: "kam-collapsible", text: this.title });
        collapsibleButton.on("click", event => this._collapseOrExpand(event));

        panelElement.append(collapsibleButton);

        return panelElement;
    }

    constructSettingOption(name: string, setting: Setting): JQuery<HTMLElement> {

        const node = $("<li />");
        const input = $("<input />", { type: "checkbox", id: this.idPrefix + name, checked: setting.enabled });

        input.on("change", event => this._updateStatus(event));
        node.append(input);

        const label = $("<label />", { for: this.idPrefix + name });
        label.text(setting.label);
        node.append(label);

        if (setting.hasOwnProperty("percentage")) {
            const moreOption = $("<button />", { class: "kam-moreoption", text: "*" });

            moreOption.on("click", () => this._displayOptionSettings(name));
            node.append(moreOption);
        }

        return node;
    }

    constructOptionList(): JQuery<HTMLElement> {
        return  $("<ul />", { style: "display: none" });
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

        this._host.saveSettings();
    }

    private _displayOptionSettings(key: string): void {
        let settings = this._settings.settings[key] as SettingPercentageOption; 
        let result = window.prompt(`${settings.label} percentage of your max capacity.`, settings.percentage.toString());

        try {
            let newValue = Number.parseInt(result);
            if (newValue >= 0 && newValue <= 100) {
                settings.percentage = newValue; 
                this._host.saveSettings();
            }
        }
        catch {
            cerror(`Failed to parse value ${result} as valid percentage`);
        }
    
    }
}