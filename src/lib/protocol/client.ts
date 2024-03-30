export interface ClientEvent {}

export interface ClientClickEvent extends ClientEvent {}

/**
 * Sent when the client attempts to purchase a perk. The server can automatically decide if the
 * client is attempting to buy a perk for the first time or the next upgrade of a perk.
 */
export interface ClientAttemptPerkPurchaseEvent extends ClientEvent {
    /**
     * The perk id.
     */
    id: string;
}

export type ServerBoundEventType = "click" | "attempt-perk-purchase";

export interface ServerBoundPayload {
    instanceId: string;
    clientId: string;
    eventType: ServerBoundEventType;
    payloadJson: string;
}
