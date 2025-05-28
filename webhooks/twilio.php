<?php
require_once '../config/init.php';

// Verify Twilio webhook signature
function verifyTwilioSignature($payload, $signature, $url) {
    $expectedSignature = base64_encode(hash_hmac('sha1', $url . $payload, TWILIO_AUTH_TOKEN, true));
    return hash_equals($expectedSignature, $signature);
}

// Get webhook data
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_TWILIO_SIGNATURE'] ?? '';
$url = TWILIO_WEBHOOK_URL;

// Verify signature
if (!verifyTwilioSignature($payload, $signature, $url)) {
    http_response_code(403);
    echo 'Forbidden';
    exit;
}

// Parse webhook data
parse_str($payload, $data);

$messageStatus = $data['MessageStatus'] ?? '';
$messageSid = $data['MessageSid'] ?? '';
$to = $data['To'] ?? '';
$errorCode = $data['ErrorCode'] ?? null;

// Update SMS log
if ($messageSid) {
    global $conn;
    
    $updateFields = ['status = ?'];
    $params = [$messageStatus];
    $types = 's';
    
    if ($messageStatus === 'delivered') {
        $updateFields[] = 'delivered_at = NOW()';
    }
    
    if ($errorCode) {
        $updateFields[] = 'error_message = ?';
        $params[] = "Error code: $errorCode";
        $types .= 's';
    }
    
    $sql = "UPDATE sms_logs SET " . implode(', ', $updateFields) . " WHERE provider_message_id = ?";
    $params[] = $messageSid;
    $types .= 's';
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    
    // Log webhook processing
    error_log("Twilio webhook processed: MessageSid=$messageSid, Status=$messageStatus, To=$to");
}

// Respond to Twilio
http_response_code(200);
echo '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';
?>
