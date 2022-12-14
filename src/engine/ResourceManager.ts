import { ResourceSettings } from '../settings/ResourceSettings';
import { Manager } from './Manager';
import { UserScript } from '../UserScript';
import { SettingPercentageOption } from '../settings/Setting';
import { Price } from '../types/core';

export class ResourceManager extends Manager<ResourceSettings> {
    settings: ResourceSettings;

    constructor(
        host: UserScript
    ) {
        super(host);
    }

    async run() {
        if (this.settings.settings["wood"].enabled) {
            this.craftWood();
        }

        if (this._host.gamePage.workshopTab.visible) {

            if (this._host.gamePage.workshopTab.buttons.length == 0) {
                let tabId = this._host.gamePage.workshopTab.tabId;
                $(`.${tabId}`)[0].click();
            }

            await this.craftResource("beam", ["wood"]);
            await this.craftResource("slab", ["minerals"]);
            await this.craftResource("plate", ["iron"]);
            await this.craftResource("steel", ["coal", "iron"]);

            await this.craftResource("gear", ["steel"], () => {
                let steel = this._host.gamePage.resPool.get("steel");
                let gear = this._host.gamePage.resPool.get("gear");
                return steel.value > this.findResourceNeeded("steel") && gear.value < this.findResourceNeeded("gear")
            });

            await this.craftResource("parchment", ["furs"], () => {
                return this._host.gamePage.resPool.get("furs").value > Math.max(100000, this.findResourceNeeded("furs"));
            });

            await this.craftResource("manuscript", ["culture", "parchment"], () => {
                let manuscript = this._host.gamePage.resPool.get("manuscript");
                let parchment = this._host.gamePage.resPool.get("parchment");

                return parchment.value > this.findResourceNeeded("parchment") && manuscript.value < this.findResourceNeeded("manuscript");
            });

            await this.craftResource("compedium", ["science", "manuscript"], () => {
                let manuscript = this._host.gamePage.resPool.get("manuscript");
                let compedium = this._host.gamePage.resPool.get("compedium");

                return compedium.value < this.findResourceNeeded("compedium") && manuscript.value > this.findResourceNeeded("manuscript");
            });

            await this.craftResource("blueprint", ["science", "compedium"], () => {
                let compedium = this._host.gamePage.resPool.get("compedium");
                let blueprint = this._host.gamePage.resPool.get("blueprint");

                return blueprint.value < this.findResourceNeeded("blueprint") && compedium.value > this.findResourceNeeded("compedium")
            });

            await this.craftResource("scaffold", ["beam"], () => {
                let beam = this._host.gamePage.resPool.get("beam");
                let scaffold = this._host.gamePage.resPool.get("scaffold");
                return beam.value > this.findResourceNeeded("beam") && scaffold.value < this.findResourceNeeded("scaffold");
            });

            await this.craftResource("ship", ["starchart", "plate", "scaffold"])
        }
    }

    async craftWood() {
        const settings = this.settings.settings["wood"] as SettingPercentageOption;
        const wood = this._host.gamePage.resPool.get("wood");

        const actual = (wood.value * 100) / wood.maxValue;

        if (actual < settings.percentage) {

            const catnip = this._host.gamePage.resPool.get("catnip");

            if ((catnip.value * 100 / catnip.maxValue) > 80) {
                const refineBtn = this._host.gamePage.bldTab.children.find(n => n.model.name == "Refine catnip");

                if (refineBtn.model.visible && refineBtn.model.enabled) {
                    this.buy(refineBtn);
                }
            }
        }
    }

    async craftResource(name: string, dependencies: string[], predicate?: () => boolean) {
        if (predicate != undefined) {
            if (!predicate()) {
                return;
            }
        }

        if (this.settings.settings[name].enabled) {
            const btn = this._host.gamePage.workshopTab.craftBtns.find(n => n.model.craft.name == name)

            if (btn.model.craft.unlocked) {
                let craft = true;

                dependencies.forEach(item => {
                    let res = this._host.gamePage.resPool.get(item);
                    if (res.value < this.findResourceNeeded(item)) {
                        craft = craft && false
                    }
                });

                if (craft && this.canBuy(btn.model.craft.prices)) {
                    this.buy(btn);
                }
            }
        }
    }

    findResourceNeeded(name: string): number {
        let res = this._host.gamePage.resPool.get(name);
        let allPrices: Price[] = []

        let bldPrices = this._host.gamePage.bldTab.children.map(n => n.model.prices).flatMap(n => n);
        Array.prototype.push.apply(allPrices, bldPrices);

        let sciencePrices = this._host.gamePage.libraryTab.buttons.filter(n => n.model.metadata.unlocked && n.model.metadata.researched == false).map(n => n.model.prices).flatMap(n => n);
        Array.prototype.push.apply(allPrices, sciencePrices);

        let workshopPrices = this._host.gamePage.workshopTab.buttons.filter(n => n.model.metadata.unlocked && !n.model.metadata.researched).map(n => n.model.prices).flatMap(n => n);
        Array.prototype.push.apply(allPrices, workshopPrices);

        let minNeeded = Math.min.apply(null, allPrices.filter(n => n.name == name).map(n => n.val))
        let min = minNeeded;
        if (res.maxValue > 0 && minNeeded > res.maxValue) {
            min = 0
        }

        let maxNeeded = Math.max.apply(null, allPrices.filter(n => n.name == name).map(n => n.val))
        let max = maxNeeded;
        if (res.maxValue > 0 && maxNeeded > res.maxValue) {
            max = res.maxValue
        }

        let moy = (min + max) / 2;
        return moy;
    }
}