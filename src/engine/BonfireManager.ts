import { BonfireSettings } from '../settings/BonfireSettings';
import { UserScript } from '../UserScript';
import { Manager } from './Manager';
import { SettingMaxValue } from '../settings/Setting';
import { Button } from '../types/core';

export class BonfireManager extends Manager<BonfireSettings> {
    settings: BonfireSettings;

    constructor(
        host: UserScript
    ) {
        super(host);
    }

    async run() {
        await this.buyBuilding("workshop");

        await this.buyBuilding("steamworks");
        
        await this.buyBuilding("field");
        await this.buyBuilding("pasture", () => { return !this._host.gamePage.ironWill; });
        await this.buyBuilding("aqueduct");
        await this.buyBuilding("unicornPasture");

        await this.buyBuilding("mine");
        await this.buyBuilding("quarry");
        await this.buyBuilding("lumberMill");

        await this.buyBuilding("library");
        await this.buyBuilding("academy");
        await this.buyBuilding("observatory");

        await this.buyBuilding("smelter", () => {
            return !this.reachMaxBuildingLimit("smelter");
        })
        await this.buyBuilding("tradepost");
        await this.buyBuilding("temple");
        await this.buyBuilding("chapel");

        await this.buyBuilding("amphitheatre");

        await this.buyBuilding("hut", () => { return this._host.gamePage.village.happiness >= 0.80; })
        await this.buyBuilding("logHouse", () => { return this._host.gamePage.village.happiness >= 0.80; })
        

        await this.buyBuilding("barn");
        await this.buyBuilding("warehouse");
        await this.buyBuilding("harbor");

        await this.buyBuilding("mint", null, (btn: Button) => { 
            if (btn.model.metadata.on !== 0) {
                btn.remove.offAll.link.click();
            }
        });
    }
    
    reachMaxBuildingLimit(name: string) {
        
        const btn = this._host.gamePage.bldTab.children.find(n => { if (n.model.metadata !== undefined) { return n.model.metadata.name == name } });

        return btn.model.metadata.val >= (this.settings.settings[name] as SettingMaxValue).max;
            
    }

    async buyBuilding(name: string, before?: () => boolean, after?: (btn: Button) => void) {
        if (before != undefined) {
            if (!before()) {
                return;
            }
        }
        if (this.settings.settings[name].enabled) {
            const btn = this._host.gamePage.bldTab.children.find(n => { if (n.model.metadata !== undefined) { return n.model.metadata.name == name } });

            if (btn !== undefined) {
                if (btn.model.enabled) {
                    if (this.canBuy(btn.model.prices)) {
                        this.buy(btn);

                        if (after != undefined) {
                            after(btn);
                        }
                    }
                }
            }
        }

    }




}