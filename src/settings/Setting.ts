export class Setting {
    enabled: boolean;
    label: string;

    constructor(label: string, enabled = false) {
        this.label = label;
        this.enabled = enabled;
    }
}

export class SettingPercentageOption extends Setting {
    percentage: number;

    constructor(label: string, enabled = false, percentage = 0) {
        super(label, enabled);
        this.percentage = percentage;
    }

}

export interface Settings<TSetting> { 
    settings: TSetting
}