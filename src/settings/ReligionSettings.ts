import { Setting, Settings, SettingMaxValue } from './Setting';

export type ReligionItemSettings = Record<string, Setting>

export class ReligionSettings implements Settings<ReligionItemSettings>
{
    settings: ReligionItemSettings;

    constructor(
        religionItem: ReligionItemSettings = {
            autoPraise: new Setting("Auto Praise", true),
            autoUpgrade: new Setting("Auto Upgrade", true),
            autoTranscend: new Setting("Auto Transcend", true),
            autoAdore: new Setting("Auto Adore", true)
        }
    ) {
        this.settings = religionItem;
    }
}