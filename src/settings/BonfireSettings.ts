import { Setting, Settings, SettingMaxValue } from './Setting';

export type BonfireItemSettings = Record<string, Setting>

export class BonfireSettings implements Settings<BonfireItemSettings>
{
    settings: BonfireItemSettings;

    constructor(
        bonfireItem: BonfireItemSettings = {
            field: new Setting("Catnip field", true),
            library: new Setting("Library", true),
            barn: new Setting("Barn", true),
            pasture: new Setting("Pasture", true),
            mine: new Setting("Mine", true),
            hut: new Setting("Hut", true),
            workshop: new Setting("Workshop", true),
            academy: new Setting("Academy", true),
            unicornPasture: new Setting("Unicorn Pasture", true),
            aqueduct: new Setting("Aqueduct", true),
            smelter: new SettingMaxValue("Smelter", true, 1)
        }
    ) {
        this.settings = bonfireItem;
    }
}