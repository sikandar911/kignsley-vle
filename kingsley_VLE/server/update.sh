#!/bin/bash

# Kingsley VLE - Update/Redeployment Script
# Current Update: File Upload Limit Configuration (50 MB for files, 10 MB for student submissions)
# No database schema changes - migration step is precautionary only

echo "========================================="
echo "Starting Application Update..."
echo "========================================="

# Check if prod.env exists
if [ ! -f "prod.env" ]; then
    echo "ERROR: prod.env file not found."
    exit 1
fi

echo "[1/3] Checking host Nginx upload limit..."
# The host nginx reverse proxy must allow 50M+ body size or uploads will return 413.
NGINX_CONF="/etc/nginx/sites-available/kingsley-vle"
if [ -f "$NGINX_CONF" ]; then
    if grep -q "client_max_body_size" "$NGINX_CONF"; then
        echo "  -> client_max_body_size already set in $NGINX_CONF"
    else
        echo "  -> Adding client_max_body_size 50M to $NGINX_CONF"
        sudo sed -i '/location \//i\    client_max_body_size 50M;' "$NGINX_CONF"
        sudo nginx -t && sudo systemctl reload nginx
        echo "  -> Nginx reloaded."
    fi
else
    echo "  -> WARNING: $NGINX_CONF not found."
    echo "     Manually add 'client_max_body_size 50M;' inside your nginx server block"
    echo "     and run: sudo nginx -t && sudo systemctl reload nginx"
fi

echo "[2/3] Rebuilding and restarting Docker containers..."
# Build and run detached (picks up any code changes)
docker compose --env-file prod.env up -d --build

echo "Waiting for container and database to initialize..."
sleep 8

echo "[3/3] Running Database Migrations (if any)..."
# Apply any new migrations if the database schema changed
# Note: Current update has NO schema changes - this is precautionary
docker compose exec kingsley-backend npx prisma migrate deploy

echo "========================================="
echo "Update Complete! 🚀"
echo "Your backend has been successfully redeployed."
echo "========================================="
