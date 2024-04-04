<script lang="ts">
    import { fetchAccessToken, setupDiscordSdk } from "$lib";
    import { handle, pushEvent } from "$lib/client_event_handler";
    import ActivityLog from "$lib/components/ActivityLog.svelte";
    import Clicker from "$lib/components/Clicker.svelte";
    import GnomesDisplay from "$lib/components/GnomesDisplay.svelte";
    import Header from "$lib/components/Header.svelte";
    import PerkShop from "$lib/components/shop/PerkShop.svelte";
    import { GnomeConnection, State } from "$lib/connection";
    import type { ClientClickEvent, ServerBoundPayload } from "$lib/protocol/client";
    import { DEBUG_MESSAGE, SUCCESS_COLOR, SYSTEM_MESSAGE, TextBuilder } from "$lib/protocol/text";
    import { gnomes, instanceId, connectionState, clientId, perkShopModal } from "$lib/stores";
    import { debug, log } from "$lib/util/log";
    import { onDestroy } from "svelte";

    let gnomeConnection: GnomeConnection | null = null;

    setupDiscordSdk()
        .then((sdk) => {
            log(
                TextBuilder.from(SYSTEM_MESSAGE)
                    .text("Successfully connected to Discord client!")
                    .color(SUCCESS_COLOR)
                    .build()
            );
            instanceId.set(sdk.instanceId);

            if (sdk.clientId === null) {
                return;
            }
            clientId.set(sdk.clientId);

            // setup gnome server connection
            gnomeConnection = new GnomeConnection(instanceId.get()!, clientId.get()!, handle);
            gnomeConnection.connect();
            gnomeConnection.startMonitoring();
            gnomeConnection.onStateChange = (state) => {
                const report = (message: string) => {
                    console.log(message);
                    log(TextBuilder.from(SYSTEM_MESSAGE).text(message).build());
                };

                $connectionState = state;

                switch (state) {
                    case State.NOT_CONNECTED: {
                        break;
                    }
                    case State.CONNECTING: {
                        report("Connecting to Gnome server...");
                        break;
                    }
                    case State.CONNECTED: {
                        report("Successfully connected to Gnome server!");
                        break;
                    }
                    case State.DISCONNECTED: {
                        report("Disconnected from Gnome server");
                        break;
                    }
                    case State.ERROR: {
                        report("Gnome server connection error");
                        break;
                    }
                }
            };
            fetchAccessToken(sdk);
        })
        .catch((reason) => {
            console.log("Could not connect to Discord");
            $connectionState = State.ERROR;
            log(
                TextBuilder.from(SYSTEM_MESSAGE)
                    .text(
                        "Could not connect to Discord. This probably means you're running this in the browser. Check the console for more details."
                    )
                    .build()
            );
        });

    onDestroy(() => {
        if (gnomeConnection !== null) {
            gnomeConnection.stopMonitoring();
            gnomeConnection.disconnect();
        }
    });

    async function sendGnomeClickEvent() {
        if (instanceId.get() === undefined || clientId.get() === undefined) {
            return;
        }

        const clickEvent: ClientClickEvent = {};
        const payload: ServerBoundPayload = {
            instanceId: instanceId.get()!,
            clientId: clientId.get()!,
            eventType: "click",
            payloadJson: JSON.stringify(clickEvent),
        };

        // eager update, will be updated with true value later
        gnomes.update((val) => val + 1);

        pushEvent(payload);
        debug(TextBuilder.from(DEBUG_MESSAGE).text("Pushed click event").build());
    }
</script>

<div class="flex flex-col gap-y-5 items-center text-slate-200 h-screen">
    <Header />

    <div class="flex flex-col items-center">
        <GnomesDisplay gnomes={$gnomes} />
        <div class="text-md text-slate-200">Get as high a score as you can!</div>
    </div>

    <Clicker clickFunc={sendGnomeClickEvent} />

    <PerkShop />

    <div class="w-full xl:absolute xl:bottom-0">
        <!-- activity log -->
        <ActivityLog className="mb-3 mx-3 lg:ml-auto lg:w-1/2 lg:2/5 max-h-56" />
    </div>
</div>
