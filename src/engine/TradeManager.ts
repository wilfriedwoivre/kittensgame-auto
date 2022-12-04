import { TradeSettings } from "../settings/TradeSettings";
import { Manager } from './Manager';
import { UserScript } from '../UserScript';

export class TradeManager extends Manager<TradeSettings> {
    settings: TradeSettings;

    constructor(
        host: UserScript
    ) {
        super(host)
    }

    async run() {
        if (this._host.gamePage.diplomacyTab.visible) {
            if (this._host.gamePage.ui.activeTabId !== this._host.gamePage.diplomacyTab.tabId) {
                this._host.gamePage.diplomacyTab.render();
            }
        }

        if (this.settings.settings["autoExplore"].enabled) {
            if (this._host.gamePage.diplomacy.races.filter(n => !n.unlocked && !n.hidden).length > 0) {
                var power = this._host.gamePage.resPool.get("manpower");
                if (power.value > 1000) {
                    this.buy(this._host.gamePage.diplomacyTab.exploreBtn);
                }
            }
        }

        if (this.settings.settings["autoLizardTrade"].enabled) {
            await this.tradeWithLizard();
        }
    }

    async tradeWithLizard() {
        if ("Summer" == this._host.gamePage.calendar.getCurSeasonTitle()) {
            var power = this._host.gamePage.resPool.get("manpower");
            var gold = this._host.gamePage.resPool.get("gold");

            if (this._host.gamePage.diplomacy.getGoldCost() < gold.value && this._host.gamePage.diplomacy.getManpowerCost() < power.value) {
                var wood = this._host.gamePage.resPool.get("wood");
                var minerals = this._host.gamePage.resPool.get("minerals");

                if (minerals.value > 0, 80 * minerals.maxValue) {
                    if (wood.value < 0, 50 * wood.maxValue) {
                        var race = this._host.gamePage.diplomacyTab.racePanels.find(n => n.race.name == "lizards");

                        if (race !== undefined) {
                            this.buy(race.tradeBtn);
                        }
                    }
                }
            }
        }
    }
}
