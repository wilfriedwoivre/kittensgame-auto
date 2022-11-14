import { ResourceItemSettings } from '../settings/ResourceSettings';
import { Settings } from '../settings/Setting';
import { SettingsUi } from './SettingsUi';
import { UserScript } from '../UserScript';
import { objectEntries } from '../tools/Entries';

export class ResourceSettingsUi extends SettingsUi {

    idPrefix = "resourcesettings-";
    title = "Resources";

    _settings: Settings<ResourceItemSettings>

    constructor(
        host: UserScript,
        settings: Settings<ResourceItemSettings>
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