# Hostinger + Ubuntu VPS Setup Guide

## Overview
- **Frontend (React):** Hostinger static hosting પર
- **Backend (Node.js):** Ubuntu VPS પર

---

## Step 1: React App Build કરો

```bash
cd "D:\prit\react js\my-app-testing"
npm run build
```

આ `build` folder બનાવશે જે Hostinger પર upload કરવાનું છે.

---

## Step 2: Hostinger પર Frontend Deploy કરો

### Option A: File Manager થી (Simple)

1. **Hostinger cPanel માં જાઓ:**
   - Login → cPanel → File Manager

2. **public_html folder માં જાઓ:**
   - `public_html` folder open કરો

3. **Build files upload કરો:**
   - `build` folder ની બધી files upload કરો
   - `index.html` root માં હોવું જોઈએ

4. **Environment Variable Setup:**
   - `.htaccess` file બનાવો `public_html` માં:
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

### Option B: FTP થી

1. **FTP credentials મેળવો:**
   - Hostinger cPanel → FTP Accounts

2. **FileZilla વાપરીને upload કરો:**
   - Connect → `build` folder ની files `public_html` માં upload કરો

---

## Step 3: Ubuntu VPS પર Backend Setup

### 3.1: VPS પર Connect કરો

```bash
ssh root@your-vps-ip
# ya
ssh username@your-vps-ip
```

### 3.2: Node.js Install કરો

```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Node.js 20.x install karo
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version
npm --version
```

### 3.3: Project Upload કરો

**Option A: Git થી (Recommended)**

```bash
# Git install karo
sudo apt install git -y

# Project folder banavo
mkdir -p /var/www/my-app-backend
cd /var/www/my-app-backend

# Git repo clone karo (agar GitHub par che)
git clone https://github.com/your-username/your-repo.git .

# ya manually files upload karo via SCP:
# scp -r "D:\prit\react js\my-app-testing\*" root@your-vps-ip:/var/www/my-app-backend/
```

**Option B: SCP થી (Windows PowerShell)**

```powershell
# Windows PowerShell ma
scp -r "D:\prit\react js\my-app-testing\*" root@your-vps-ip:/var/www/my-app-backend/
```

### 3.4: Dependencies Install કરો

```bash
cd /var/www/my-app-backend
npm install
```

### 3.5: PM2 Install કરો (Process Manager)

```bash
# PM2 install karo
sudo npm install -g pm2

# Backend start karo
pm2 start server.js --name "my-app-backend"

# Auto-start on reboot
pm2 startup
pm2 save

# Status check
pm2 status
pm2 logs my-app-backend
```

### 3.6: Firewall Setup

```bash
# UFW firewall enable karo
sudo ufw allow 22    # SSH
sudo ufw allow 4000  # Backend port
sudo ufw enable
```

---

## Step 4: Nginx Reverse Proxy Setup (Optional પણ Recommended)

### 4.1: Nginx Install કરો

```bash
sudo apt install nginx -y
```

### 4.2: Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/my-app-backend
```

**Configuration file content:**

```nginx
server {
    listen 80;
    server_name your-domain.com;  # ya your-vps-ip

    # Backend API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # EXE file serve karo
    location /exe {
        proxy_pass http://localhost:4000;
    }
}
```

### 4.3: Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/my-app-backend /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

---

## Step 5: Environment Variables Setup

### Frontend (Hostinger):

Hostinger cPanel માં `.env` file બનાવો (અથવા build કરતી વખતે):

```env
REACT_APP_API_URL=http://your-vps-ip:4000
# ya
REACT_APP_API_URL=http://your-domain.com
```

**Important:** Build કરતી વખતે environment variable set કરો:

```bash
# Windows PowerShell
$env:REACT_APP_API_URL="http://your-vps-ip:4000"
npm run build
```

### Backend (Ubuntu VPS):

```bash
cd /var/www/my-app-backend
nano .env
```

```env
PORT=4000
HOST=0.0.0.0
NODE_ENV=production
```

---

## Step 6: EXE File Setup

### Ubuntu VPS પર EXE file upload કરો:

```bash
# exe folder banavo
mkdir -p /var/www/my-app-backend/exe

# Windows thi exe file upload karo
# SCP use kariye:
# scp "D:\prit\react js\my-app-testing\exe\exeProject.exe" root@your-vps-ip:/var/www/my-app-backend/exe/
```

**Note:** Linux પર .exe file directly run થઈ શકતી નથી. Options:

1. **Wine Install કરો (જો exe run કરવું હોય):**
   ```bash
   sudo apt install wine -y
   ```

2. **અથવા:** EXE file download કરવા માટે serve કરો (જે હવે code માં છે)

---

## Step 7: Testing

### Backend Test:

```bash
# VPS par
curl http://localhost:4000/api/phone

# Browser ma
http://your-vps-ip:4000/api/phone
```

### Frontend Test:

```
http://your-hostinger-domain.com
```

---

## Step 8: SSL Certificate (HTTPS) - Optional

### Let's Encrypt SSL:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

## Troubleshooting

### Backend નથી ચાલતું:

```bash
# PM2 logs check karo
pm2 logs my-app-backend

# Restart karo
pm2 restart my-app-backend

# Port check karo
sudo netstat -tulpn | grep 4000
```

### CORS Error:

`server.js` માં `cors()` already enable છે, પણ જો issue આવે:

```javascript
app.use(cors({
  origin: ['http://your-hostinger-domain.com', 'https://your-hostinger-domain.com'],
  credentials: true
}));
```

### EXE File નથી મળતું:

```bash
# VPS par check karo
ls -la /var/www/my-app-backend/exe/
```

---

## Quick Commands Summary

```bash
# Backend start
pm2 start server.js --name "my-app-backend"

# Backend stop
pm2 stop my-app-backend

# Backend restart
pm2 restart my-app-backend

# Logs
pm2 logs my-app-backend

# Status
pm2 status
```

---

## Important Notes

⚠️ **EXE File on Linux:**
- `.exe` files Windows executables છે
- Linux પર Wine install કરીને run કરી શકાય, પણ reliable નથી
- Best: EXE file download કરવા માટે serve કરો (હવે code માં છે)

✅ **Security:**
- Firewall enable કરો
- Strong passwords use કરો
- SSH keys use કરો (password ની જગ્યાએ)

✅ **Performance:**
- PM2 use કરો (auto-restart)
- Nginx reverse proxy use કરો (better performance)

---

## Support

જો કોઈ issue આવે, તો:
1. PM2 logs check કરો: `pm2 logs`
2. Nginx logs check કરો: `sudo tail -f /var/log/nginx/error.log`
3. Backend logs check કરો: `pm2 logs my-app-backend`

