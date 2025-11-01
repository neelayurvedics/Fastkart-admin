#!/bin/bash

# Fix Laravel Storage for Fastkart Admin Images
# Run this script on your Laravel server

echo "=========================================="
echo "Fixing Laravel Storage Configuration"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get Laravel directory
read -p "Enter full path to Laravel project (e.g., /var/www/html/api): " LARAVEL_PATH

if [ ! -d "$LARAVEL_PATH" ]; then
    echo -e "${RED}Error: Directory $LARAVEL_PATH does not exist!${NC}"
    exit 1
fi

cd "$LARAVEL_PATH" || exit

echo -e "${YELLOW}Working directory: $(pwd)${NC}"
echo ""

# Check if artisan exists
if [ ! -f "artisan" ]; then
    echo -e "${RED}Error: artisan file not found. Are you in the Laravel directory?${NC}"
    exit 1
fi

echo -e "${GREEN}Step 1: Creating storage symlink...${NC}"
php artisan storage:link
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Storage symlink created${NC}"
else
    echo -e "${RED}✗ Failed to create storage symlink${NC}"
fi
echo ""

echo -e "${GREEN}Step 2: Setting storage permissions...${NC}"
chmod -R 755 storage
chmod -R 755 bootstrap/cache
echo -e "${GREEN}✓ Permissions set${NC}"
echo ""

echo -e "${GREEN}Step 3: Setting ownership (may require sudo)...${NC}"
read -p "Web server user (usually www-data, nginx, or apache): " WEBUSER
WEBUSER=${WEBUSER:-www-data}

if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}This step may require sudo. You might be prompted for password.${NC}"
    sudo chown -R "$WEBUSER":"$WEBUSER" storage
    sudo chown -R "$WEBUSER":"$WEBUSER" bootstrap/cache
else
    chown -R "$WEBUSER":"$WEBUSER" storage
    chown -R "$WEBUSER":"$WEBUSER" bootstrap/cache
fi
echo -e "${GREEN}✓ Ownership set${NC}"
echo ""

echo -e "${GREEN}Step 4: Clearing Laravel caches...${NC}"
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
echo -e "${GREEN}✓ Caches cleared${NC}"
echo ""

echo -e "${GREEN}Step 5: Verifying symlink...${NC}"
if [ -L "public/storage" ]; then
    TARGET=$(readlink public/storage)
    echo -e "${GREEN}✓ Symlink exists: public/storage -> $TARGET${NC}"
else
    echo -e "${RED}✗ Symlink not found!${NC}"
fi
echo ""

echo "=========================================="
echo -e "${GREEN}Configuration Complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Test image URL in browser:"
echo "   https://api.neelayurvedics.in/storage/test.jpg"
echo ""
echo "2. Or test with curl:"
echo "   curl -I https://api.neelayurvedics.in/storage/21/Neel-Ayurvedics-Logo.png"
echo ""
echo "3. Should return HTTP 200 (not 400)"
echo ""
echo "4. Refresh admin panel and images should load!"
echo ""
