export interface ServerEvent {}

export interface InitialStateEvent extends ServerEvent {
	gnomes: number;
}

export interface UpdateGnomesEvent extends ServerEvent {
	gnomes: number;
}
export type ClientBoundEventType = 'initial-state' | 'update-gnomes';

export interface ClientBoundPayload {
	eventType: ClientBoundEventType;
	payloadJson: string;
}
