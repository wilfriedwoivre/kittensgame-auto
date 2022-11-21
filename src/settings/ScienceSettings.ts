import { Setting, Settings } from './Setting';

export type ScienceItemSettings = Record<string, Setting>

export class ScienceSettings implements Settings<ScienceItemSettings> {
    settings: ScienceItemSettings;

    constructor(
        science: ScienceItemSettings = {
            autoResearch: new Setting("Auto Research science", true),
            autoWorkshop: new Setting("Auto Research workshop", true)
        }) {
        this.settings = science;
    }
}