import { Price, Button } from '../types/core';
import { UserScript } from '../UserScript';

export abstract class Manager<TSetting> {
    abstract settings: TSetting;
    _host: UserScript;

    constructor(
        host: UserScript
    ) {
        this._host = host;
    }

    abstract run(): Promise<void>

    canBuy(prices: Price[]): boolean {
        let result = true;
        let current = 0;
        while (current != prices.length && result) {
            result = result && this._host.gamePage.resPool.get(prices[current].name).value >= prices[current].val;
            current++; 
        }


        return result; 
    }

    buy(btn: Button) {
        this._host.printMessage(`Buy ${btn.model.name}`);
        btn.controller.buyItem(btn.model, {}, () => { });
    }
}