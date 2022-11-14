import { Setting, Settings, SettingPercentageOption } from './Setting';

export type ResourceItemSettings = Record<string, Setting>

export class ResourceSettings implements Settings<ResourceItemSettings> {
    settings: ResourceItemSettings;

    constructor(
        resources: ResourceItemSettings = {
            wood: new SettingPercentageOption("Wood", true, 90)

        }
    ) {
        this.settings = resources;
    }
}