import { Setting, Settings } from './Setting';

export type VillageItemSettings = Record<string, Setting>

export class VillageSettings implements Settings<VillageItemSettings> {
    settings: VillageItemSettings

    constructor(
        villageItems: VillageItemSettings = {
            autoManageJobs: new Setting("Manage Jobs", true)
        }
    ) {
        this.settings = villageItems;
    }
}