import type { ServerBoundPayload } from "./protocol/client";
import type { ClientBoundPayload, InitialStateEvent, UpdateGnomesEvent } from "./protocol/server";
import { gnomes } from "./stores";

export function handle(payloadStr: string) {
    const payload: ClientBoundPayload = JSON.parse(payloadStr);

    switch (payload.eventType) {
        case "initial-state": {
            const event: InitialStateEvent = JSON.parse(payload.payloadJson);
            gnomes.set(event.gnomes);
            break;
        }
        case "update-gnomes": {
            const event: UpdateGnomesEvent = JSON.parse(payload.payloadJson);
            gnomes.set(event.gnomes);
            break;
        }
        default:
            break;
    }
}

export function pushEvent(payload: ServerBoundPayload) {
    fetch("/api/gnome", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json",
        },
    });
}
