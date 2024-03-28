// Represents an individual client-associated event processor on the server. Each processor is

import type { ClientBoundPayload } from "$lib/protocol/server";

// responsible for dispatching events to a single client.
export type EventProcessor = (payload: ClientBoundPayload) => void;

export class EventProcessorManager {
    // instanceId => (processor id => event processor)
    private processors: Map<string, Map<string, EventProcessor>> = new Map();

    // get all processors for an instance id
    public instanceProcessors(instanceId: string): Map<string, EventProcessor> {
        let procs = this.processors.get(instanceId);
        if (procs === undefined) {
            procs = new Map();
            this.processors.set(instanceId, procs);
        }

        return procs;
    }

    public addProcessor(instanceId: string, processorId: string, processor: EventProcessor) {
        const procs = this.instanceProcessors(instanceId);
        procs.set(processorId, processor);
    }

    public removeProcessor(instanceId: string, processorId: string) {
        const procs = this.instanceProcessors(instanceId);
        procs.delete(processorId);
    }

    public broadcast(instanceId: string, payload: ClientBoundPayload) {
        const procs = this.instanceProcessors(instanceId);
        console.log("procs size = " + procs.size);
        procs.forEach((processor) => processor(payload));
    }
}

export function nextEventProcessorId() {
    // surely no duplicates...
    return Date.now().toPrecision(21).toString();
}
