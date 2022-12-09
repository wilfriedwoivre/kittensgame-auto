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

            if (this.settings.settings["autoPraise"].enabled) {
                await this.autoPraise()
            }
            if (this.settings.settings["autoUpgrade"].enabled) {
                await this.autoUpgrade()
            }
        }

    }



    async autoPraise() {
        const faith = this._host.gamePage.resPool.get("faith")

        if (faith.value == faith.maxValue) {
            this.buy(this._host.gamePage.religionTab.praiseBtn);
        }
    }
    
    async autoUpgrade() {
        var items = this._host.gamePage.religionTab.rUpgradeButtons.filter(n => n.model.visible)

        // TODO Maybe find the less expensive
        var religion = items.find(n => this.canBuy(n.model.prices));
        if (religion !== undefined) {

            this.buy(religion);
        }
    }




}