import { Setting, Settings, SettingMaxValue } from './Setting';

export type BonfireItemSettings = Record<string, Setting>

export class BonfireSettings implements Settings<BonfireItemSettings>
{
    settings: BonfireItemSettings;

    constructor(
        bonfireItem: BonfireItemSettings = {
            workshop: new Setting("Workshop", true),

            steamworks: new Setting("Steamworks", true),

            field: new Setting("Catnip field", true),
            pasture: new Setting("Pasture", true),
            aqueduct: new Setting("Aqueduct", true),
            unicornPasture: new Setting("Unicorn Pasture", true),

            mine: new Setting("Mine", true),
            quarry: new Setting("Quarry", true),
            lumberMill: new Setting("Lumber Mill", true),

            library: new Setting("Library", true),
            academy: new Setting("Academy", true),
            observatory: new Setting("Observatory", true),

            smelter: new SettingMaxValue("Smelter", true, 1),
            tradepost: new Setting("Tradepost", true),
            temple: new Setting("Temple", true),
            chapel: new Setting("Chapel", true),
            
            amphitheatre: new Setting("Amphitheatre", true),
            
            hut: new Setting("Hut", true),
            logHouse: new Setting("Log House", true),
                        
            barn: new Setting("Barn", true),
            warehouse: new Setting("Warehouse", true),
            harbor: new Setting("Harbour", true),
            
            mint: new Setting("Mint", true)
        }
    ) {
        this.settings = bonfireItem;
    }
}