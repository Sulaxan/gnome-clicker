import type { ClientBoundPayload } from "$lib/protocol/server";

export type PayloadHandler = (payload: ClientBoundPayload) => void;

export class User {
    // Discord id ("client id") of the user, provided by Discord.
    private clientId: string;
    public payloadHandler: PayloadHandler = () => {};

    constructor(clientId: string) {
        this.clientId = clientId;
    }

    public getClientId(): string {
        return this.clientId;
    }
}
