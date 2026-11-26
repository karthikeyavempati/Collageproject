# PM Internship Scheme - Full Stack App

A React (Vite) frontend with an Express API backend, AI-powered by **Gemma 4
31B IT** (`gemma-4-31b-it`), deployable to Vercel.

## How the AI works

Gemma 4 is Google DeepMind's open-weight model family, but it's served
through the **same Gemini API endpoint and `@google/genai` SDK** as Gemini
models - so it uses your existing `GEMINI_API_KEY`, no separate provider,
account, or SDK needed. The backend calls `gemma-4-31b-it` for:

- `/api/ai-coach` - the AI Match Coach chat drawer
- `/api/parse-resume` - resume parsing on the login/signup screen

Both routes are wrapped in try/catch with **rule-based fallback replies**, so
if the API key is missing, the model call times out, or Gemma returns
something unparseable, the endpoint still responds successfully (200) instead
of crashing or hanging - the UI degrades gracefully instead of breaking.

## Project structure

```
src/api/app.ts     # shared Express app: all /api/* routes, used by both
                    #   local dev (server.ts) and the Vercel function
api/index.ts        # Vercel serverless function entry point (imports the app)
server.ts            # local dev server (Express + Vite middleware)
src/                 # React frontend
vercel.json           # Vercel build + routing config
```

## Run locally

**Prerequisites:** Node.js 18+

1. `npm install`
2. Copy `.env.example` to `.env` and set either:
   - `GEMINI_API_KEY` to your Google AI Studio key (for Gemma 4), or
   - `GORQ_API_KEY` to your Gorq AI key (for Gorq-powered responses).
3. `npm run dev`
4. Open http://localhost:3000

Without any AI key set, the app still runs fully - the `/api/ai-coach` route
uses a rule-based fallback response instead of calling an external model.

## Deploy to Vercel

1. Push this project to a GitHub repo.
2. In Vercel, "Add New Project" → import the repo. Vercel auto-detects the
   config from `vercel.json` (Vite build → `dist/`, `api/index.ts` as a
   serverless function).
3. In the Vercel project's **Settings → Environment Variables**, add:
   - `GEMINI_API_KEY` - your Google AI Studio key for Gemma 4 (optional)
   - `GORQ_API_KEY` - your Gorq AI key (optional)
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD` - required to enable administrator
     login; configure them as private Vercel environment variables. There is no
     default administrator credential. Use a unique password of at least 12 characters.
4. Deploy. Vercel serves the built frontend as static assets and routes
   `/api/*` requests to the serverless function.

### Local production build test (optional)

```
npm run build   # runs `vite build`, same command Vercel runs
npm start       # serves dist/ + API together via Express (NODE_ENV=production)
```

## Important: data persistence

This app keeps `internships`, `candidates`, and other demo data **in
memory**, mirroring the original prototype. On Vercel, each serverless
function invocation can run on a different, ephemeral instance, so:

- Data written in one request (e.g. a new application) may not be visible in
  the next request if it lands on a different instance.
- All data resets on redeploy or when instances spin down.

This is fine for demos, but if you need real persistence, swap the in-memory
arrays in `src/api/app.ts` for a real database (Vercel Postgres, Supabase,
MongoDB Atlas, etc.) - the route handlers are already isolated so this is a
localized change.

## API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET/POST | `/api/login`, `/api/login/rate-limit-status`, `/api/login/reset-rate-limit` | Auth + rate limiting |
| GET/POST | `/api/internships`, `/api/internships/:id`, `/api/internships/:id/apply` | Internship listings & applications |
| GET/PATCH | `/api/candidates`, `/api/candidates/:id/status` | Candidate pipeline |
| GET/POST | `/api/state-distributions`, `/api/verification-batches`, `/api/verification-batches/:id/approve` | Admin analytics |
| POST | `/api/ai-coach` | Gemma 4-powered career chat (with fallback) |
| POST | `/api/parse-resume` | Gemma 4-powered resume parsing (with fallback) |
