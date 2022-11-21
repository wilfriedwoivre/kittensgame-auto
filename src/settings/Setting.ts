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

export class SettingPreviousValue extends Setting {
    count: number;

    constructor(label: string, enabled = false, count = 0) {
        super(label, enabled);
        this.count = count;
    }
}

export class SettingMaxValue extends Setting {
    max: number;

    constructor(label: string, enabled = false, max = 0) {
        super(label, enabled);
        this.max = max;
    }
}

export interface Settings<TSetting> { 
    settings: TSetting
}