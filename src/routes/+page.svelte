<script lang="ts">
    import { fetchAccessToken, setupDiscordSdk } from "$lib";
    import { handle, pushEvent } from "$lib/client_event_handler";
    import ActivityLog from "$lib/components/ActivityLog.svelte";
    import type { ClientClickEvent, ServerBoundPayload } from "$lib/protocol/client";
    import { eventStream, gnomes, status } from "$lib/stores";
    import { onDestroy } from "svelte";

    let instanceId: string;
    setupDiscordSdk()
        .then((sdk) => {
            instanceId = sdk.instanceId;
            //TODO: close the sse connection when component is disposed
            subscribe(instanceId);

            fetchAccessToken(sdk);
        })
        .catch((reason) => {
            console.log("Could not connect to Discord");
            $status = "Disconnected from Discord";
        });

    onDestroy(() => {
        if ($eventStream !== undefined) {
            $eventStream.close();
        }
    });

    // subscribes to SSE (server sent events)
    function subscribe(instanceId: string) {
        const sse = new EventSource(`/api/gnome?instance=${instanceId}`);
        eventStream.set(sse);
        sse.onopen = () => {
            console.log("Established event stream connection with server");
            $status = "Connected";
        };
        sse.onmessage = (event) => {
            console.log("Received event stream message...");
            console.log(event.data);
            handle(event.data);
        };
        sse.onerror = () => {
            // try to reconnect in a few seconds
            console.log("Error occurred, reconnecting in a few seconds...");
            $status = "Disconnected from server, waiting to reconnect...";
            setTimeout(() => {
                subscribe(instanceId);
            }, 5 * 1000);
        };
    }

    async function sendGnomeClickEvent() {
        const clickEvent: ClientClickEvent = {};
        const payload: ServerBoundPayload = {
            instanceId: instanceId,
            eventType: "click",
            payloadJson: JSON.stringify(clickEvent),
        };

        // eager update, will be updated with true value later
        gnomes.update((val) => val + 1);

        pushEvent(payload);
    }
</script>

<div class="flex flex-col gap-y-5 items-center bg-gray-800 text-slate-200 h-screen">
    <h1 class="text-8xl font-bold py-5 animate-pulse text-indigo-600">GNOME CLICKER</h1>
    <p class="text-5xl font-bold text-yellow-400">{$gnomes} Gnomes</p>

    <button
        on:click={sendGnomeClickEvent}
        class="text-6xl bg-indigo-500 px-5 py-3 rounded-lg hover:bg-indigo-600"
    >
        GNOME!
    </button>

    <div class="w-full absolute bottom-0">
        <!-- activity log -->
        <ActivityLog className="ml-auto mb-3 w-1/2 max-h-56" />

        <!-- status -->
        <div class="flex gap-x-2 bg-blue-700 w-fit p-3 text-left italic">
            Status:
            <div class="text-yellow-500">
                {$status}
            </div>
        </div>
    </div>
</div>
