#!/bin/bash

# Property Management System Installation Script
# This script sets up the complete production environment

echo "🏢 Property Management System - Production Installation"
echo "======================================================"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run this script as root (use sudo)"
    exit 1
fi

# Get current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_DIR="$SCRIPT_DIR"

echo "📁 Project directory: $PROJECT_DIR"

# Update system packages
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install required packages
echo "🔧 Installing required packages..."
apt install -y apache2 mysql-server php8.2 php8.2-mysql php8.2-curl php8.2-json php8.2-mbstring php8.2-xml php8.2-zip composer curl wget unzip

# Enable Apache modules
echo "🌐 Configuring Apache..."
a2enmod rewrite
a2enmod ssl
a2enmod headers

# Install Composer dependencies
echo "📚 Installing PHP dependencies..."
cd $PROJECT_DIR
composer install --no-dev --optimize-autoloader

# Set up database
echo "🗄️ Setting up database..."
mysql -u root -p << EOF
CREATE DATABASE IF NOT EXISTS property_management;
CREATE USER IF NOT EXISTS 'property_user'@'localhost' IDENTIFIED BY 'secure_password_123!';
GRANT ALL PRIVILEGES ON property_management.* TO 'property_user'@'localhost';
FLUSH PRIVILEGES;
EOF

# Import database schema
echo "📊 Importing database schema..."
mysql -u property_user -psecure_password_123! property_management < database/complete_schema.sql
mysql -u property_user -psecure_password_123! property_management < database/reminder_queue_table.sql
mysql -u property_user -psecure_password_123! property_management < database/backup_logs_table.sql

# Set up file permissions
echo "🔐 Setting up file permissions..."
chown -R www-data:www-data $PROJECT_DIR
chmod -R 755 $PROJECT_DIR
chmod -R 777 $PROJECT_DIR/uploads
chmod -R 777 $PROJECT_DIR/logs
chmod -R 777 $PROJECT_DIR/backups

# Create necessary directories
mkdir -p $PROJECT_DIR/uploads
mkdir -p $PROJECT_DIR/logs
mkdir -p $PROJECT_DIR/backups

# Set up Apache virtual host
echo "🌐 Setting up Apache virtual host..."
cat > /etc/apache2/sites-available/property-management.conf << EOF
<VirtualHost *:80>
    ServerName property-management.local
    DocumentRoot $PROJECT_DIR
    
    <Directory $PROJECT_DIR>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog \${APACHE_LOG_DIR}/property-management-error.log
    CustomLog \${APACHE_LOG_DIR}/property-management-access.log combined
</VirtualHost>
EOF

# Enable the site
a2ensite property-management.conf
a2dissite 000-default.conf

# Create .htaccess file
cat > $PROJECT_DIR/.htaccess << EOF
RewriteEngine On

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

# Hide sensitive files
<Files ~ "^\.">
    Order allow,deny
    Deny from all
</Files>

<Files ~ "\.sql$">
    Order allow,deny
    Deny from all
</Files>

<Files ~ "\.log$">
    Order allow,deny
    Deny from all
</Files>

# PHP security
php_flag display_errors Off
php_flag log_errors On
php_value error_log $PROJECT_DIR/logs/php_errors.log

# Redirect to HTTPS (uncomment when SSL is configured)
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Pretty URLs
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
EOF

# Set up cron jobs
echo "⏰ Setting up cron jobs..."
bash $PROJECT_DIR/scripts/setup_cron.sh

# Configure PHP
echo "🐘 Configuring PHP..."
cat >> /etc/php/8.2/apache2/php.ini << EOF

; Property Management System Configuration
upload_max_filesize = 10M
post_max_size = 10M
max_execution_time = 300
memory_limit = 256M
date.timezone = America/Los_Angeles
session.cookie_httponly = 1
session.cookie_secure = 1
session.use_strict_mode = 1
EOF

# Restart services
echo "🔄 Restarting services..."
systemctl restart apache2
systemctl restart mysql

# Set up SSL (Let's Encrypt)
echo "🔒 Setting up SSL certificate..."
apt install -y certbot python3-certbot-apache

# Create initial admin user
echo "👤 Creating initial admin user..."
php $PROJECT_DIR/scripts/create_admin_user.php

# Set up log rotation
echo "📝 Setting up log rotation..."
cat > /etc/logrotate.d/property-management << EOF
$PROJECT_DIR/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
EOF

# Create systemd service for background tasks
echo "⚙️ Setting up background service..."
cat > /etc/systemd/system/property-management.service << EOF
[Unit]
Description=Property Management Background Service
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/bin/php $PROJECT_DIR/scripts/background_service.php
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl enable property-management.service
systemctl start property-management.service

# Final security hardening
echo "🛡️ Applying security hardening..."

# Remove sensitive files from web root
rm -f $PROJECT_DIR/install.sh
rm -f $PROJECT_DIR/README.md

# Set up firewall
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Secure MySQL
mysql_secure_installation

echo ""
echo "✅ Installation completed successfully!"
echo ""
echo "🌐 Your Property Management System is now available at:"
echo "   http://property-management.local"
echo ""
echo "🔑 Admin Login Credentials:"
echo "   Email: admin@example.com"
echo "   Password: password"
echo ""
echo "📋 Next Steps:"
echo "   1. Update database credentials in config/database.php"
echo "   2. Configure Stripe API keys in config/stripe.php"
echo "   3. Configure Twilio credentials in config/sms.php"
echo "   4. Set up SSL certificate: certbot --apache -d your-domain.com"
echo "   5. Update SITE_URL in config/config.php"
echo ""
echo "📚 Documentation:"
echo "   - Admin Panel: /pages/admin/login.php"
echo "   - Tenant Portal: /pages/tenant/login.php"
echo "   - API Documentation: /docs/api.md"
echo ""
echo "🔧 System Services:"
echo "   - Apache: systemctl status apache2"
echo "   - MySQL: systemctl status mysql"
echo "   - Background Service: systemctl status property-management"
echo ""
echo "📊 Monitoring:"
echo "   - Error Logs: tail -f $PROJECT_DIR/logs/php_errors.log"
echo "   - Cron Logs: tail -f $PROJECT_DIR/logs/cron.log"
echo "   - SMS Logs: tail -f $PROJECT_DIR/logs/sms.log"
echo ""
echo "🚀 Your property management system is production-ready!"
