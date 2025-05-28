<?php
// Site configuration
define('SITE_NAME', 'PropertyPro');
define('SITE_URL', 'http://localhost/property-management');
define('SITE_EMAIL', 'noreply@propertypro.com');

// Security settings
define('SESSION_LIFETIME', 3600); // 1 hour
define('PASSWORD_MIN_LENGTH', 8);
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOGIN_LOCKOUT_TIME', 900); // 15 minutes

// File upload settings
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB
define('UPLOAD_PATH', __DIR__ . '/../uploads/');
define('ALLOWED_FILE_TYPES', ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx']);

// Pagination settings
define('ITEMS_PER_PAGE', 20);

// Payment settings
define('LATE_FEE_AMOUNT', 50.00);
define('LATE_FEE_GRACE_DAYS', 5);

// Notification settings
define('RENT_REMINDER_DAYS', [7, 3, 1]); // Days before due date to send reminders
define('ENABLE_EMAIL_NOTIFICATIONS', true);
define('ENABLE_SMS_NOTIFICATIONS', false); // Set to true when SMS is configured

// Timezone
date_default_timezone_set('America/Los_Angeles');

// Error reporting (set to 0 in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
