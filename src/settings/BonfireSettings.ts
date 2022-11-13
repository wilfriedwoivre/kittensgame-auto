import { Setting, Settings } from './Setting';

export type BonfireItemSettings = Record<string, Setting>

export class BonfireSettings implements Settings<BonfireItemSettings>
{
    settings: BonfireItemSettings;

    constructor(
        bonfireItem: BonfireItemSettings = {
            field: new Setting("Catnip field", false)
        }
    ) {
        this.settings = bonfireItem;
    }
}