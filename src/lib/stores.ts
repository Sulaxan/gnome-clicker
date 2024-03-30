import { writable, type Writable } from "svelte/store";
import { type TextComponent } from "./protocol/text";
import { State } from "./connection";

// used by the client
export const instanceId: Writable<string | undefined> = writable(undefined);
export const clientId: Writable<string | undefined> = writable(undefined);
export const lastHeartbeatTime: Writable<number> = writable(0);
export const connectionState: Writable<State> = writable(State.NOT_CONNECTED);
export const activityLog: Writable<TextComponent[][]> = writable([]);

export const gnomes: Writable<number> = writable(0);
export const perks: Writable<Map<string, number>> = writable(new Map());
