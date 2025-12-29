// src/utils/apiBase.js
export function getApiBase() {
  // Production ma environment variable use karo (Railway/Render backend URL)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  const { protocol, hostname } = window.location;

  // Local (dev) પર તમારું backend 4000 પર હોય તો:
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `${protocol}//${hostname}:4000`;
  }

  // Production (Netlify) → Backend URL (Railway/Render)
  // Note: Netlify par backend run nathi thatu, etle separate service par host kari javu joiye
  return process.env.REACT_APP_API_URL || `${protocol}//${hostname}/.netlify/functions`;
}