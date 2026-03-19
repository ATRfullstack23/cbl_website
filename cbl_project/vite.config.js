import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

var https_options;

var is_ci = !!(process.env.NETLIFY || process.env.CI);

if (!is_ci) {
  var bundle_path =
    process.env.SSL_BUNDLE_PATH ||
    process.env.CA_BUNDLE_PATH ||
    path.resolve('./bundle.ca-bundle');

  if (!fs.existsSync(bundle_path)) {
    bundle_path =
      'C:\\Projects\\__SSL_Repo\\bigdate.events\\bundle.ca-bundle';
  }

  if (fs.existsSync(bundle_path)) {
    try {
      https_options = {
        ca: fs.readFileSync(bundle_path),
      };
    } catch (err) {
      console.warn(
        'Could not read CA bundle, continuing without it:',
        err && err.message ? err.message : err
      );
    }
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    https: https_options || false,
  },
});
