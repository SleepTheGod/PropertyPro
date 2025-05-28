<?php
// Stripe PRODUCTION configuration
define('STRIPE_PUBLISHABLE_KEY', 'pk_live_51234567890abcdef'); // Your Stripe LIVE publishable key
define('STRIPE_SECRET_KEY', 'sk_live_51234567890abcdef'); // Your Stripe LIVE secret key
define('STRIPE_WEBHOOK_SECRET', 'whsec_1234567890abcdef'); // Your Stripe LIVE webhook secret

// Comment out test keys
// define('STRIPE_PUBLISHABLE_KEY', 'pk_test_51234567890abcdef');
// define('STRIPE_SECRET_KEY', 'sk_test_51234567890abcdef');

// Payment settings
define('PAYMENT_CURRENCY', 'usd');
define('PAYMENT_PROCESSING_FEE_PERCENT', 2.9); // 2.9%
define('PAYMENT_PROCESSING_FEE_FIXED', 0.30); // $0.30
define('PAYMENT_MINIMUM_AMOUNT', 1.00); // Minimum $1.00
define('PAYMENT_MAXIMUM_AMOUNT', 10000.00); // Maximum $10,000

// Payment methods enabled
define('PAYMENT_METHODS_ENABLED', [
    'card' => true,
    'ach_debit' => true,
    'us_bank_account' => true,
]);

// Include Stripe SDK
if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
    require_once __DIR__ . '/../vendor/autoload.php';
    
    if (STRIPE_SECRET_KEY) {
        \Stripe\Stripe::setApiKey(STRIPE_SECRET_KEY);
        \Stripe\Stripe::setApiVersion('2023-10-16'); // Use latest API version
    }
}

// Set to true when going live
define('STRIPE_LIVE_MODE', true);

// Logging for production transactions
define('PAYMENT_LOG_ENABLED', true);
define('PAYMENT_LOG_PATH', __DIR__ . '/../logs/payments.log');

// Stripe Connect settings (for multi-property management)
define('STRIPE_CONNECT_ENABLED', false);
define('STRIPE_CONNECT_CLIENT_ID', ''); // Your Stripe Connect client ID
?>
