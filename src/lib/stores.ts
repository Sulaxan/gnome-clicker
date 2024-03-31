import { writable, type Writable } from "svelte/store";
import { type TextComponent } from "./protocol/text";
import { State } from "./connection";

export class IdContainer {
    private id: string | undefined = undefined;

    public get(): string | undefined {
        return this.id;
    }

    public set(id: string | undefined) {
        this.id = id;
    }
}

// used by the client
export const instanceId: IdContainer = new IdContainer();
export const clientId: IdContainer = new IdContainer();
export const lastHeartbeatTime: Writable<number> = writable(0);
export const connectionState: Writable<State> = writable(State.NOT_CONNECTED);
export const activityLog: Writable<TextComponent[][]> = writable([]);

export const perkShopModal: Writable<boolean> = writable(false);

export const gnomes: Writable<number> = writable(0);
export const perks: Writable<Map<string, number>> = writable(new Map());
