import { ResourceInfo } from './craft';
import { Button } from './core';

export type GamePage = {
    toggleScheme: (value: string) => void;
    console: {
        maxMessages: number;
    }
    msg: (msg: string, type: string, tag: string, noBullet: boolean) => { span: HTMLElement };

    resPool: {
        get: (name: string) => ResourceInfo
    }

    bldTab: {
        children: Button[]
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
        buttons: Button[]
    }

    village: {
        huntAll: () => void
    }
};