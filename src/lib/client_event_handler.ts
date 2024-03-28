import type { ServerBoundPayload } from "./protocol/client";
import type { ClientBoundPayload, InitialStateEvent, UpdateGnomesEvent } from "./protocol/server";
import { DEBUG_MESSAGE, TextBuilder } from "./protocol/text";
import { gnomes, lastHeartbeatTime } from "./stores";
import { debug } from "./util/log";

export function handle(payload: ClientBoundPayload) {
    switch (payload.eventType) {
        case "initial-state": {
            const event: InitialStateEvent = JSON.parse(payload.payloadJson);
            gnomes.set(event.gnomes);
            break;
        }
        case "heartbeat": {
            console.log("Received Gnome server heartbeat");
            debug(TextBuilder.from(DEBUG_MESSAGE).text("Received heartbeat").build());
            lastHeartbeatTime.set(Date.now());
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
