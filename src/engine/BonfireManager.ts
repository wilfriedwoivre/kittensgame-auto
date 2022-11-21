import { BonfireSettings } from '../settings/BonfireSettings';
import { UserScript } from '../UserScript';
import { Manager } from './Manager';
import { SettingMaxValue } from '../settings/Setting';

export class BonfireManager extends Manager<BonfireSettings> {
    settings: BonfireSettings;

    constructor(
        host: UserScript
    ) {
        super(host);
    }

    async run() {
        if (this._host.gamePage.ui.activeTabId !== this._host.gamePage.bldTab.tabId) 
        {
            this._host.gamePage.bldTab.render();
        }

        await this.buyBuilding("workshop");
        await this.buyBuilding("field");
        await this.buyBuilding("library");
        await this.buyBuilding("barn");
        await this.buyBuilding("pasture", () => { return !this._host.gamePage.ironWill; });
        await this.buyBuilding("mine");
        await this.buyBuilding("hut", () => { return this._host.gamePage.village.happiness >= 0.80; })
        await this.buyBuilding("academy");
        await this.buyBuilding("unicornPasture");
        await this.buyBuilding("aqueduct");
        await this.buyBuilding("smelter", () => {
            return !this.reachMaxBuildingLimit("smelter");
        })
    }
    reachMaxBuildingLimit(name: string) {
        
        const btn = this._host.gamePage.bldTab.children.find(n => { if (n.model.metadata !== undefined) { return n.model.metadata.name == name } });

        return btn.model.metadata.val >= (this.settings.settings[name] as SettingMaxValue).max;
            
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
                        this.buy(btn);
                    }
                }
            }
        }
    }




}