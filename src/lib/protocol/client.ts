export interface ClientEvent {}

export interface ClientClickEvent extends ClientEvent {}
// sent to the server

export type ServerBoundEventType = "click";

export interface ServerBoundPayload {
    instanceId: string;
    eventType: ServerBoundEventType;
    payloadJson: string;
}
