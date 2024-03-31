import { error } from "@sveltejs/kit";
import type { RequestEvent } from "../token/$types";
import { INSTANCE_MANAGER, User } from "$lib/gnome";
import {
    type ClientAttemptPerkPurchaseEvent,
    type ClientClickEvent,
    type ServerBoundPayload,
} from "$lib/protocol/client";
import {
    EventResponseState,
    type EventResponse,
    type InitialStateEvent,
    type UpdateGnomesEvent,
} from "$lib/protocol/server";
import { encode } from "$lib/util/sse";
import type { GnomeInstance } from "$lib/gnome/instance";
import { getPerkGroup } from "$lib/gnome/perk";
import { addPerk, broadcastMessage } from "$lib/gnome/helper";
import { PERK_MESSAGE, TextBuilder } from "$lib/protocol/text";

export async function GET(event: RequestEvent) {
    const instanceId = event.url.searchParams.get("instance");
    if (instanceId === null) {
        error(400, "No instance id provided");
    }

    const clientId = event.url.searchParams.get("clientId");
    if (clientId === null) {
        error(400, "No discord id provided");
    }

    const stream = new ReadableStream({
        start(controller) {
            // send initial state
            const initialState = getInitialState(instanceId);
            controller.enqueue(encode(null, JSON.stringify(initialState)));

            const user = new User(clientId);
            user.payloadHandler = (payload) => {
                console.log(`Enqueueing payload for user ${clientId} in instance ${instanceId}...`);
                try {
                    controller.enqueue(encode(null, JSON.stringify(payload)));
                } catch (e) {
                    console.log("Error while enqueueing payload (disconnected?)");
                }
            };

            INSTANCE_MANAGER.addUser(instanceId, user);
        },
        cancel() {
            console.log(`Removing user ${clientId} for instance ${instanceId}`);
            INSTANCE_MANAGER.removeUser(instanceId, clientId);
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}

export async function POST(event: RequestEvent) {
    const body = await event.request.text();
    const payload: ServerBoundPayload = JSON.parse(body);
    const response = handle(payload);

    return new Response(JSON.stringify(response), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

function handle(payload: ServerBoundPayload): EventResponse {
    const instance = INSTANCE_MANAGER.instance(payload.instanceId);

    switch (payload.eventType) {
        case "click": {
            handleClick(instance, JSON.parse(payload.payloadJson));
            break;
        }
        case "attempt-perk-purchase": {
            return handleAttemptPerkPurchase(instance, JSON.parse(payload.payloadJson));
        }
        default:
            break;
    }

    return {
        state: EventResponseState.SUCCESS,
    };
}

function getInitialState(instanceId: string): InitialStateEvent {
    const instance = INSTANCE_MANAGER.instance(instanceId);
    const event: InitialStateEvent = {
        gnomes: instance.getGnomes(),
        perks: instance.getPerks(),
    };

    return event;
}

// eslint-disable-next-line
function handleClick(instance: GnomeInstance, _event: ClientClickEvent) {
    instance.incrementGnomes();

    const updateEvent: UpdateGnomesEvent = {
        gnomes: instance.getGnomes(),
    };
    instance.broadcast({
        eventType: "update-gnomes",
        payloadJson: JSON.stringify(updateEvent),
    });
}

function handleAttemptPerkPurchase(
    instance: GnomeInstance,
    event: ClientAttemptPerkPurchaseEvent
): EventResponse {
    const groupId = event.id;
    const group = getPerkGroup(groupId);
    if (group === undefined) {
        console.log(`Invalid perk group id ${groupId}`);
        return {
            state: EventResponseState.ERROR,
            message: "Invalid perk id",
        };
    }

    const currentInstancePerkTier = instance.getPerks().get(groupId);
    const nextTier = currentInstancePerkTier !== undefined ? currentInstancePerkTier + 1 : 0;

    if (nextTier >= group.perks.length) {
        return {
            state: EventResponseState.ERROR,
            message: group.perks.length === 0 ? "Perk has no tiers" : "Perk is already maxed",
        };
    }

    const perk = group.perks[nextTier];
    const purchaseCheck = perk.canPurchase(instance);

    if (!purchaseCheck.purchaseable) {
        return {
            state: EventResponseState.ERROR,
            message: `Can't purchase perk${
                purchaseCheck.message !== undefined ? `: ${purchaseCheck.message}` : ""
            }`,
        };
    }

    perk.purchase(instance);
    addPerk(instance, group, nextTier);

    broadcastMessage(
        instance,
        TextBuilder.from(PERK_MESSAGE)
            .text("[")
            .color("#ffffff")
            .append(group.name)
            .text("]")
            .color("#ffffff")
            .text(`Purchased [Tier ${nextTier + 1}]`)
            .build()
    );

    return {
        state: EventResponseState.SUCCESS,
    };
}
