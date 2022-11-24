import { Setting, Settings, SettingMaxValue } from './Setting';

export type BonfireItemSettings = Record<string, Setting>

export class BonfireSettings implements Settings<BonfireItemSettings>
{
    settings: BonfireItemSettings;

    constructor(
        bonfireItem: BonfireItemSettings = {
            workshop: new Setting("Workshop", true),

            field: new Setting("Catnip field", true),
            pasture: new Setting("Pasture", true),
            aqueduct: new Setting("Aqueduct", true),
            unicornPasture: new Setting("Unicorn Pasture", true),

            mine: new Setting("Mine", true),
            lumberMill: new Setting("Lumber Mill", true),

            library: new Setting("Library", true),
            academy: new Setting("Academy", true),

            smelter: new SettingMaxValue("Smelter", true, 1),
            tradepost: new Setting("Tradepost", true),
            
            
            hut: new Setting("Hut", true),
            logHouse: new Setting("Log House", true),
                        
            barn: new Setting("Barn", true),
            
        }
    ) {
        this.settings = bonfireItem;
    }
}