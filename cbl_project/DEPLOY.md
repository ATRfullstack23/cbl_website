# Deploy without NOT_FOUND or build surprises

## Vercel (this folder is the Git root)

`vercel.json` is already set: `npm ci`, `npm run build`, publish `dist`, SPA rewrite to `index.html`, Node 20.

Link the repo, accept defaults, deploy.

## Vercel (monorepo: Git root is the parent folder)

Vercel must build **this** app, not the repo root.

**Option A (recommended):** In the project on Vercel: **Settings → General → Root Directory** → set to `cbl_project` (path from repo root). Keep using the `vercel.json` inside `cbl_project`.

**Option B:** At the **repository root** (parent of `cbl_project`), add a `vercel.json` with the contents of `vercel.monorepo.example.json` in this folder (same directory as this file).

## Netlify

Use `netlify.toml` in this folder. Set **Base directory** to `cbl_project` if the Git root is above this project.

## Quick local check

```bash
npm ci
npm run build
```

You must see `dist/index.html` and `dist/assets/*`. If that fails, fix it before deploying.
