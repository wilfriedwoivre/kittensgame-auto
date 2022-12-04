import { ReligionSettings } from '../settings/ReligionSettings';
import { UserScript } from '../UserScript';
import { Manager } from './Manager';

export class ReligionManager extends Manager<ReligionSettings> {
    settings: ReligionSettings;

    constructor(
        host: UserScript
    ) {
        super(host);
    }

    async run() {
        if (this._host.gamePage.religionTab.visible) {
            if (this._host.gamePage.ui.activeTabId !== this._host.gamePage.religionTab.tabId) {
                this._host.gamePage.religionTab.render();
            }

            await this.autoPraise()
        }

    }



    async autoPraise() {
        const faith = this._host.gamePage.resPool.get("faith")

        if (faith.value == faith.maxValue) {
            this.buy(this._host.gamePage.religionTab.praiseBtn);
        }
    }




}