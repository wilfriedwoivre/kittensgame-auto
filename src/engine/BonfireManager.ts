import { BonfireSettings } from '../settings/BonfireSettings';
import { UserScript } from '../UserScript';
import { Manager } from './Manager';

export class BonfireManager extends Manager<BonfireSettings> {
    settings: BonfireSettings;

    constructor(
        host: UserScript
    ) {
        super(host);
    }

    async run() {

        await this.buyBuilding("field");
        await this.buyBuilding("library");
        await this.buyBuilding("barn");
        await this.buyBuilding("pasture", () => { return !this._host.gamePage.ironWill; });
        await this.buyBuilding("mine");
    }

    async buyBuilding(name: string, predicate?: () => boolean) {
        if (predicate != undefined) {
            if (!predicate()) {
                return;
            }
        }
        if (this.settings.settings[name].enabled) {
            const btn = this._host.gamePage.bldTab.children.find(n => { if (n.model.metadata !== undefined) { return n.model.metadata.name == name } });

            if (btn !== undefined) {
                if (btn.model.enabled) {
                    if (this.canBuy(btn.model.prices)) {
                        let tabId = this._host.gamePage.bldTab.tabId;
                        $(`.${tabId}`)[0].click();
                        this.buy(btn);
                    }
                }
            }
        }
    }




}