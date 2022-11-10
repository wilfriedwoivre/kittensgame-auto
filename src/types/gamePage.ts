import { ResourceInfo } from './craft';
import { Model } from './core';

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
        children:[{
            controller: {
                buyItem: (model: Model, event: any, callback: any) => void;
            }
            model: Model
        }]
    }
};