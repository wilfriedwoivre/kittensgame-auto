import { UserScript } from '../UserScript';
import { Settings, SettingPercentageOption, Setting } from '../settings/Setting';
import { QoLItemSettings } from "../settings/QoLSettings";
import { objectEntries } from '../tools/Entries';
import { SettingsUi } from './SettingsUi';

export class QoLSettingsUi extends SettingsUi {
    

    idPrefix = "qolsettings-";
    title = "Quality of Life";

    _settings: Settings<QoLItemSettings>;

    constructor(
        host: UserScript,
        settings: Settings<QoLItemSettings>
    ) {
        super(host)
        this._settings = settings;
        this.constructElement();
    }

    constructElement(): void {
        const panelElement = this.constructPanel()
        
        const optionsList = this.constructOptionList();

        for (const [name, setting] of objectEntries(this._settings.settings)) {
            const node = this.constructSettingOption(name, setting);           
            optionsList.append(node);
        }

        panelElement.append(optionsList);

        this.element = panelElement;
    }

}
