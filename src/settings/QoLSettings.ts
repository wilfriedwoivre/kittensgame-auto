import { Setting, SettingMaxOption, Settings } from './Setting';

export type QoLItemSettings = Record<string, Setting>

export class QoLSettings implements Settings<QoLItemSettings>
{
    settings: QoLItemSettings;

    constructor(
        qolItems: QoLItemSettings = {
            autoGather: new SettingMaxOption("Auto Gathering", false, 1000),
            observe: new Setting("Auto Observing", true)
        }
    ) {
        this.settings = qolItems;
    }
}