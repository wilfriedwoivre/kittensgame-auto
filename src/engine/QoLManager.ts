import { QoLSettings } from '../settings/QoLSettings';
import { UserScript } from '../UserScript';
import { SettingPercentageOption, SettingPreviousValue } from '../settings/Setting';
import { Manager } from './Manager';

export class QoLManager extends Manager<QoLSettings> {
    settings: QoLSettings

    constructor(
        host: UserScript
    ) {
        super(host);
    }

    async run() {
        this._host.gamePage.bldTab.render();

        if (this.settings.settings["autoGather"].enabled) {
            this.autoGather();
        }
        if (this.settings.settings["observe"].enabled) {
            this.autoOberve();
        }
        if (this.settings.settings["autoHunt"].enabled) {
            await this.autoHunt();
        }
        if (this.settings.settings["zebras"].enabled) {
            await this.autoZebrasIronWill();
        }
        if (this.settings.settings["autoStartStopSmelter"].enabled) {
            await this.autoStartStopSmelters();
        }
    }


    async autoStartStopSmelters() {
        var smelter = this._host.gamePage.bldTab.children.find(n => { if (n.model.metadata !== undefined) { return n.model.metadata.name == "smelter" } });

        if (smelter.model.metadata.val > 0) {
            
            var coal = this._host.gamePage.resPool.get("coal");
            var gold = this._host.gamePage.resPool.get("gold");
            var iron = this._host.gamePage.resPool.get("iron");
            var titanium = this._host.gamePage.resPool.get("titanium");

            if (smelter.model.metadata.on > 0) {
                // Auto stop if all ressources are max
                var stop = true;

                if (smelter.model.metadata.effects.coalPerTickAutoprod > 0) {
                    stop = stop && coal.value == coal.maxValue;
                }
                if (smelter.model.metadata.effects.goldPerTickAutoprod > 0) {
                    stop = stop && gold.value == gold.maxValue;
                }
                if (smelter.model.metadata.effects.ironPerTickAutoprod > 0) {
                    stop = stop && iron.value == iron.maxValue;
                }
                if (smelter.model.metadata.effects.titaniumPerTickAutoprod > 0) {
                    stop = stop && titanium.value == titanium.maxValue;
                }
                
                if (stop) {
                    smelter.remove.offAll.link.click();
                }
            } else {
                if (smelter.model.metadata.on == 0) {
                    // Auto start if all ressources are max
                    var start = false;
    
                    if (smelter.model.metadata.effects.coalPerTickAutoprod > 0) {
                        start = start || coal.value < coal.maxValue * 0.10;
                    }
                    if (smelter.model.metadata.effects.goldPerTickAutoprod > 0) {
                        start = start || gold.value < gold.maxValue * 0.10;
                    }
                    if (smelter.model.metadata.effects.ironPerTickAutoprod > 0) {
                        start = start || iron.value < iron.maxValue * 0.10;
                    }
                    if (smelter.model.metadata.effects.titaniumPerTickAutoprod > 0) {
                        start = start || titanium.value < titanium.maxValue * 0.10;
                    }
                    
                    if (stop) {
                        smelter.remove.offAll.link.click();
                    }
                }
            }
        }

    }


    async autoGather() {
        const settings = this.settings.settings["autoGather"] as SettingPercentageOption;
        const catnip = this._host.gamePage.resPool.get("catnip");

        const actual = (catnip.value * 100) / catnip.maxValue;

        if (actual < settings.percentage) {
            const gatherBtn = this._host.gamePage.bldTab.children.find(n => n.model.name == "Gather catnip");
            this.buy(gatherBtn);
        }
    }

    async autoOberve() {
        if (this._host.gamePage.calendar.observeBtn !== null) {
            this._host.gamePage.calendar.observeHandler();
        }
    }

    async autoHunt() {
        let catpower = this._host.gamePage.resPool.get("manpower");

        if (catpower.value == catpower.maxValue) {
            this._host.gamePage.village.huntAll();
        }

    }

    async autoZebrasIronWill() {
        let setting = this.settings.settings["zebras"] as SettingPreviousValue;
        let actual = this._host.gamePage.resPool.get("zebras")
        if (actual.maxValue != setting.count) {
            if (actual.value) {
                setting.count = actual.maxValue;
                this._host.gamePage.save();
                this._host.gamePage.resetAutomatic();
            }
        }
    }
}
