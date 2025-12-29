# Ubuntu VPS - Frontend + Backend Full Setup Guide

## Overview
- **Frontend (React):** Ubuntu VPS પર Nginx થી serve
- **Backend (Node.js):** Ubuntu VPS પર PM2 થી run

---

## Step 1: VPS પર Connect કરો

```bash
ssh root@your-vps-ip
# ya
ssh username@your-vps-ip
```

---

## Step 2: System Update કરો

```bash
sudo apt update
sudo apt upgrade -y
```

---

## Step 3: Node.js Install કરો

```bash
# Node.js 20.x install karo
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version
npm --version
```

---

## Step 4: Nginx Install કરો

```bash
sudo apt install nginx -y

# Nginx start karo
sudo systemctl start nginx
sudo systemctl enable nginx

# Status check
sudo systemctl status nginx
```

---

## Step 5: Project Upload કરો

### Option A: Git થી (Recommended)

```bash
# Git install karo
sudo apt install git -y

# Project folder banavo
mkdir -p /var/www/my-app
cd /var/www/my-app

# Git repo clone karo (agar GitHub par che)
git clone https://github.com/your-username/your-repo.git .

# ya manually files upload karo via SCP
```

### Option B: SCP થી (Windows PowerShell)

```powershell
# Windows PowerShell ma
scp -r "D:\prit\react js\my-app-testing\*" root@your-vps-ip:/var/www/my-app/
```

---

## Step 6: Backend Setup

### 6.1: Dependencies Install કરો

```bash
cd /var/www/my-app
npm install
```

### 6.2: PM2 Install કરો (Process Manager)

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

### 6.3: Backend Test કરો

```bash
# Local test
curl http://localhost:4000/api/phone

# External test (browser ma)
http://your-vps-ip:4000/api/phone
```

---

## Step 7: Frontend Build કરો

### Option A: VPS પર Build કરો

```bash
cd /var/www/my-app

# Environment variable set karo (agar needed)
export REACT_APP_API_URL=http://your-vps-ip:4000
# ya
export REACT_APP_API_URL=http://your-domain.com

# Build karo
npm run build
```

### Option B: Local Windows પર Build કરીને Upload કરો

```powershell
# Windows PowerShell ma
cd "D:\prit\react js\my-app-testing"

# Environment variable set karo
$env:REACT_APP_API_URL="http://your-vps-ip:4000"
# ya
$env:REACT_APP_API_URL="http://your-domain.com"

# Build karo
npm run build

# Build folder upload karo VPS par
scp -r "build\*" root@your-vps-ip:/var/www/my-app/build/
```

---

## Step 8: Nginx Configuration

### 8.1: Configuration File બનાવો

```bash
sudo nano /etc/nginx/sites-available/my-app
```

### 8.2: Configuration Content

```nginx
server {
    listen 80;
    server_name your-domain.com;  # ya your-vps-ip

    # Frontend (React Build) - Root location
    root /var/www/my-app/build;
    index index.html;

    # Frontend routes - React Router support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # EXE file serve karo
    location /exe {
        proxy_pass http://localhost:4000;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 8.3: Enable Site

```bash
# Symlink banavo
sudo ln -s /etc/nginx/sites-available/my-app /etc/nginx/sites-enabled/

# Default site disable karo (agar needed)
sudo rm /etc/nginx/sites-enabled/default

# Configuration test karo
sudo nginx -t

# Nginx restart karo
sudo systemctl restart nginx
```

---

## Step 9: Firewall Setup

```bash
# UFW firewall enable karo
sudo ufw allow 22    # SSH
sudo ufw allow 80     # HTTP
sudo ufw allow 443   # HTTPS (agar SSL use kariye to)
sudo ufw enable

# Status check
sudo ufw status
```

---

## Step 10: SSL Certificate (HTTPS) - Optional પણ Recommended

### Let's Encrypt SSL:

```bash
# Certbot install karo
sudo apt install certbot python3-certbot-nginx -y

# SSL certificate generate karo
sudo certbot --nginx -d your-domain.com

# Auto-renewal test karo
sudo certbot renew --dry-run
```

**Note:** SSL માટે domain name જરૂરી છે. IP address પર SSL નથી મળતું.

---

## Step 11: EXE File Setup

### Ubuntu VPS પર EXE file upload કરો:

```bash
# exe folder banavo (agar nathi to)
mkdir -p /var/www/my-app/exe

# Windows thi exe file upload karo
# SCP use kariye:
# scp "D:\prit\react js\my-app-testing\exe\exeProject.exe" root@your-vps-ip:/var/www/my-app/exe/
```

**Note:** Linux પર .exe file directly run થઈ શકતી નથી. Options:

1. **Wine Install કરો (જો exe run કરવું હોય):**
   ```bash
   sudo apt install wine -y
   ```

2. **અથવા:** EXE file download કરવા માટે serve કરો (જે હવે code માં છે)

---

## Step 12: Testing

### Frontend Test:

```
http://your-vps-ip
# ya
http://your-domain.com
```

### Backend API Test:

```bash
# VPS par
curl http://localhost:4000/api/phone

# Browser ma
http://your-vps-ip/api/phone
# ya
http://your-domain.com/api/phone
```

### Full Flow Test:

1. Browser માં `http://your-vps-ip` open કરો
2. Privacy Policy click કરો
3. PDF open થવું જોઈએ
4. EXE file download/execute થવું જોઈએ

---

## Step 13: Environment Variables (Optional)

### Backend (.env file):

```bash
cd /var/www/my-app
nano .env
```

```env
PORT=4000
HOST=0.0.0.0
NODE_ENV=production
```

### Frontend (Build કરતી વખતે):

```bash
export REACT_APP_API_URL=http://your-domain.com
# ya
export REACT_APP_API_URL=http://your-vps-ip:4000
npm run build
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

### Frontend નથી દેખાતું:

```bash
# Build folder check karo
ls -la /var/www/my-app/build/

# Nginx logs check karo
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Nginx configuration test
sudo nginx -t
```

### 404 Error (React Router):

`.htaccess` ની જગ્યાએ Nginx configuration માં `try_files` directive use કર્યું છે, જે React Router માટે જરૂરી છે.

### CORS Error:

`server.js` માં `cors()` already enable છે, પણ જો issue આવે:

```javascript
app.use(cors({
  origin: ['http://your-domain.com', 'https://your-domain.com', 'http://your-vps-ip'],
  credentials: true
}));
```

### Permission Issues:

```bash
# File permissions set karo
sudo chown -R www-data:www-data /var/www/my-app
sudo chmod -R 755 /var/www/my-app
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

# Backend logs
pm2 logs my-app-backend

# PM2 status
pm2 status

# Nginx restart
sudo systemctl restart nginx

# Nginx status
sudo systemctl status nginx

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

---

## Directory Structure

```
/var/www/my-app/
├── build/              # React build files (Nginx serve kare)
│   ├── index.html
│   ├── static/
│   └── ...
├── exe/                # EXE files
│   └── exeProject.exe
├── src/                # React source (optional, build ma use nathi)
├── server.js           # Backend server
├── package.json
└── ...
```

---

## Important Notes

✅ **Security:**
- Firewall enable કરો
- Strong passwords use કરો
- SSH keys use કરો (password ની જગ્યાએ)
- SSL certificate use કરો (HTTPS)

✅ **Performance:**
- PM2 use કરો (auto-restart)
- Nginx static file serving (fast)
- Static files caching enable કર્યું છે

✅ **Maintenance:**
- Regular updates: `sudo apt update && sudo apt upgrade`
- PM2 monitoring: `pm2 monit`
- Logs monitoring: `pm2 logs` અને `sudo tail -f /var/log/nginx/error.log`

---

## Support

જો કોઈ issue આવે, તો:

1. **PM2 logs:** `pm2 logs my-app-backend`
2. **Nginx logs:** `sudo tail -f /var/log/nginx/error.log`
3. **System logs:** `sudo journalctl -u nginx`
4. **Port check:** `sudo netstat -tulpn | grep 4000`

---

## Next Steps

1. ✅ Domain name point કરો VPS IP તરફ
2. ✅ SSL certificate install કરો
3. ✅ Regular backups setup કરો
4. ✅ Monitoring setup કરો (optional)

