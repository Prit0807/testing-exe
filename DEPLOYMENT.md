# Deployment Guide

## Problem
Netlify static hosting chhe, etle Node.js backend (`server.js`) direct run nathi thatu. PowerShell command pan Windows-specific chhe, Netlify Linux servers par work nathi kare.

## Solution: Separate Backend Hosting

### Step 1: Backend Deploy karo (Railway / Render / Heroku)

#### Option A: Railway (Recommended - Free tier available)

1. **Railway account banavo:** https://railway.app
2. **New Project create karo:**
   - "New Project" → "Deploy from GitHub repo"
   - Tamaru repo select karo
3. **Backend setup:**
   - Root directory: Project root
   - Build command: (empty - no build needed)
   - Start command: `node server.js`
   - Port: Railway automatically assign kare (use `process.env.PORT`)
4. **Environment Variables:**
   - Railway automatically PORT provide kare
5. **Deploy:**
   - Railway automatically deploy kare
   - Backend URL mile: `https://your-app-name.railway.app`

#### Option B: Render (Free tier available)

1. **Render account banavo:** https://render.com
2. **New Web Service create karo:**
   - GitHub repo connect karo
   - Name: `my-app-backend`
   - Environment: Node
   - Build Command: (empty)
   - Start Command: `node server.js`
3. **Deploy:**
   - Render automatically deploy kare
   - Backend URL mile: `https://my-app-backend.onrender.com`

### Step 2: server.js ma PORT update karo

```javascript
// server.js ma change karo:
const PORT = process.env.PORT || 4000; // Railway/Render automatically PORT provide kare
```

### Step 3: React App Netlify par deploy karo

1. **Netlify ma deploy:**
   - GitHub repo connect karo
   - Build command: `npm run build`
   - Publish directory: `build`

2. **Environment Variables add karo Netlify ma:**
   - Netlify Dashboard → Site settings → Environment variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.railway.app` (or Render URL)

### Step 4: apiBase.js update karo

```javascript
// src/utils/apiBase.js
export function getApiBase() {
  // Production ma environment variable use karo
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Local development
  const { protocol, hostname } = window.location;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `${protocol}//${hostname}:4000`;
  }
  
  // Fallback
  return `${protocol}//${hostname}/.netlify/functions`;
}
```

### Step 5: Important Notes

⚠️ **PowerShell Command:**
- PowerShell command **fakt Windows machines par work kare**
- Railway/Render Linux servers par run thay chhe
- **Solution:** Backend ne Windows VPS par host karo (DigitalOcean, AWS EC2 Windows, etc.) jo PowerShell support kare

**Alternative:** Jo PowerShell command jaroori nathi, to backend Railway/Render par host kari shakay. Pan PowerShell command Windows machine par j run thashe.

### Quick Deploy Commands

**Railway:**
```bash
# Railway CLI install karo
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

**Render:**
- GitHub repo connect karo ane automatic deploy thashe

## Summary

- ✅ **Frontend (React):** Netlify par deploy
- ✅ **Backend (Node.js):** Railway/Render par deploy (pan PowerShell Windows par j work kare)
- ⚠️ **PowerShell:** Windows VPS par j run thashe (DigitalOcean, AWS EC2 Windows)

