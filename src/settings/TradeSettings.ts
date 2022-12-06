import { Setting, Settings } from './Setting';

export type TradeItemSettings = Record<string, Setting>

export class TradeSettings implements Settings<TradeItemSettings> {
    settings: TradeItemSettings;

    constructor(
        science: TradeItemSettings = {
            autoExplore: new Setting("Auto explore", true),
            autoEmbassy: new Setting("Auto Embassy", true),
            autoLizardTrade: new Setting("Auto trade with lizards", true),
        }) {
        this.settings = science;
    }
}