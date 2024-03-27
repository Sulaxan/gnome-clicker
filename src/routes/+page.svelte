<script lang="ts">
	import { fetchAccessToken, setupDiscordSdk } from '$lib';
	import type {
		ClientClickEvent,
		GnomeClientBoundPayload,
		GnomeServerBoundPayload,
		UpdateGnomesEvent
	} from '$lib/gnome/protocol';
	import { gnomes, status } from '$lib/stores';

	let instanceId: string;
	setupDiscordSdk().then((sdk) => {
		instanceId = sdk.instanceId;
		//TODO: close the sse connection when component is disposed
		subscribe(instanceId);

		fetchAccessToken(sdk);
	});

	// subscribes to SSE (server sent events)
	function subscribe(instanceId: string) {
		const sse = new EventSource(`/api/gnome?instance=${instanceId}`);
		sse.onopen = () => {
			console.log('Established event stream connection with server');
		};
		sse.onmessage = (event) => {
			console.log('Received event stream message...');
			console.log(event.data);
			const payload: GnomeClientBoundPayload = JSON.parse(event.data);

			// FIXME: extract out in the future
			switch (payload.eventId) {
				case 'update-gnomes':
					let update: UpdateGnomesEvent = JSON.parse(payload.payloadJson);
					gnomes.set(update.gnomes);
					break;
				default:
					break;
			}
		};

		return () => sse.close();
	}

	async function sendClickEvent() {
		const clickEvent: ClientClickEvent = {};
		const payload: GnomeServerBoundPayload = {
			instanceId: instanceId,
			eventId: 'click',
			payloadJson: JSON.stringify(clickEvent)
		};
		fetch('/api/gnome', {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'applicaiton/json'
			}
		});
	}
</script>

<div class="flex flex-col gap-y-5 items-center bg-gray-800 text-slate-200 h-screen">
	<h1 class="text-8xl font-bold py-5 animate-pulse text-indigo-600">GNOME CLICKER</h1>
	<p class="text-5xl font-bold text-yellow-400">{$gnomes} Gnomes</p>

	<button
		on:click={sendClickEvent}
		class="text-6xl bg-indigo-500 px-5 py-3 rounded-lg hover:bg-indigo-600"
	>
		GNOME!
	</button>
	<p class="italic">Status: {$status}</p>
</div>
