import { ResourceSettings } from '../settings/ResourceSettings';
import { Manager } from './Manager';
import { UserScript } from '../UserScript';
import { SettingPercentageOption } from '../settings/Setting';

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
}