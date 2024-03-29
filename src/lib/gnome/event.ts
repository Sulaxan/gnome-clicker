import type { ClientBoundPayload } from "$lib/protocol/server";

/**
 * Responsible for dispatching events to a single client.
 */
export type EventListener = (payload: ClientBoundPayload) => void;

export class EventManager {
    // instanceId => (listener id => event listener)
    private listeners: Map<string, Map<string, EventListener>> = new Map();

    /**
     * Get all listeners for an instance id.
     *
     * @param instanceId The instance id to get listeners for.
     * @returns All listeners for an instance.
     */
    public instanceListeners(instanceId: string): Map<string, EventListener> {
        let procs = this.listeners.get(instanceId);
        if (procs === undefined) {
            procs = new Map();
            this.listeners.set(instanceId, procs);
        }

        return procs;
    }

    /**
     * Add a new listener for an instance.
     *
     * @param instanceId The instance to add the listener to.
     * @param listenerId The unique id of the listener.
     * @param listener The listener function.
     */
    public addListener(instanceId: string, listenerId: string, listener: EventListener) {
        const procs = this.instanceListeners(instanceId);
        procs.set(listenerId, listener);
    }

    /**
     * Remove a listener for an instance.
     *
     * @param instanceId The instance to remove the listener from.
     * @param listenerId The unique id of the listener to remove.
     */
    public removeListener(instanceId: string, listenerId: string) {
        const procs = this.instanceListeners(instanceId);
        procs.delete(listenerId);
    }

    /**
     * Broadcast a payload to all listeners of an instance.
     *
     * @param instanceId The instance id to broadcast to.
     * @param payload The payload to broadcast.
     */
    public broadcast(instanceId: string, payload: ClientBoundPayload) {
        const procs = this.instanceListeners(instanceId);
        console.log("procs size = " + procs.size);
        procs.forEach((processor) => processor(payload));
    }
}

/**
 * Generates a new unique listener id.
 *
 * @returns A unique listener id.
 */
export function nextEventListenerId(): string {
    // surely no duplicates...
    return Date.now().toPrecision(21).toString();
}
