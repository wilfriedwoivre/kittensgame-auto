import { QoLSettings } from '../settings/QoLSettings';
import { UserScript } from '../UserScript';

export class QoLManager {
    settings: QoLSettings
    private _host: UserScript;

    constructor(
        host: UserScript,
        settings = new QoLSettings()
    ) {
        this._host = host;
        this.settings = settings;
    }
}