import { Setting, SettingPercentageOption, Settings } from './Setting';

export type QoLItemSettings = Record<string, Setting>

export class QoLSettings implements Settings<QoLItemSettings>
{
    settings: QoLItemSettings;

    constructor(
        qolItems: QoLItemSettings = {
            autoGather: new SettingPercentageOption("Auto Gathering", true, 90),
            observe: new Setting("Auto Observing", true),
            autoHunt: new Setting("Auto Hunt", true)
        }
    ) {
        this.settings = qolItems;
    }
}
