import { ResourceInfo } from './craft';
import { Button } from './core';

export type GamePage = {
    toggleScheme: (value: string) => void;
    console: {
        maxMessages: number;
    }
    msg: (msg: string, type: string, tag: string, noBullet: boolean) => { span: HTMLElement };

    ironWill: boolean

    resPool: {
        get: (name: string) => ResourceInfo
    }

    bldTab: {
        tabId: string;
        children: Button[];
        render: () => void;
    }

    calendar: {
        observeBtn: HTMLDivElement | null;
        observeHandler: () => void;
    }

    managers: Array<{
        load: (saveData: Record<string, unknown>) => void;
        save: (saveData: Record<string, unknown>) => void;
    }>;

    libraryTab: {
        tabId: string;
        visible: boolean;
        buttons: Button[]
        render: () => void;
    }

    village: {
        huntAll: () => void;
        happiness: number
    }

    resetAutomatic: () => void
    save: () => void

    ui: {
        activeTabId: string
    }

};