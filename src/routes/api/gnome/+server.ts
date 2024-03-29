import { error } from "@sveltejs/kit";
import type { RequestEvent } from "../token/$types";
import { INSTANCE_MANAGER, User } from "$lib/gnome";
import { type ClientClickEvent, type ServerBoundPayload } from "$lib/protocol/client";
import { type InitialStateEvent, type UpdateGnomesEvent } from "$lib/protocol/server";
import { encode } from "$lib/util/sse";

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
                console.log(
                    `Enqueueing payload for user ${clientId} in instance ${instanceId}...`
                );
                controller.enqueue(encode(null, JSON.stringify(payload)));
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

    switch (payload.eventType) {
        case "click":
            handleClick(payload.instanceId, JSON.parse(payload.payloadJson));
            break;
        default:
            break;
    }

    return new Response();
}

function getInitialState(instanceId: string): InitialStateEvent {
    const instance = INSTANCE_MANAGER.instance(instanceId);
    const event: InitialStateEvent = {
        gnomes: instance.getGnomes(),
    };

    return event;
}

// eslint-disable-next-line
function handleClick(instanceId: string, _event: ClientClickEvent) {
    const instance = INSTANCE_MANAGER.instance(instanceId);
    instance.incrementGnomes();

    const updateEvent: UpdateGnomesEvent = {
        gnomes: instance.getGnomes(),
    };
    instance.broadcast({
        eventType: "update-gnomes",
        payloadJson: JSON.stringify(updateEvent),
    });
}
