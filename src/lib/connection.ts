import type { ClientBoundPayload } from "./protocol/server";

export enum State {
    NOT_CONNECTED,
    CONNECTING,
    CONNECTED,
    DISCONNECTED,
    ERROR,
}

export type EventHandler = (payload: ClientBoundPayload) => void;

export class GnomeConnection {
    private instanceId: string;
    private clientId: string;
    private connection: EventSource | undefined = undefined;
    private connectionState: State = State.NOT_CONNECTED;
    private eventHandler: EventHandler | undefined;
    private monitorIntervalId: number | undefined = undefined;
    public onStateChange: ((state: State) => void) | undefined = undefined;

    constructor(instanceId: string, clientId: string, eventHandler: EventHandler | undefined) {
        this.instanceId = instanceId;
        this.clientId = clientId;
        this.eventHandler = eventHandler;
    }

    private getState() {
        return this.connectionState;
    }

    private setState(state: State) {
        this.connectionState = state;
        if (this.onStateChange !== undefined) {
            this.onStateChange(state);
        }
    }

    /**
     * Connect to the Gnome server to receive Server-Sent Events (SSE).
     *
     * @param instanceId The instance id of the activity.
     */
    public connect() {
        if (this.connectionState === State.CONNECTED) {
            return;
        }

        this.setState(State.CONNECTING);
        const sse = new EventSource(
            `/api/gnome?instance=${this.instanceId}&clientId=${this.clientId}`
        );
        this.connection = sse;

        sse.onopen = () => {
            this.setState(State.CONNECTED);
            console.log("Established event stream connection with server");
        };
        sse.onmessage = (event) => {
            console.log("Received event stream message...");
            console.log(event.data);
            if (this.eventHandler !== undefined) {
                this.eventHandler(JSON.parse(event.data) as ClientBoundPayload);
            }
        };
        sse.onerror = () => {
            this.setState(State.ERROR);
            console.log("Error occurred in Gnome server connection");
        };
    }

    public disconnect() {
        if (this.connection !== undefined) {
            this.connection.close();
            this.setState(State.DISCONNECTED);
        }
    }

    /**
     * Periodically checks to see if the event stream is still connected, and attempts to reconnect
     * if needed.
     */
    public startMonitoring() {
        setInterval(() => {
            if (
                this.getState() === State.NOT_CONNECTED ||
                this.getState() === State.DISCONNECTED ||
                this.getState() === State.ERROR
            ) {
                console.log("Not connected to Gnome server, reconnecting...");
                this.connect();
            }
        }, 5000);
    }

    public stopMonitoring() {
        clearInterval(this.monitorIntervalId);
    }
}
