import { writable, type Writable } from "svelte/store";

export const status: Writable<string> = writable("");
export const gnomes: Writable<number> = writable(0);
