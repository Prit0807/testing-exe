// src/utils/apiBase.js
export function getApiBase() {
  // Production ma environment variable use karo
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  const { protocol, hostname, port } = window.location;

  // Local (dev) પર તમારું backend 4000 પર હોય તો:
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `${protocol}//${hostname}:4000`;
  }

  // Production (VPS) - Nginx reverse proxy use kariye to same domain par API calls
  // Nginx /api location backend ne proxy kare, etle same origin use karo
  // Example: http://your-domain.com/api → Nginx → http://localhost:4000/api
  return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
}