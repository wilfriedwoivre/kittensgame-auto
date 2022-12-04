import { Setting, Settings, SettingMaxValue } from './Setting';

export type ReligionItemSettings = Record<string, Setting>

export class ReligionSettings implements Settings<ReligionItemSettings>
{
    settings: ReligionItemSettings;

    constructor(
        religionItem: ReligionItemSettings = {
            autoPraise: new Setting("Auto Praise", true)
        }
    ) {
        this.settings = religionItem;
    }
}