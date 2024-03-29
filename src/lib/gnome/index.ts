import { EventManager } from "./event";
import { GnomeInstanceManager } from "./instance";

export * from "./event";
export * from "./user";

export const INSTANCE_MANAGER = new GnomeInstanceManager();
/**
 * @deprecated Replaced by user.
 */
export const EVENT_MANAGER = new EventManager();
