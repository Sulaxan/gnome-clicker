import type { HeartBeatEvent } from "$lib/protocol/server";
import { PROCESSOR_MANAGER } from ".";

export class GnomeInstance {
    private instanceId: string;
    private gnomes: number = 0;
    private loopIntervalId: number | undefined = undefined;

    constructor(instanceId: string) {
        this.instanceId = instanceId;
    }

    public getGnomes() {
        return this.gnomes;
    }

    /**
     * Increments gnomes, implicitly applying any modifiers.
     */
    public incrementGnomes() {
        this.gnomes += 1;
    }

    public runGameLoop() {
        // already running
        if (this.loopIntervalId !== undefined) {
            return;
        }

        let lastHeartBeat = 0;

        this.loopIntervalId = setInterval(() => {
            // send hearbeat every few seconds
            if (Date.now() - lastHeartBeat > 5000) {
                lastHeartBeat = Date.now();

                PROCESSOR_MANAGER.broadcast(this.instanceId, {
                    eventType: "heartbeat",
                    payloadJson: JSON.stringify({} as HeartBeatEvent),
                });
            }

            // normal logic
        }, 1000);
    }

    public stopGameLoop() {
        clearInterval(this.loopIntervalId);
    }
}

export class GnomeInstanceManager {
    // instance id => gnome instance
    private instances: Map<string, GnomeInstance> = new Map();

    // gets or creates an instance
    public instance(instanceId: string): GnomeInstance {
        let inst = this.instances.get(instanceId);
        if (inst === undefined) {
            inst = new GnomeInstance(instanceId);
            inst.runGameLoop();
            this.instances.set(instanceId, inst);
        }

        return inst;
    }

    public deleteInstance(instanceId: string) {
        const instance = this.instances.get(instanceId);
        if (instance !== undefined) {
            instance.stopGameLoop();
            this.instances.delete(instanceId);
        }
    }
}
