import { ScienceSettings } from '../settings/ScienceSettings';
import { UserScript } from '../UserScript';
import { Manager } from './Manager';

export class ScienceManager extends Manager<ScienceSettings> {
    settings: ScienceSettings

    constructor(
        host: UserScript
    ) {
        super(host);
    }

    async run() {
        if (this._host.gamePage.libraryTab.visible) {

            if (this._host.gamePage.ui.activeTabId !== this._host.gamePage.libraryTab.tabId) 
            {
                this._host.gamePage.libraryTab.render();
            }
            
            if (this._host.gamePage.libraryTab.buttons.length == 0) {
                let tabId = this._host.gamePage.libraryTab.tabId;
                $(`.${tabId}`)[0].click();
            }
            if (this.settings.settings["autoResearch"].enabled) {
                this.autoResearch();
            }
        }

        if (this._host.gamePage.workshopTab.visible) {

            if (this._host.gamePage.ui.activeTabId !== this._host.gamePage.workshopTab.tabId) 
            {
                this._host.gamePage.workshopTab.render();
            }
            
            if (this._host.gamePage.workshopTab.buttons.length == 0) {
                let tabId = this._host.gamePage.workshopTab.tabId;
                $(`.${tabId}`)[0].click();
            }
            if (this.settings.settings["autoWorkshop"].enabled) {
                this.autoWorkshop();
            }
        }
        
    }

    async autoResearch() {
        var items = this._host.gamePage.libraryTab.buttons.filter(n => n.model.visible && n.model.metadata.unlocked && !n.model.metadata.researched)

        // TODO Maybe find the less expensive
        var research = items.find(n => this.canBuy(n.model.prices));
        if (research !== undefined) {

            this.buy(research);
        }
    }

    async autoWorkshop() {
        var items = this._host.gamePage.workshopTab.buttons.filter(n => n.model.visible && n.model.metadata.unlocked && !n.model.metadata.researched)

        // TODO Maybe find the less expensive
        var research = items.find(n => this.canBuy(n.model.prices));
        if (research !== undefined) {

            this.buy(research);
        }
    }
}