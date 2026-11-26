# PM Internship Scheme - Full Stack App

A React (Vite) frontend with an Express API backend, deployable to Vercel.
The AI Coach and resume parser can use Gemini or an OpenAI-compatible provider.

## How the AI works

- `/api/ai-coach` tries Gemini first, then the configured NVIDIA-compatible
  endpoint, then returns a rule-based reply.
- `/api/parse-resume` tries the configured NVIDIA-compatible endpoint first,
  then Gemini, then uses heuristic parsing.

Set provider keys in the environment. A successful build or health check does
not guarantee that a live model request will succeed; verify each provider
with a safe test prompt and a non-personal sample resume.

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
2. Copy `.env.example` to a gitignored `.env` file.
3. Set `GEMINI_API_KEY` and/or `NVIDIA_API_KEY`. For email verification,
   configure either `SMTP_USER` + `SMTP_PASS` or `RESEND_API_KEY`.
4. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET` to private,
   unique values before testing the admin and session flows.
5. `npm run dev`
6. Open http://localhost:3000

Without provider keys, AI routes use fallback responses. Email OTP will not
work until an email provider is configured.

## Deploy to Vercel

1. Push this project to a GitHub repo.
2. In Vercel, "Add New Project" → import the repo. Vercel auto-detects the
   config from `vercel.json` (Vite build → `dist/`, `api/index.ts` as a
   serverless function).
3. In the Vercel project's **Settings → Environment Variables**, add:
   - `GEMINI_API_KEY` and/or `NVIDIA_API_KEY` - AI provider keys
   - `SMTP_USER` + `SMTP_PASS` or `RESEND_API_KEY` - email OTP delivery
   - `JWT_SECRET` - stable session signing secret
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD` - required to enable administrator
     login; configure private, unique values. There is no default administrator
     credential. Use a unique password of at least 12 characters.
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
| POST | `/api/otp/send`, `/api/otp/verify` | Email verification |
| POST / GET | `/api/login`, `/api/login/rate-limit-status` | Auth + rate limiting |
| POST | `/api/login/reset-rate-limit` | Local development only |
| GET/POST | `/api/internships`, `/api/internships/:id`, `/api/internships/:id/apply` | Internship listings & applications |
| GET/PATCH | `/api/candidates`, `/api/candidates/:id/status` | Candidate pipeline |
| GET/POST | `/api/state-distributions`, `/api/verification-batches`, `/api/verification-batches/:id/approve` | Admin analytics |
| POST | `/api/ai-coach` | Gemma 4-powered career chat (with fallback) |
| POST | `/api/parse-resume` | Gemma 4-powered resume parsing (with fallback) |
