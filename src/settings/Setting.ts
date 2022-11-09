export class Setting {
    enabled: boolean;
    label: string

    constructor(label: string, enabled = false) {
        this.label = label;
        this.enabled = enabled;
    }
}

export class SettingMaxOption extends Setting {
    max: number;

    constructor(label: string, enabled = false, max = 1) {
        super(label, enabled);
        this.max = max;
    }
}

export interface Settings<TSetting> { 
    settings: TSetting
}