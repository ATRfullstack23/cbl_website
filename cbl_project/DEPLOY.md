# Deploy the React (Vite) app

The live site is **`npm run build` → `dist/`** (React + Vite).  
The **`cbl-website/`** folder is an old static HTML demo — it is **not** deployed unless you change the whole setup.

---

## If you see **404** on Vercel

### 1. Correct **Root Directory** (most common)

If your GitHub repo looks like:

```text
Projects/
  cbl_project/
    package.json
    src/
```

then Vercel’s default root is **`Projects/`**, which has **no** Vite app → **404**.

**Fix:** Vercel → Project → **Settings → General → Root Directory** → set to **`cbl_project`** → **Redeploy**.

Or put the contents of **`vercel.monorepo.example.json`** at the **repository root** as **`vercel.json`** (same folder as `cbl_project`).

If the repo **is only** the app (root = `package.json` + `src/`), leave Root Directory **empty**.

### 2. **Build** must succeed

Open the deployment → **Building** logs. You must see `vite build` and **no errors**.

- If **`npm ci`** failed → ensure **`package-lock.json`** is committed, or we use **`npm install`** in `vercel.json` (already set).
- If **Module not found** → fix locally first: `npm install` then `npm run build`.

### 3. **Output directory** must be `dist`

Vercel → **Settings → General → Build & Output**

- **Output Directory** should be **`dist`** or **empty** (Vite preset uses `dist`).
- If it was changed to `build`, `public`, or `cbl-website` → set back to **`dist`** or clear it.

### 4. SPA fallback (fixes most `NOT_FOUND` on client routes)

`vercel.json` **rewrites** every path to **`/index.html`** so the server always serves your app shell; React then handles the URL.

**Mental model:** Vercel only sees **static files** — it does not run React Router. Without a rewrite, `/dashboard` looks like a **missing file** → 404. With a rewrite, `/dashboard` → **`index.html`** → React Router can render `/dashboard`.

**Vercel dashboard:** Framework **Vite**, Build **`npm run build`**, Output **`dist`** (or leave defaults if they match).

**If rewrites work but you still suspect routing:** temporarily try **`HashRouter`** — if that fixes deep links, the issue was server rewrite/config; ugly URLs (`#/path`) confirm it.

### 5. Quick local check

```bash
npm install
npm run build
```

Open **`dist/index.html`** — it should reference **`/assets/...`** scripts, not **`/src/...`**.

---

## Netlify

Use **`netlify.toml`**. If the Git root is above this app, set **Base directory** to **`cbl_project`**.
