#!/bin/bash
# Deploy CraftWeb ke VPS Nevacloud
# Jalankan dari folder project: bash deploy.sh

TARGET_DIR="/var/www/craftweb"
NGINX_CONF="/etc/nginx/sites-available/craftweb"

echo "=== Deploying CraftWeb ==="

# Buat direktori
sudo mkdir -p $TARGET_DIR

# Copy semua file game
sudo cp index.html textures.js world.js renderer.js player.js inventory.js $TARGET_DIR/

# Set permissions
sudo chown -R www-data:www-data $TARGET_DIR
sudo chmod -R 755 $TARGET_DIR

# Setup nginx config
sudo cp nginx.conf $NGINX_CONF
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/craftweb

# Test & reload nginx
sudo nginx -t && sudo systemctl reload nginx

echo "=== Done! Game available at your domain ==="
echo "Files deployed to: $TARGET_DIR"
