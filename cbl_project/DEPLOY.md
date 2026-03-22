# Deploy CBL (frontend + API)

The points table calls **`/api/teams`**. On **Vercel** (or any static host) there is **no** Node server, so you must:

1. **Deploy the API** somewhere that runs Node (Render, Railway, Fly.io, etc.).
2. **Point the built site at that API** with **`VITE_API_URL`**.

`VITE_*` variables are read **at build time**. After you change them, **trigger a new deploy / rebuild**.

## 1. Deploy API (example: Render)

- Repo: same GitHub repo, **root directory** `cbl_project` (if your app lives there).
- **Start command:** `node server/server.js`
- **Build command:** `npm install` (or leave empty).
- **Env:** `MONGO_URI` = your Atlas connection string.  
  Optional: `CORS_ORIGIN` = `https://your-site.vercel.app` (or leave unset; server allows CORS broadly by default).

Copy the public URL, e.g. `https://cbl-api.onrender.com`.

**Atlas:** Network Access → allow `0.0.0.0/0` (or the provider’s egress).

Test: open `https://cbl-api.onrender.com/api/teams` — you should see JSON.

## 2. Deploy frontend (Vercel)

- **Root directory:** `cbl_project` (if applicable).
- **Build:** `npm run build`
- **Output:** `dist`
- **Environment variables:**
  - `VITE_API_URL` = `https://cbl-api.onrender.com` (no trailing slash)

Redeploy. The live site will request  
`https://cbl-api.onrender.com/api/teams`  
instead of `/api/teams` on Vercel (which does not exist).

## 3. Local dev (unchanged)

- Terminal 1: `npm run server`
- Terminal 2: `npm run dev`  
  Vite proxies `/api` → `localhost:5000`, so leave **`VITE_API_URL` empty** locally.
