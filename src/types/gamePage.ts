import { ResourceInfo } from './craft';
import { Button, Kitten, Job, Model, Price } from './core';

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

    diplomacy: {
        races: {
            name: string;
            unlocked: true;
            hidden: true;
        }[]
        getManpowerCost: () => number;
        getGoldCost: () => number;
    }
    diplomacyTab: {
        tabId: string;
        visible: boolean;
        render: () => void;
        exploreBtn: Button;
        racePanels: {
            embassyButton: Button;
            race: {
                name: string;
                embassyPrices: Price
            };
            tradeBtn: Button
        }[]
    }

    calendar: {
        observeBtn: HTMLDivElement | null;
        observeHandler: () => void;
        getCurSeasonTitle: () => string;
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
        policyPanel: {
            children: Button[]
        }
    }

    workshopTab: {
        tabId: string;
        visible: boolean;
        buttons: Button[]
        render: () => void;
        craftBtns: Button[];
    }

    religionTab: {
        tabId: string;
        children: Button[];
        visible: boolean;
        render: () => void;
        praiseBtn: Button;
        rUpgradeButtons: Button[]
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

    villageTab: {
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