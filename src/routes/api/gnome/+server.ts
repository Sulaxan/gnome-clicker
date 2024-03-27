import { error } from '@sveltejs/kit';
import type { RequestEvent } from '../token/$types';
import { INSTANCE_MANAGER, nextEventProcessorId, PROCESSOR_MANAGER } from '$lib/gnome/gnome';
import {
	type ClientClickEvent,
	type GnomeServerBoundPayload,
	type UpdateGnomesEvent
} from '$lib/gnome/protocol';

export async function GET(event: RequestEvent) {
	const instanceId = event.url.searchParams.get('instance');
	if (instanceId === null) {
		error(400, 'No instance provided');
	}

	const processorId = nextEventProcessorId();

	const stream = new ReadableStream({
		start(controller) {
			PROCESSOR_MANAGER.addProcessor(instanceId, processorId, (payload) => {
				console.log('Enqueueing...');
				controller.enqueue('event: message\ndata: ' + JSON.stringify(payload) + '\n\n');
			});
		},
		cancel() {
			console.log('Removing instance: ' + instanceId);
			PROCESSOR_MANAGER.removeProcessor(instanceId, processorId);
			// TODO: need to remove the instnace from INSTANCE_MANAGER if the number of processors
			// for the instanceId is 0
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
}

export async function POST(event: RequestEvent) {
	const body = await event.request.text();
	const payload: GnomeServerBoundPayload = JSON.parse(body);

	switch (payload.eventId) {
		case 'click':
			console.log('CLICKING: ' + payload.instanceId);
			handleClick(payload.instanceId, JSON.parse(payload.payloadJson));
			break;
		default:
			break;
	}

	return new Response();
}

// eslint-disable-next-line
function handleClick(instanceId: string, event: ClientClickEvent) {
	const instance = INSTANCE_MANAGER.instance(instanceId);
	instance.incrementGnomes();

	const payload: UpdateGnomesEvent = {
		gnomes: instance.getGnomes()
	};
	PROCESSOR_MANAGER.broadcast(instanceId, {
		eventId: 'update-gnomes',
		payloadJson: JSON.stringify(payload)
	});
}
