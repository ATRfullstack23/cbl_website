
import { json } from '@sveltejs/kit';




export async function load({ cookies, request }) {
	const sessionid = cookies.get('sessionid');
    // console.log(...request.headers);
    // console.log("userAgent: ", request.headers.get('user-agent'))

	return {
		sessionid: sessionid,
        userAgent: request.headers.get('user-agent')
	};
}