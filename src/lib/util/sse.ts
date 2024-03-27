/**
 * Encodes arbitrary data in the form expected for Server-Sent Events (SSE).
 *
 * @param event The event name. If null, this will be the default event (message);
 * @param data The data to encode.
 * @returns The encoded form of the data.
 */
export function encode(event: string | null, data: string): string {
	return `event: ${event === null ? 'message' : event}\ndata: ${data}\n\n`;
}
