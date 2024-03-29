import type { ClientBoundPayload, HeartBeatEvent } from "$lib/protocol/server";
import type { User } from "./user";

class GnomeInstance {
    private instanceId: string;
    private users: User[] = [];
    private loopIntervalId: number | undefined = undefined;

    private gnomes: number = 0;

    constructor(instanceId: string) {
        this.instanceId = instanceId;
    }

    public broadcast(payload: ClientBoundPayload) {
        this.users.forEach((user) => user.payloadHandler(payload));
    }

    public getUsers(): User[] {
        return this.users;
    }

    public addUser(user: User) {
        this.users.push(user);
    }

    public removeUser(clientId: string) {
        const index = this.users.findIndex((user) => user.getClientId() === clientId);
        this.users.splice(index, 1);
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

        let lastHeartBeatTimeMillis = 0;

        this.loopIntervalId = setInterval(() => {
            // send hearbeat every few seconds
            if (Date.now() - lastHeartBeatTimeMillis > 5000) {
                lastHeartBeatTimeMillis = Date.now();

                this.broadcast({
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

    /**
     * Gets or creates an instance.
     *
     * @param instanceId The id of the instance.
     * @returns The GnomeInstance.
     */
    public instance(instanceId: string): GnomeInstance {
        let inst = this.instances.get(instanceId);
        if (inst === undefined) {
            inst = new GnomeInstance(instanceId);
            inst.runGameLoop();
            this.instances.set(instanceId, inst);
        }

        return inst;
    }

    /**
     * Deletes an instance.
     *
     * @param instanceId The id of the instance.
     */
    public deleteInstance(instanceId: string) {
        const instance = this.instances.get(instanceId);
        if (instance !== undefined) {
            instance.stopGameLoop();
            this.instances.delete(instanceId);
        }
    }

    /**
     * Adds a new user to an instance.
     *
     * @param instanceId The instance id.
     * @param user The user to add.
     */
    public addUser(instanceId: string, user: User) {
        const instance = this.instance(instanceId);
        instance.addUser(user);
    }

    /**
     * Removes a user from an instance. This method also additionally deletes the instance if there
     * are no remaining users in the instance.
     *
     * This method is preferred over GnomeInstance::removeUser.
     *
     * @param instanceId The instance id.
     * @param clientId The client id of the user to remove.
     */
    public removeUser(instanceId: string, clientId: string) {
        const instance = this.instance(instanceId);
        instance.removeUser(clientId);

        if (instance.getUsers().length === 0) {
            this.deleteInstance(instanceId);
        }
    }
}
