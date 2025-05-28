#!/bin/bash

# Property Management System - Cron Job Setup Script
# This script sets up all necessary cron jobs for the system

echo "Setting up cron jobs for Property Management System..."

# Get the current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Create cron jobs file
CRON_FILE="/tmp/property_management_cron"

cat > $CRON_FILE << EOF
# Property Management System Cron Jobs

# Send rent reminders daily at 9:00 AM
0 9 * * * /usr/bin/php $PROJECT_DIR/scripts/process_reminders.php >> $PROJECT_DIR/logs/cron.log 2>&1

# Process late fees daily at 6:00 AM
0 6 * * * /usr/bin/php $PROJECT_DIR/scripts/process_late_fees.php >> $PROJECT_DIR/logs/cron.log 2>&1

# Generate monthly reports on the 1st of each month at 8:00 AM
0 8 1 * * /usr/bin/php $PROJECT_DIR/scripts/generate_monthly_reports.php >> $PROJECT_DIR/logs/cron.log 2>&1

# Backup database daily at 2:00 AM
0 2 * * * /usr/bin/php $PROJECT_DIR/scripts/backup_database.php >> $PROJECT_DIR/logs/backup.log 2>&1

# Clean up old logs weekly on Sunday at 3:00 AM
0 3 * * 0 /usr/bin/php $PROJECT_DIR/scripts/cleanup_logs.php >> $PROJECT_DIR/logs/cleanup.log 2>&1

# Process payment retries daily at 10:00 AM
0 10 * * * /usr/bin/php $PROJECT_DIR/scripts/process_payment_retries.php >> $PROJECT_DIR/logs/cron.log 2>&1

# Send maintenance reminders every 2 hours during business hours (8 AM - 6 PM)
0 8-18/2 * * 1-5 /usr/bin/php $PROJECT_DIR/scripts/process_maintenance_reminders.php >> $PROJECT_DIR/logs/cron.log 2>&1

# Update SMS delivery status every 15 minutes
*/15 * * * * /usr/bin/php $PROJECT_DIR/scripts/update_sms_status.php >> $PROJECT_DIR/logs/sms.log 2>&1

# Generate daily dashboard statistics at 7:00 AM
0 7 * * * /usr/bin/php $PROJECT_DIR/scripts/update_dashboard_stats.php >> $PROJECT_DIR/logs/cron.log 2>&1

EOF

# Install cron jobs
crontab $CRON_FILE

# Remove temporary file
rm $CRON_FILE

# Create log directories
mkdir -p $PROJECT_DIR/logs
chmod 755 $PROJECT_DIR/logs

# Create log files
touch $PROJECT_DIR/logs/cron.log
touch $PROJECT_DIR/logs/backup.log
touch $PROJECT_DIR/logs/cleanup.log
touch $PROJECT_DIR/logs/sms.log

# Set permissions
chmod 644 $PROJECT_DIR/logs/*.log

echo "Cron jobs have been installed successfully!"
echo "Log files created in: $PROJECT_DIR/logs/"
echo ""
echo "Installed cron jobs:"
crontab -l | grep -v "^#" | grep -v "^$"
