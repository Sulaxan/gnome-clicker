import { DiscordSDK } from '@discord/embedded-app-sdk';
import { status } from './stores';

export async function setupDiscordSdk(): Promise<DiscordSDK> {
	const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);
	await discordSdk.ready();
	status.set('SDK READY');

	return discordSdk;
}

export async function fetchAccessToken(sdk: DiscordSDK) {
	const { code } = await sdk.commands.authorize({
		client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
		response_type: 'code',
		state: '',
		prompt: 'none',
		scope: ['identify', 'guilds']
	});
	const res = await fetch('/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ code })
	});

	const { access_token } = await res.json();

	const auth = await sdk.commands.authenticate({ access_token });
	if (auth == null) {
		throw new Error('Authenticate command failed');
	}
}
