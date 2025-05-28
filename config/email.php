<?php
// Email configuration using PHPMailer
require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Email settings
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', ''); // Your email
define('SMTP_PASSWORD', ''); // Your app password
define('SMTP_ENCRYPTION', 'tls');
define('FROM_EMAIL', SITE_EMAIL);
define('FROM_NAME', SITE_NAME);

function createMailer() {
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = SMTP_ENCRYPTION;
        $mail->Port = SMTP_PORT;
        
        // Default sender
        $mail->setFrom(FROM_EMAIL, FROM_NAME);
        
        return $mail;
    } catch (Exception $e) {
        error_log("Mailer setup error: " . $e->getMessage());
        return false;
    }
}
?>
