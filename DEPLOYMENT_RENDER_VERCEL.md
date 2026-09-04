# Deployment Notes — Render (backend) + Vercel (frontend)

This file contains concise steps to deploy the backend to Render and the frontend to Vercel.

Backend (Render)

- Create a new Web Service on Render and connect to this GitHub repo.
- Build command: `npm install`
- Start command: `node index.js` (or leave blank; Render runs `npm start` by default)
- Environment variables (set in Render dashboard): `MONGO_URL`, `JWT_SECRET`, `FRONTEND_URL`, `PORT` (optional)
- Add the `Procfile` present at `backend/Procfile` to ensure Render runs `node index.js`.

Notes:

- Ensure `backend/.env` is not committed (we added `.env` to `.gitignore`). Use Render's env settings.
- Allow your deployed frontend URL in `FRONTEND_URL` so CORS succeeds.

Frontend (Vercel)

- Create a new project in Vercel and import this GitHub repo.
- Set the root to the `frontend` folder when creating the project.
- Vercel will auto-detect `npm run build` (Vite) build step and use `npm run preview` for preview.
- Set environment variable `VITE_API_URL` to your backend URL (e.g., `https://your-backend.onrender.com`).

Notes:

- The frontend uses `import.meta.env` for configuration at build-time; Vite exposes variables prefixed with `VITE_`.
- In code, reference `import.meta.env.VITE_API_URL` when calling the backend.

Common / CORS

- Backend `index.js` already supports `FRONTEND_URL` via `process.env.FRONTEND_URL` — set this to the Vercel URL.
- If you need to allow multiple frontend deployments, add them to the `allowedOrigins` array or set `FRONTEND_URL` to a comma-separated list and parse it.

Quick local commands

```bash
# Install deps
cd backend && npm install
cd ../frontend && npm install

# Run locally
cd backend && npm run dev
cd ../frontend && npm run dev
```
