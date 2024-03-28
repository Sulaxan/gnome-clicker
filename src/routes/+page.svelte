<script lang="ts">
    import { fetchAccessToken, setupDiscordSdk } from "$lib";
    import { handle, pushEvent } from "$lib/client_event_handler";
    import ActivityLog from "$lib/components/ActivityLog.svelte";
    import { GnomeConnection, State } from "$lib/connection";
    import type { ClientClickEvent, ServerBoundPayload } from "$lib/protocol/client";
    import { DEBUG_MESSAGE, SUCCESS_COLOR, SYSTEM_MESSAGE, TextBuilder } from "$lib/protocol/text";
    import { gnomes, instanceId, status } from "$lib/stores";
    import { debug, log } from "$lib/util/log";
    import { onDestroy } from "svelte";

    let gnomeConnection: GnomeConnection | undefined = undefined;

    setupDiscordSdk()
        .then((sdk) => {
            log(
                TextBuilder.from(SYSTEM_MESSAGE)
                    .text("Successfully connected to Discord client!")
                    .color(SUCCESS_COLOR)
                    .build()
            );
            $instanceId = sdk.instanceId;

            // setup gnome server connection
            gnomeConnection = new GnomeConnection($instanceId, handle);
            gnomeConnection.connect();
            gnomeConnection.startMonitoring();
            gnomeConnection.onStateChange = (state) => {
                const report = (message: string) => {
                    console.log(message);
                    log(TextBuilder.from(SYSTEM_MESSAGE).text(message).build());
                };

                switch (state) {
                    case State.NOT_CONNECTED: {
                        break;
                    }
                    case State.CONNECTING: {
                        report("Connecting to Gnome server...");
                        $status = "CONNECTING";
                        break;
                    }
                    case State.CONNECTED: {
                        report("Successfully connected to Gnome server!");
                        $status = "CONNECTED";
                        break;
                    }
                    case State.DISCONNECTED: {
                        report("Disconnected from Gnome server");
                        $status = "DISCONNECTED";
                        break;
                    }
                    case State.ERROR: {
                        report("Gnome server connection error");
                        $status = "ERROR";
                        break;
                    }
                }
            };

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

    onDestroy(() => {
        if (gnomeConnection !== undefined) {
            gnomeConnection.stopMonitoring();
            gnomeConnection.disconnect();
        }
    });

    async function sendGnomeClickEvent() {
        if ($instanceId === undefined) {
            return;
        }

        const clickEvent: ClientClickEvent = {};
        const payload: ServerBoundPayload = {
            instanceId: $instanceId,
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
