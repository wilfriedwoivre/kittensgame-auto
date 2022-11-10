import { Setting, SettingPercentageOption, Settings } from './Setting';

export type QoLItemSettings = Record<string, Setting>

export class QoLSettings implements Settings<QoLItemSettings>
{
    settings: QoLItemSettings;

    constructor(
        qolItems: QoLItemSettings = {
            autoGather: new SettingPercentageOption("Auto Gathering", false, 10),
            observe: new Setting("Auto Observing", true)
        }
    ) {
        this.settings = qolItems;
    }
}