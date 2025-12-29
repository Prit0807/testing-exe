// src/utils/apiBase.js
export function getApiBase() {
  // Production ma environment variable use karo (Ubuntu VPS backend URL)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  const { protocol, hostname } = window.location;

  // Local (dev) પર તમારું backend 4000 પર હોય તો:
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `${protocol}//${hostname}:4000`;
  }

  // Production (Hostinger) → Backend URL (Ubuntu VPS)
  // Note: Hostinger par backend run nathi thatu, etle separate Ubuntu VPS par host kari javu joiye
  // Default: same domain par port 4000 (agar Nginx reverse proxy use kariye to)
  // ya explicitly VPS IP/domain set karo environment variable ma
  
  // Example: agar Nginx reverse proxy use kariye to:
  // return `${protocol}//${hostname}`;
  
  // ya VPS IP directly:
  // return `http://your-vps-ip:4000`;
  
  // Fallback: environment variable ma set karo REACT_APP_API_URL
  return process.env.REACT_APP_API_URL || `${protocol}//${hostname}:4000`;
}