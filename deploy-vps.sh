#!/bin/bash

# Ubuntu VPS Deployment Script
# Use: chmod +x deploy-vps.sh && ./deploy-vps.sh

echo "🚀 Starting VPS Deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root or with sudo${NC}"
    exit 1
fi

# Update system
echo -e "${YELLOW}📦 Updating system...${NC}"
apt update && apt upgrade -y

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
else
    echo -e "${GREEN}✅ Node.js already installed${NC}"
fi

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Nginx...${NC}"
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
else
    echo -e "${GREEN}✅ Nginx already installed${NC}"
fi

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📦 Installing PM2...${NC}"
    npm install -g pm2
else
    echo -e "${GREEN}✅ PM2 already installed${NC}"
fi

# Install Git if not installed
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Git...${NC}"
    apt install -y git
else
    echo -e "${GREEN}✅ Git already installed${NC}"
fi

# Create project directory
PROJECT_DIR="/var/www/my-app"
echo -e "${YELLOW}📁 Creating project directory...${NC}"
mkdir -p $PROJECT_DIR

# Navigate to project directory
cd $PROJECT_DIR

# Install dependencies
if [ -f "package.json" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
else
    echo -e "${RED}⚠️  package.json not found. Please upload project files first.${NC}"
    exit 1
fi

# Build frontend (if React app)
if [ -d "src" ]; then
    echo -e "${YELLOW}🏗️  Building React app...${NC}"
    export REACT_APP_API_URL=""
    npm run build
    echo -e "${GREEN}✅ Frontend build completed${NC}"
fi

# Setup PM2
echo -e "${YELLOW}🔄 Setting up PM2...${NC}"
pm2 start server.js --name "my-app-backend" || pm2 restart my-app-backend
pm2 save
pm2 startup

# Setup firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

# Create Nginx configuration
echo -e "${YELLOW}⚙️  Creating Nginx configuration...${NC}"
cat > /etc/nginx/sites-available/my-app << 'EOF'
server {
    listen 80;
    server_name _;

    root /var/www/my-app/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

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

    location /exe {
        proxy_pass http://localhost:4000;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/my-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t && systemctl restart nginx

# Set permissions
chown -R www-data:www-data $PROJECT_DIR
chmod -R 755 $PROJECT_DIR

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo -e "${GREEN}📊 PM2 Status:${NC}"
pm2 status

echo -e "${GREEN}🌐 Your app should be available at: http://$(hostname -I | awk '{print $1}')${NC}"
echo -e "${YELLOW}⚠️  Don't forget to:${NC}"
echo -e "   1. Update server_name in /etc/nginx/sites-available/my-app with your domain"
echo -e "   2. Set REACT_APP_API_URL environment variable before building"
echo -e "   3. Upload exe files to /var/www/my-app/exe/ if needed"
echo -e "   4. Setup SSL certificate with: sudo certbot --nginx -d your-domain.com"

