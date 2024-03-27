import { error } from '@sveltejs/kit';
import type { RequestEvent } from '../token/$types';
import { INSTANCE_MANAGER, nextEventProcessorId, PROCESSOR_MANAGER } from '$lib/gnome/gnome';
import { type ClientClickEvent, type ServerBoundPayload } from '$lib/protocol/client';
import { type InitialStateEvent, type UpdateGnomesEvent } from '$lib/protocol/server';
import { encode } from '$lib/util/sse';

export async function GET(event: RequestEvent) {
	const instanceId = event.url.searchParams.get('instance');
	if (instanceId === null) {
		error(400, 'No instance provided');
	}

	const processorId = nextEventProcessorId();

	// TODO: should send a heartbeat every 5 seconds or so such that the stream doesn't timeout
	const stream = new ReadableStream({
		start(controller) {
			// send initial state
			const initialState = getInitialState(instanceId);
			controller.enqueue(encode(null, JSON.stringify(initialState)));

			PROCESSOR_MANAGER.addProcessor(instanceId, processorId, (payload) => {
				console.log('Enqueueing...');
				controller.enqueue(encode(null, JSON.stringify(payload)));
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
	const payload: ServerBoundPayload = JSON.parse(body);

	switch (payload.eventType) {
		case 'click':
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
		gnomes: instance.getGnomes()
	};

	return event;
}

// eslint-disable-next-line
function handleClick(instanceId: string, _event: ClientClickEvent) {
	const instance = INSTANCE_MANAGER.instance(instanceId);
	instance.incrementGnomes();

	const updateEvent: UpdateGnomesEvent = {
		gnomes: instance.getGnomes()
	};
	PROCESSOR_MANAGER.broadcast(instanceId, {
		eventType: 'update-gnomes',
		payloadJson: JSON.stringify(updateEvent)
	});
}
