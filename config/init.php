<?php
// Initialize the application
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/email.php';
require_once __DIR__ . '/sms.php';
require_once __DIR__ . '/stripe.php';
require_once __DIR__ . '/../lib/functions.php';

// Auto-load classes
spl_autoload_register(function ($class) {
    $file = __DIR__ . '/../lib/' . $class . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

// Set error handler
set_error_handler(function($severity, $message, $file, $line) {
    if (!(error_reporting() & $severity)) {
        return false;
    }
    
    error_log("Error: $message in $file on line $line");
    
    if ($severity === E_ERROR || $severity === E_USER_ERROR) {
        die("A fatal error occurred. Please try again later.");
    }
    
    return true;
});

// Set exception handler
set_exception_handler(function($exception) {
    error_log("Uncaught exception: " . $exception->getMessage());
    die("An unexpected error occurred. Please try again later.");
});
?>
