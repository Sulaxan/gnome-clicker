// SERVER
export interface ServerEvent {}

export interface UpdateGnomesEvent extends ServerEvent {
	gnomes: number;
}

// sent to the client
export interface GnomeClientBoundPayload {
	eventId: 'update-gnomes';
	payloadJson: string;
}

// CLIENT
export interface ClientEvent {}

export interface ClientClickEvent extends ClientEvent {}

// sent to the server
export interface GnomeServerBoundPayload {
	instanceId: string;
	eventId: 'click';
	payloadJson: string;
}
