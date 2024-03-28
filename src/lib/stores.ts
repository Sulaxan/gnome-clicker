import { writable, type Writable } from "svelte/store";
import { TextBuilder, type TextComponent } from "./protocol/text";

// used by the client
export const status: Writable<string> = writable("None");
export const gnomes: Writable<number> = writable(0);
export const eventStream: Writable<EventSource | undefined> = writable(undefined);
export const activityLog: Writable<TextComponent[][]> = writable([]);
