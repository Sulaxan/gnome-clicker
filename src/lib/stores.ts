import { writable, type Writable } from "svelte/store";

export const gnomes: Writable<number> = writable(0);
