import { json, type RequestEvent } from '@sveltejs/kit';

export async function POST(event: RequestEvent) {
	const res = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			client_id: process.env.VITE_DISCORD_CLIENT_ID,
			client_secret: process.env.DISCORD_CLIENT_SECRET,
			grant_type: 'authorization_code',
			code: (await event.request.json()).code
		})
	});

	const { access_token } = await res.json();

	// returns the access_token as { access_token: "..." }
	return json({ access_token });
}
