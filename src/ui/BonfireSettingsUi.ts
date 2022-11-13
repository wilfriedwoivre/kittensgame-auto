import { UserScript } from '../UserScript';
import { Setting, Settings } from '../settings/Setting';
import { SettingsUi } from './SettingsUi';
import { BonfireItemSettings } from '../settings/BonfireSettings';
import { objectEntries } from '../tools/Entries';

export class BonfireSettingsUi extends SettingsUi {
    idPrefix = "bonfiresettings-";
    title = "Bonfire";

    _settings: Settings<BonfireItemSettings>

    constructor(
        host: UserScript,
        settings: Settings<BonfireItemSettings>
    ) {
        super(host);
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