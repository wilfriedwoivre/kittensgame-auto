import { ResourceInfo } from './craft';
import { Button, Kitten, Job, Model } from './core';

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
    
    bld: {
        meta: [{
            name: string;
            val: number;
        }]
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

    workshopTab: {
        tabId: string;
        visible: boolean;
        buttons: Button[]
        render: () => void;
    }

    village: {
        huntAll: () => void;
        happiness: number;
        canHaveLeaderOrPromote: () => boolean;
        sim: {
            kittens: Kitten[]
        }
        getJob(name: string): Job
        assignJob(job: Job, amount: number): void;
        unassignJob(Kitten: Kitten): void;
        getResProduction: () => {
            catnip: number
            science: number
            wood: number
        }
    }

    villageTab:  {
        tabId: string;
        visible: boolean;
        buttons: {
            assignLinks: {
                assign: HTMLLinkElement
            }
            unassignLinks: {
                unassign: HTMLLinkElement
            }
            opts: {
                job: string
            }
            controller: {
                assignJobs: (model: Model, amt: number) => void;
                unassignJobs: (model: Model, amt: number) => void;
            }
            model: Model
        }[]
        render: () => void;
    }

    resetAutomatic: () => void
    save: () => void

    ui: {
        activeTabId: string
        render: () => void
    }

    getResourcePerTick: (resName: string, withConversion: boolean) => number;
    ticksPerSecond: number;


};