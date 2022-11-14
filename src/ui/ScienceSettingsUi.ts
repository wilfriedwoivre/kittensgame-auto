import { Settings } from '../settings/Setting';
import { SettingsUi } from './SettingsUi';
import { UserScript } from '../UserScript';
import { objectEntries } from '../tools/Entries';
import { ScienceItemSettings } from '../settings/ScienceSettings';

export class ScienceSettingsUi extends SettingsUi {

    idPrefix = "sciencesettings-";
    title = "Science & Workshop";

    _settings: Settings<ScienceItemSettings>

    constructor(
        host: UserScript,
        settings: Settings<ScienceItemSettings>
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