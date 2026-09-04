Deployment plan: frontend → Vercel, backend → Render

Checklist - files NOT to commit (use project settings instead):

- `backend/.env` (contains `MONGO_URL`, `JWT_SECRET`)
- `frontend/.env` (contains `VITE_API_URL` if any secrets)
- any personal API keys or secrets

Steps - backend (Render):

1. Create a GitHub repo and push this project (exclude `.env` and secrets using `.gitignore`).
2. Sign in to Render and create a new Web Service.
   - Connect the GitHub repo and pick the `backend` folder as the root.
   - Build command: `npm install` or `npm ci`.
   - Start command: `npm run start` (Render will provide `PORT` via env).
3. In Render service settings, add Environment Variables:
   - `MONGO_URL` = your Atlas connection string (keep secret)
   - `JWT_SECRET` = your JWT secret
4. Deploy and check logs for successful MongoDB connection.

Steps - frontend (Vercel):

1. In Vercel, import the GitHub repo and choose the `frontend` folder.
2. Set build command: `npm install && npm run build` and output directory: `dist`.
3. Add Environment Variables in Vercel:
   - `VITE_API_URL` = the Render backend URL (e.g., `https://<your-backend>.onrender.com`)
4. Deploy and verify the app connects to the backend.

Notes:

- Use the SRV connection `mongodb+srv://...` in `MONGO_URL` and URL-encode special characters.
- Do NOT store `.env` files in Git. Use Render/Vercel environment variable settings instead.
- If you need CI/CD secrets, add them in the respective platform settings, not in repo.
