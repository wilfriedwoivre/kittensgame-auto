import { VillageSettings } from '../settings/VillageSettings';
import { Manager } from './Manager';
import { UserScript } from '../UserScript';

enum Job {
    Woodcutter = "woodcutter",
    Farmer = "farmer",
    Scholar = "scholar",
    Hunter = "hunter",
    Miner = "miner",
    Priest = "priest",
    Geologist = "geologist",
    Engineer = "engineer"
}
export class VillageManager extends Manager<VillageSettings> {
    settings: VillageSettings;

    constructor(
        host: UserScript
    ) {
        super(host);
    }

    async run() {
        await this.autoManageJobs()
    }

    async autoManageJobs() {
        if (this.settings.settings["autoManageJobs"].enabled) {
            let actualKittens = this._host.gamePage.village.sim.kittens;

            let currentAssign: Record<Job, number> = {
                woodcutter: this._host.gamePage.village.sim.kittens.filter(n => n.job == Job.Woodcutter).length,
                farmer: this._host.gamePage.village.sim.kittens.filter(n => n.job == Job.Farmer).length,
                scholar: this._host.gamePage.village.sim.kittens.filter(n => n.job == Job.Scholar).length,
                hunter: this._host.gamePage.village.sim.kittens.filter(n => n.job == Job.Hunter).length,
                miner: this._host.gamePage.village.sim.kittens.filter(n => n.job == Job.Miner).length,
                priest: this._host.gamePage.village.sim.kittens.filter(n => n.job == Job.Priest).length,
                geologist: this._host.gamePage.village.sim.kittens.filter(n => n.job == Job.Geologist).length,
                engineer: this._host.gamePage.village.sim.kittens.filter(n => n.job == Job.Engineer).length
            }

            console.log(currentAssign);

            let idealAssign: Record<Job, number> = {
                woodcutter: -2,
                farmer: -2,
                scholar: -2,
                hunter: -2,
                miner: -2,
                priest: -2,
                geologist: -2,
                engineer: -2
            }

            Object.entries(Job).forEach(([key, value]) => {
                if (!this._host.gamePage.village.getJob(value).unlocked) {
                    idealAssign[value] = 0;
                } else {
                    idealAssign[value] = -1;
                }
                switch (value) {
                    case Job.Woodcutter:
                        break;
                    case Job.Farmer:
                        break;
                    case Job.Scholar:
                        break;
                    case Job.Hunter:
                        break;
                    case Job.Miner:
                        break;
                    case Job.Priest:
                        break;
                    case Job.Geologist:
                        break;
                    case Job.Engineer:
                        break;


                }
            });

            console.log(idealAssign);
        }
    }
}
