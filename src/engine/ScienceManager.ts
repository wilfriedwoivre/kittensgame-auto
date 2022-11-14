import { ScienceSettings } from '../settings/ScienceSettings';
import { UserScript } from '../UserScript';
import { Manager } from './Manager';

export class ScienceManager extends Manager<ScienceSettings> {
    settings: ScienceSettings

    constructor (
        host: UserScript
    ) {
        super(host);
    }

    async run() {
        if (this.settings.settings["autoResearch"].enabled) {
            this.autoResearch();
        }
    }

    async autoResearch() {
        var items = this._host.gamePage.libraryTab.buttons.filter(n => n.model.visible && n.model.enabled)

        // TODO Maybe find the less expensive
        var research = items.find(n => this.canBuy(n.model.prices)); 
        if (research !== undefined) {
            this.buy(research);
        }
    }
}