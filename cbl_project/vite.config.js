import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

var running_in_netlify = !!process.env.NETLIFY;
var running_in_ci = !!process.env.CI;

var bundle_path =
  process.env.CA_BUNDLE_PATH ||
  process.env.SSL_BUNDLE_PATH ||
  path.resolve('./bundle.ca-bundle');

var ca_bundle = null;

if (!running_in_netlify && !running_in_ci) {
  if (fs.existsSync(bundle_path)) {
    try {
      ca_bundle = fs.readFileSync(bundle_path);
    } catch (err) {
      console.warn(
        'Could not read CA bundle, continuing without it:',
        err && err.message ? err.message : err
      );
    }
  } else {
    console.warn(
      'CA bundle not found at',
      bundle_path,
      '- continuing without it'
    );
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    // Node HTTPS also needs key + cert for the dev server; add them here if TLS fails to start.
    // Set CA_BUNDLE_PATH or SSL_BUNDLE_PATH, or place bundle.ca-bundle in the project root.
    // Skipped on Netlify/CI so builds never read machine-only paths.
    https: ca_bundle
      ? {
          ca: ca_bundle,
        }
      : false,
  },
});
