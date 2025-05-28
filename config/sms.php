<?php
// SMS configuration
define('SMS_ENABLED', true); // Enable SMS functionality
define('SMS_PROVIDER', 'twilio'); // Currently only 'twilio' is supported

// Twilio configuration - PRODUCTION READY
define('TWILIO_ACCOUNT_SID', 'AC1234567890abcdef1234567890abcdef'); // Your Twilio Account SID
define('TWILIO_AUTH_TOKEN', 'your_auth_token_here'); // Your Twilio Auth Token
define('TWILIO_PHONE_NUMBER', '+1234567890'); // Your Twilio Phone Number (with country code)

// SMS settings
define('SMS_PAYMENT_CONFIRMATION_ENABLED', true);
define('SMS_PAYMENT_REMINDER_ENABLED', true);
define('SMS_MAINTENANCE_UPDATE_ENABLED', true);
define('SMS_BULK_MESSAGING_ENABLED', true);

// SMS rate limiting
define('SMS_RATE_LIMIT_PER_MINUTE', 10);
define('SMS_RATE_LIMIT_PER_HOUR', 100);
define('SMS_RATE_LIMIT_PER_DAY', 500);

// Include Twilio SDK
if (SMS_ENABLED && file_exists(__DIR__ . '/../vendor/autoload.php')) {
    require_once __DIR__ . '/../vendor/autoload.php';
}

// Twilio webhook validation
define('TWILIO_WEBHOOK_URL', SITE_URL . '/webhooks/twilio.php');

// SMS templates
define('SMS_TEMPLATES', [
    'payment_reminder' => 'Hi {tenant_name}, your rent payment of {amount} is due on {due_date}. Please log in to {site_name} to make your payment. Thank you!',
    'payment_confirmation' => 'Payment confirmed! Your payment of {amount} has been processed successfully. Transaction ID: {transaction_id}. Thank you!',
    'maintenance_update' => 'Maintenance Update: Your request "{title}" is now {status}. {message} Check your portal for details.',
    'late_fee_notice' => 'NOTICE: Your rent payment is overdue. A late fee of {late_fee} has been applied. Total due: {total_amount}. Please pay immediately to avoid additional fees.',
    'emergency_maintenance' => 'URGENT: Emergency maintenance scheduled for {date} at {time}. {details} Please ensure access to your unit.',
]);
?>
