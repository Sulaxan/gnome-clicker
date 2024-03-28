<script lang="ts">
    import { fetchAccessToken, setupDiscordSdk } from "$lib";
    import { handle, pushEvent } from "$lib/client_event_handler";
    import ActivityLog from "$lib/components/ActivityLog.svelte";
    import type { ClientClickEvent, ServerBoundPayload } from "$lib/protocol/client";
    import { DEBUG_MESSAGE, SUCCESS_COLOR, SYSTEM_MESSAGE, TextBuilder } from "$lib/protocol/text";
    import { eventStream, gnomes, status } from "$lib/stores";
    import { debug, log } from "$lib/util/log";
    import { onDestroy, onMount } from "svelte";

    let instanceId: string | undefined = undefined;
    setupDiscordSdk()
        .then((sdk) => {
            log(
                TextBuilder.from(SYSTEM_MESSAGE)
                    .text("Successfully connected to Discord client!")
                    .color(SUCCESS_COLOR)
                    .build()
            );
            instanceId = sdk.instanceId;
            subscribe(instanceId);

            fetchAccessToken(sdk);
        })
        .catch((reason) => {
            console.log("Could not connect to Discord");
            $status = "Disconnected from Discord";
            log(
                TextBuilder.from(SYSTEM_MESSAGE)
                    .text(
                        "Could not connect to Discord. This probably means you're running this in the browser. Check the console for more details."
                    )
                    .build()
            );
        });

    // FIXME: broken currently; always tries to reconnect even if the stream is already connected
    // onMount(() => {
    //     // checks if there's a connection to the server every few seconds; reconnects if there isn't
    //     setInterval(() => {
    //         // if the stream is undefined, then we still haven't gone through the initial connection
    //         if ($eventStream === undefined) {
    //             return;
    //         }

    //         // need to have a valid instance id
    //         if (instanceId === undefined) {
    //             return;
    //         }

    //         if ($eventStream.readyState === EventSource.CLOSED) {
    //             console.log("Reconnecting to Gnome server...");
    //             log(
    //                 TextBuilder.from(SYSTEM_MESSAGE).text("Reconnecting to Gnome server...").build()
    //             );
    //             subscribe(instanceId);
    //         }
    //     }, 5000);
    // });
    onDestroy(() => {
        if ($eventStream !== undefined) {
            $eventStream.close();
        }
    });

    // subscribes to SSE (server sent events)
    function subscribe(instanceId: string) {
        const sse = new EventSource(`/api/gnome?instance=${instanceId}`);
        $eventStream = sse;

        sse.onopen = () => {
            console.log("Established event stream connection with server");
            $status = "Connected";
            log(
                TextBuilder.from(SYSTEM_MESSAGE)
                    .text("Successfully connected to Gnome server.")
                    .color(SUCCESS_COLOR)
                    .build()
            );
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
            log(
                TextBuilder.from(SYSTEM_MESSAGE)
                    .text("Disconnected from the Gnome server, reconnecting in a few seconds...")
                    .build()
            );

            setTimeout(() => {
                log(
                    TextBuilder.from(SYSTEM_MESSAGE).text("Reconnecting to Gnome server...").build()
                );
                subscribe(instanceId);
            }, 5 * 1000);
        };
    }

    async function sendGnomeClickEvent() {
        if (instanceId === undefined) {
            return;
        }

        const clickEvent: ClientClickEvent = {};
        const payload: ServerBoundPayload = {
            instanceId: instanceId,
            eventType: "click",
            payloadJson: JSON.stringify(clickEvent),
        };

        // eager update, will be updated with true value later
        gnomes.update((val) => val + 1);

        pushEvent(payload);
        debug(TextBuilder.from(DEBUG_MESSAGE).text("Pushed click event").build());
    }
</script>

<div class="flex flex-col gap-y-5 items-center bg-gray-800 text-slate-200 h-screen">
    <h1 class="text-8xl font-bold py-5 animate-pulse text-indigo-600">GNOME CLICKER</h1>
    <p class="text-5xl font-bold text-yellow-400">{$gnomes} Gnomes</p>

    <button
        on:click={sendGnomeClickEvent}
        class="text-6xl bg-indigo-500 w-64 h-64 rounded-[200px] border-solid border-2 border-b-[6px]
        border-r-[6px] border-black hover:bg-indigo-600"
    >
        GNOME!
    </button>

    <div class="w-full absolute bottom-0">
        <!-- activity log -->
        <ActivityLog className="ml-auto mb-3 w-2/5 max-h-56" />

        <!-- status -->
        <div class="flex gap-x-2 w-fit p-3 text-left italic">
            Status:
            <div class="text-yellow-500">
                {$status}
            </div>
        </div>
    </div>
</div>
