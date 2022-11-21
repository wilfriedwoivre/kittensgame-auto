import { VillageSettings } from '../settings/VillageSettings';
import { Manager } from './Manager';
import { UserScript } from '../UserScript';

enum Job {
    Farmer = "farmer",
    Engineer = "engineer",
    Woodcutter = "woodcutter",
    Scholar = "scholar",
    Miner = "miner",
    Priest = "priest",
    Geologist = "geologist",
    Hunter = "hunter"
}
export class VillageManager extends Manager<VillageSettings> {
    settings: VillageSettings;

    constructor(
        host: UserScript
    ) {
        super(host);
    }

    async run() {
        this._host.gamePage.villageTab.render()
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

            let idealAssign: Record<Job, number> = {
                woodcutter: -1,
                farmer: -1,
                scholar: -1,
                hunter: -1,
                miner: -1,
                priest: -1,
                geologist: -1,
                engineer: -1
            }

            let remainingKittens = actualKittens.length;
            let remainingJobs = 0;

            let ratioAssign: Record<Job, number> = {
                woodcutter: 0.15,
                miner: 0.15,
                farmer: -1,
                scholar: 0.20,
                priest: 0.25,
                engineer: -1,
                geologist: 0.25,
                hunter: -1
            }

            let jobUpdate: {
                name: string,
                value: number
            }[] = new Array;

            Object.entries(Job).forEach(([key, value]) => {
                if (!this._host.gamePage.village.getJob(value).unlocked) {
                    remainingJobs = remainingJobs + 1;
                }
            });

            Object.entries(Job).forEach(([key, value]) => {
                if (!this._host.gamePage.village.getJob(value).unlocked) {
                    idealAssign[value] = 0;
                } else {
                    idealAssign[value] = 0;
                    switch (value) {
                        case Job.Woodcutter:
                            var wood = this._host.gamePage.resPool.get("wood");
                            if (wood.value / wood.maxValue == 1) {
                                idealAssign[value] = 0;
                            } else {
                                idealAssign[value] = Math.trunc(remainingKittens * ratioAssign[value])
                            }
                            break;
                        case Job.Farmer:
                            var catnip = this._host.gamePage.resPool.get("catnip");
                            if (catnip.value / catnip.maxValue > 0.50) {
                                idealAssign[value] = 0;
                            } else {
                                if (catnip.value / catnip.maxValue < 0.10) {
                                    if (catnip.perTickCached < 0) {
                                        idealAssign[value] = currentAssign[value] + 1;
                                    } else {
                                        idealAssign[value] = currentAssign[value] + 1;
                                    }
                                    remainingJobs = remainingJobs - 1;
                                }
                                else {
                                    idealAssign[value] = 0;
                                }
                            }
                            remainingKittens = remainingKittens - idealAssign[value];
                            break;
                        case Job.Scholar:
                            var science = this._host.gamePage.resPool.get("science");
                            if (science.value / science.maxValue == 1) {
                                idealAssign[value] = 0;
                            } else {
                                idealAssign[value] = Math.trunc(remainingKittens * ratioAssign[value])
                            }
                            break;
                        case Job.Hunter:
                            var power = this._host.gamePage.resPool.get("manpower");
                            if (power.perTickCached == 0) {
                                idealAssign[value] = 1;
                            }
                            else {
                                if ((power.maxValue - 0) / (power.perTickCached * this._host.gamePage.ticksPerSecond) < 120) {
                                    idealAssign[value] = currentAssign[value] - 1;
                                }
                                if ((power.maxValue - 0) / (power.perTickCached * this._host.gamePage.ticksPerSecond) > 180) {
                                    idealAssign[value] = currentAssign[value] + 1;
                                }
                            }
                            remainingKittens = remainingKittens - idealAssign[value];
                            remainingJobs = remainingJobs - 1;
                            break;
                        case Job.Miner:
                            var minerals = this._host.gamePage.resPool.get("minerals");
                            if (minerals.value / minerals.maxValue == 1) {
                                idealAssign[value] = 0;
                            } else {
                                idealAssign[value] = Math.trunc(remainingKittens * ratioAssign[value])
                            }
                            break;
                        case Job.Priest:
                            var faith = this._host.gamePage.resPool.get("faith");
                            if (faith.value / faith.maxValue == 1) {
                                idealAssign[value] = 0;
                            } else {
                                idealAssign[value] = Math.trunc(remainingKittens * ratioAssign[value])
                            }
                            break;
                        case Job.Geologist:
                            var coal = this._host.gamePage.resPool.get("coal");
                            if (coal.value / coal.maxValue == 1) {
                                idealAssign[value] = 0;
                            } else {
                                idealAssign[value] = Math.trunc(remainingKittens * ratioAssign[value])
                            }
                            break;
                        case Job.Engineer:
                            // TODO Always 0, use only for eludium when it's available
                            idealAssign[value] = 0;
                            break;
                    }
                }
            });


            // Assign remaining kittens to hunter -> science -> wood
            remainingKittens = remainingKittens - idealAssign[Job.Woodcutter] - idealAssign[Job.Miner] - idealAssign[Job.Scholar] - idealAssign[Job.Priest] - idealAssign[Job.Geologist]
            if (this._host.gamePage.village.getJob("hunter").unlocked) {
                idealAssign[Job.Hunter] = idealAssign[Job.Hunter] + remainingKittens;
            } else {
                if (this._host.gamePage.village.getJob("scholar").unlocked) {
                    idealAssign[Job.Scholar] = idealAssign[Job.Scholar] + remainingKittens;
                } else {
                    idealAssign[Job.Woodcutter] = idealAssign[Job.Woodcutter] + remainingKittens;
                }
            }



            Object.entries(Job).forEach(([key, value]) => {
                jobUpdate.push({ name: value, value: idealAssign[value] - currentAssign[value] });
            });

            jobUpdate.sort((a, b) => a.value - b.value);

            if (this.settings.settings["debug"].enabled) {
                console.log(currentAssign);
                console.log(idealAssign);
                console.log(jobUpdate);
            }

            jobUpdate.forEach((item) => {
                if (item.value < 0) {
                    this._host.printMessage(`Remove ${item.value} kittens from ${item.name} job`);

                    var btn = this._host.gamePage.villageTab.buttons.find(n => n.opts.job == item.name);
                    btn.controller.unassignJobs(btn.model, Math.abs(item.value));
                }
                if (item.value > 0) {
                    this._host.printMessage(`Assign ${item.value} kittens from ${item.name} job`);

                    var btn = this._host.gamePage.villageTab.buttons.find(n => n.opts.job == item.name);
                    btn.controller.assignJobs(btn.model, item.value);
                }
            });

            if (jobUpdate.find(n => n.value != 0)) {
                // Update directly because render tab not working
                this._host.gamePage.ui.render();
            }
        }
    }

}
