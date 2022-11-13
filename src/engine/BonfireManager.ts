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
        if (this.settings.settings["field"].enabled) {
            await this.buyField();
        }
    }

    async buyField() {
        const fieldBtn = this._host.gamePage.bldTab.children.find(n => { if (n.model.metadata !== undefined) { return n.model.metadata.name == "field" }});

        if (fieldBtn !== undefined) {
            if (fieldBtn.model.enabled && fieldBtn.model.visible) {
                if (this.canBuy(fieldBtn.model.prices)) {
                    this.buy(fieldBtn);
                }
            }
        }
    }

    
}