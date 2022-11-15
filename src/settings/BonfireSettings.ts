import { Setting, Settings } from './Setting';

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
            mine: new Setting("Mine", true)
        }
    ) {
        this.settings = bonfireItem;
    }
}