import { Setting, Settings } from './Setting';

export type VillageItemSettings = Record<string, Setting>

export class VillageSettings implements Settings<VillageItemSettings> {
    settings: VillageItemSettings

    constructor(
        villageItems: VillageItemSettings = {
            autoManageJobs: new Setting("Manage Jobs", true),
            debug: new Setting("Debug", false)
        }
    ) {
        this.settings = villageItems;
    }
}