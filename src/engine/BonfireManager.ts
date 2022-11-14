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
    }

    async buyBuilding(name: string, predicate?: () => boolean) {
        if (this.settings.settings[name].enabled) {
            const btn = this._host.gamePage.bldTab.children.find(n => { if (n.model.metadata !== undefined) { return n.model.metadata.name == name } });

            if (btn !== undefined) {
                if (btn.model.enabled && btn.model.visible) {
                    if (this.canBuy(btn.model.prices)) {
                        this.buy(btn);
                    }
                }
            }
        }
    }




}