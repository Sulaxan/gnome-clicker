import { EventProcessorManager } from "./event";
import { GnomeInstanceManager } from "./instance";

export * from "./event";

export const INSTANCE_MANAGER = new GnomeInstanceManager();
export const PROCESSOR_MANAGER = new EventProcessorManager();
