import { QoLSettings } from '../settings/QoLSettings';
import { UserScript } from '../UserScript';
import { SettingPercentageOption } from '../settings/Setting';

export class QoLManager {
    settings: QoLSettings
    private _host: UserScript;

    constructor(
        host: UserScript
    ) {
        this._host = host;
    }

    async run() {
        if (this.settings.settings["autoGather"].enabled) {
            await this.autoGather();
        }
    }

    async autoGather() {
        const settings = this.settings.settings["autoGather"] as SettingPercentageOption;
        const catnip = this._host.gamePage.resPool.get("catnip");

        const actual = (catnip.value * 100) / catnip.maxValue;

        if (actual < settings.percentage) {
            const gatherBtn = this._host.gamePage.bldTab.children.find(n => n.model.name == "Gather catnip");
            gatherBtn.controller.buyItem(gatherBtn.model, {}, () => {})
        }
    }
}