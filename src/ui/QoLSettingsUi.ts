import { UserScript } from '../UserScript';
import { Settings } from '../settings/Setting';
import { QoLItemSettings } from "../settings/QoLSettings";

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

        for (var i in this._settings.settings) {

            const node = $("<li />")
            const input = $("<input />", { type: "checkbox", id: this.idPrefix + i, checked: this._settings.settings[i].enabled });

            input.on("change", event => this._updateStatus(event));

            const label = $("<label />", { for: this.idPrefix + i });
            label.text(this._settings.settings[i].label);

            node.append(input);
            node.append(label);
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
}
