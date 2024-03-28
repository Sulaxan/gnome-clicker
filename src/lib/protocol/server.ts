export interface ServerEvent {}

export interface InitialStateEvent extends ServerEvent {
    gnomes: number;
}

export interface UpdateGnomesEvent extends ServerEvent {
    gnomes: number;
}

export interface HeartBeatEvent extends ServerEvent {}

export type ClientBoundEventType = "initial-state" | "heartbeat" | "update-gnomes";

export interface ClientBoundPayload {
    eventType: ClientBoundEventType;
    payloadJson: string;
}
