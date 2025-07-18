import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from "path";
import fs from "fs";



const default_ssl_domain_name = 'bigdate.events';
let ssl_folder = path.join(process.env.SSL_MANAGER_OUTPUT_DIRECTORY || 'C:\\Projects\\__SSL_Repo', default_ssl_domain_name);


export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {},
		https: {
			ca: [fs.readFileSync( path.join(ssl_folder, 'bundle.ca-bundle') )],
			key: fs.readFileSync( path.join(ssl_folder, 'key.pem') ),
			cert: fs.readFileSync( path.join(ssl_folder, 'cert.crt') ),

			// SNICallback: function (domain, inner_sni_callback) {
			// 	let cert_context = get_ssl_certificate_context(domain);
			// 	if (cert_context) {
			// 		inner_sni_callback(null, cert_context);
			// 	} else {
			// 		// console.log('No ssl found for domain : ' + domain + ' || Sending default keys');
			// 		inner_sni_callback(null, get_default_ssl_certificate_context());
			// 	}
			// }
		}
	}
});
