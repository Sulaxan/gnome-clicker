import type { TextComponent } from "./text";

export enum EventResponseState {
    SUCCESS,
    ERROR,
}

/**
 * A response sent when a HTTP event is POSTed to the server.
 */
export interface EventResponse {
    /**
     * The state of the response.
     */
    state: EventResponseState;
    /**
     * An optional message describing what happened. This can be displayed to the user as is.
     */
    message?: string;
    /**
     * An optional text component describing what happened. This can be displayed to the user as is.
     *
     * Note that this is preferred over EventResponse.message.
     */
    messageTextComponent?: TextComponent[];
}

export interface ServerEvent {}

export interface InitialStateEvent extends ServerEvent {
    gnomes: number;
    // perk group id => zero-based tier
    perks: Map<string, number>;
}

export interface HeartBeatEvent extends ServerEvent {}

export interface UpdateGnomesEvent extends ServerEvent {
    gnomes: number;
}

export interface UpdatePerksEvent extends ServerEvent {
    // maps aren't supported by JSON.stringify; use an array of tuples instead
    // perk group id => zero-based tier
    perks: [groupId: string, tier: number][];
}

export interface SendMessageEvent extends ServerEvent {
    message: TextComponent[];
}

export type ClientBoundEventType =
    | "initial-state"
    | "heartbeat"
    | "update-gnomes"
    | "update-perks"
    | "send-message";

export interface ClientBoundPayload {
    eventType: ClientBoundEventType;
    payloadJson: string;
}
