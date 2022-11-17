import { Settings } from '../settings/Setting';
import { SettingsUi } from './SettingsUi';
import { UserScript } from '../UserScript';
import { objectEntries } from '../tools/Entries';
import { VillageItemSettings } from '../settings/VillageSettings';

export class VillageSettingsUi extends SettingsUi {

    idPrefix = "villageSettings-";
    title = "Village";

    _settings: Settings<VillageItemSettings>

    constructor(
        host: UserScript,
        settings: Settings<VillageItemSettings>
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