# Deployment Guide

## Backend Deployments

### Render Backend
- URL: https://notesapp-r6on.onrender.com
- Status: ✅ Configured
- CORS: Enabled for all Vercel/Render frontends

### Vercel Backend  
- URL: https://notes-app-delta-indol-47.vercel.app
- Status: ✅ Configured
- CORS: Enabled for all Vercel/Render frontends

---

## Frontend Configuration

### For Render Backend (Recommended)
```bash
# Copy for production
cp frontend/.env.production.render frontend/.env.production
VITE_API_URL=https://notesapp-r6on.onrender.com
```

### For Vercel Backend
```bash
# Copy for production
cp frontend/.env.production.vercel frontend/.env.production
VITE_API_URL=https://notes-app-delta-indol-47.vercel.app
```

### For Local Development
```bash
# .env.development (already configured)
VITE_API_URL=http://localhost:8002
```

---

## CORS Configuration

Both backends are configured to accept requests from:
- ✅ http://localhost:5173 (local dev)
- ✅ http://localhost:3000 (local dev alt)
- ✅ https://notesapp-frontend-yicr.onrender.com (Render)
- ✅ https://notes-2bum9ounx-vinay-kumars-projects-b700c28a.vercel.app
- ✅ https://notes-q2ud9ytse-vinay-kumars-projects-b700c28a.vercel.app
- ✅ https://notes-app-delta-indol-47.vercel.app
- ✅ Any URL in FRONTEND_URL env variable

---

## How to Switch Deployments

1. **For Render Backend:**
   ```bash
   echo "VITE_API_URL=https://notesapp-r6on.onrender.com" > frontend/.env.production
   npm run build
   ```

2. **For Vercel Backend:**
   ```bash
   echo "VITE_API_URL=https://notes-app-delta-indol-47.vercel.app" > frontend/.env.production
   npm run build
   ```

3. **Redeploy to your frontend hosting**

---

## Testing

After deployment, test login/signup at your frontend URL. Both backends will work with all frontend deployments due to CORS configuration.
