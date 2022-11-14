import { QoLSettings } from '../settings/QoLSettings';
import { UserScript } from '../UserScript';
import { SettingPercentageOption } from '../settings/Setting';
import { Manager } from './Manager';

export class QoLManager extends Manager<QoLSettings> {
    settings: QoLSettings

    constructor(
        host: UserScript
    ) {
        super(host);
    }

    async run() {
        if (this.settings.settings["autoGather"].enabled) {
            this.autoGather();
        }
        if (this.settings.settings["observe"].enabled) {
            this.autoOberve();
        }
        if (this.settings.settings["autoHunt"].enabled) {
            await this.autoHunt();
        }
    }

    async autoGather() {
        const settings = this.settings.settings["autoGather"] as SettingPercentageOption;
        const catnip = this._host.gamePage.resPool.get("catnip");

        const actual = (catnip.value * 100) / catnip.maxValue;

        if (actual < settings.percentage) {
            const gatherBtn = this._host.gamePage.bldTab.children.find(n => n.model.name == "Gather catnip");
            this.buy(gatherBtn);
        }
    }

    async autoOberve() {
        if (this._host.gamePage.calendar.observeBtn !== null) {
            this._host.gamePage.calendar.observeHandler();
        }
    }

    async autoHunt() {
        let catpower = this._host.gamePage.resPool.get("manpower");

        if (catpower.value == catpower.maxValue) {
            this._host.gamePage.village.huntAll();
        }

    }
}