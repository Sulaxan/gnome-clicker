import { writable, type Writable } from "svelte/store";
import { type TextComponent } from "./protocol/text";

// used by the client
export const instanceId: Writable<string | undefined> = writable(undefined);
export const lastHeartbeatTime: Writable<number> = writable(0);
export const status: Writable<string> = writable("None");
export const activityLog: Writable<TextComponent[][]> = writable([]);
export const gnomes: Writable<number> = writable(0);
