import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

var bundle_path =
  process.env.CA_BUNDLE_PATH ||
  path.resolve('./bundle.ca-bundle');

var ca_bundle = null;

if (fs.existsSync(bundle_path)) {
  ca_bundle = fs.readFileSync(bundle_path);
} else {
  console.warn(
    'CA bundle not found at',
    bundle_path,
    '- continuing without it'
  );
}

export default defineConfig({
  plugins: [react()],
  server: {
    // Node HTTPS also needs key + cert for the dev server; add them here if TLS fails to start.
    // Set CA_BUNDLE_PATH or place bundle.ca-bundle in the project root.
    https: ca_bundle
      ? {
          ca: ca_bundle,
        }
      : false,
  },
});
