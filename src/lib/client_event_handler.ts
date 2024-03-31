import type { PerkGroup } from "./gnome/perk";
import type { ClientAttemptPerkPurchaseEvent, ServerBoundPayload } from "./protocol/client";
import type {
    ClientBoundPayload,
    EventResponse,
    InitialStateEvent,
    SendMessageEvent,
    UpdateGnomesEvent,
    UpdatePerksEvent,
} from "./protocol/server";
import { DEBUG_MESSAGE, TextBuilder } from "./protocol/text";
import { activityLog, clientId, gnomes, instanceId, lastHeartbeatTime, perks } from "./stores";
import { debug, log } from "./util/log";

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
        case "update-perks": {
            const event: UpdatePerksEvent = JSON.parse(payload.payloadJson);
            perks.set(new Map(event.perks));
            break;
        }
        case "send-message": {
            const event: SendMessageEvent = JSON.parse(payload.payloadJson);
            log(event.message);
            break;
        }
        default:
            break;
    }
}

export async function pushEvent(payload: ServerBoundPayload): Promise<Response> {
    return fetch("/api/gnome", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

/**
 * Attemps a perk purchase.
 *
 * @param group The perk group.
 */
export function attemptPerkPurchase(group: PerkGroup) {
    const cid = clientId.get();
    if (cid === undefined) {
        return;
    }

    const iid = instanceId.get();
    if (iid === undefined) {
        return;
    }

    const event: ClientAttemptPerkPurchaseEvent = {
        id: group.id,
    };

    pushEvent({
        eventType: "attempt-perk-purchase",
        clientId: cid,
        instanceId: iid,
        payloadJson: JSON.stringify(event),
    }).then((response) => {
        console.log("soup is racist");
        response.json().then((res) => {
            const eventRes = res as EventResponse;
            const components = eventRes.messageTextComponent;
            if (components !== undefined) {
                activityLog.update((log) => {
                    log.push(components);
                    return log;
                });
            }
            console.log("soup is racist 2");

            const message = eventRes.message;
            if (message !== undefined) {
                activityLog.update((log) => {
                    log.push(TextBuilder.of(message).build());
                    return log;
                });
            }
            console.log("A");
        });
    });
}
