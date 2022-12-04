import { Setting, Settings, SettingPercentageOption } from './Setting';

export type ResourceItemSettings = Record<string, Setting>

export class ResourceSettings implements Settings<ResourceItemSettings> {
    settings: ResourceItemSettings;

    constructor(
        resources: ResourceItemSettings = {
            wood: new SettingPercentageOption("Wood", true, 90),
            beam: new Setting("beam", true),
            slab: new Setting("slab", true),
            plate: new Setting("plate", true),
            parchment: new Setting("parchment", true),
            scaffold: new Setting("scaffold", true),
            steel: new Setting("steel", true),
            manuscript: new Setting("manuscript", true),
            compedium: new Setting("compendium", true),
            gear: new Setting("gear", true),

        }
    ) {
        this.settings = resources;
    }
}