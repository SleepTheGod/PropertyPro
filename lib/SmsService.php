<?php
use Twilio\Rest\Client;

class SmsService {
    private $client;
    private $fromNumber;
    
    public function __construct() {
        if (SMS_ENABLED && TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
            $this->client = new Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
            $this->fromNumber = TWILIO_PHONE_NUMBER;
        }
    }
    
    public function sendSms($to, $message, $type = 'other', $recipientId = null) {
        if (!SMS_ENABLED || !$this->client) {
            error_log("SMS service not enabled or configured");
            return false;
        }
        
        // Clean phone number
        $to = $this->cleanPhoneNumber($to);
        if (!$to) {
            error_log("Invalid phone number: $to");
            return false;
        }
        
        try {
            // Send SMS via Twilio
            $twilioMessage = $this->client->messages->create($to, [
                'from' => $this->fromNumber,
                'body' => $message
            ]);
            
            // Log SMS
            $this->logSms($recipientId, $to, $message, $type, 'sent', $twilioMessage->sid);
            
            return true;
        } catch (Exception $e) {
            error_log("SMS send error: " . $e->getMessage());
            $this->logSms($recipientId, $to, $message, $type, 'failed', null, $e->getMessage());
            return false;
        }
    }
    
    public function sendPaymentReminder($tenantId, $tenantName, $amount, $dueDate) {
        if (!SMS_PAYMENT_REMINDER_ENABLED) {
            return false;
        }
        
        global $conn;
        
        // Get tenant phone number
        $stmt = $conn->prepare("
            SELECT u.phone 
            FROM users u 
            JOIN tenants t ON u.id = t.user_id 
            WHERE t.id = ?
        ");
        $stmt->bind_param("i", $tenantId);
        $stmt->execute();
        $result = $stmt->get_result();
        $tenant = $result->fetch_assoc();
        
        if (!$tenant || !$tenant['phone']) {
            return false;
        }
        
        $message = "Hi $tenantName, your rent payment of " . formatCurrency($amount) . " is due on " . formatDate($dueDate) . ". Please log in to " . SITE_NAME . " to make your payment. Thank you!";
        
        return $this->sendSms($tenant['phone'], $message, 'payment_reminder', $tenantId);
    }
    
    public function sendPaymentConfirmation($tenantId, $amount, $transactionId) {
        if (!SMS_PAYMENT_CONFIRMATION_ENABLED) {
            return false;
        }
        
        global $conn;
        
        // Get tenant info
        $stmt = $conn->prepare("
            SELECT u.name, u.phone 
            FROM users u 
            JOIN tenants t ON u.id = t.user_id 
            WHERE t.id = ?
        ");
        $stmt->bind_param("i", $tenantId);
        $stmt->execute();
        $result = $stmt->get_result();
        $tenant = $result->fetch_assoc();
        
        if (!$tenant || !$tenant['phone']) {
            return false;
        }
        
        $message = "Payment confirmed! Your payment of " . formatCurrency($amount) . " has been processed. Transaction ID: $transactionId. Thank you!";
        
        return $this->sendSms($tenant['phone'], $message, 'payment_confirmation', $tenantId);
    }
    
    public function sendMaintenanceUpdate($tenantId, $requestTitle, $status, $updateMessage = '') {
        if (!SMS_MAINTENANCE_UPDATE_ENABLED) {
            return false;
        }
        
        global $conn;
        
        // Get tenant info
        $stmt = $conn->prepare("
            SELECT u.name, u.phone 
            FROM users u 
            JOIN tenants t ON u.id = t.user_id 
            WHERE t.id = ?
        ");
        $stmt->bind_param("i", $tenantId);
        $stmt->execute();
        $result = $stmt->get_result();
        $tenant = $result->fetch_assoc();
        
        if (!$tenant || !$tenant['phone']) {
            return false;
        }
        
        $statusText = ucfirst(str_replace('_', ' ', $status));
        $message = "Maintenance Update: Your request '$requestTitle' is now $statusText.";
        
        if ($updateMessage) {
            $message .= " $updateMessage";
        }
        
        $message .= " Check your portal for details.";
        
        return $this->sendSms($tenant['phone'], $message, 'maintenance_update', $tenantId);
    }
    
    public function sendBulkMessage($recipients, $message) {
        if (!SMS_BULK_MESSAGING_ENABLED) {
            return false;
        }
        
        $results = [];
        
        foreach ($recipients as $recipient) {
            $phone = $recipient['phone'] ?? '';
            $userId = $recipient['user_id'] ?? null;
            
            if ($phone) {
                $results[] = [
                    'phone' => $phone,
                    'success' => $this->sendSms($phone, $message, 'bulk_message', $userId)
                ];
            }
        }
        
        return $results;
    }
    
    private function cleanPhoneNumber($phone) {
        // Remove all non-numeric characters except +
        $phone = preg_replace('/[^0-9+]/', '', $phone);
        
        // Add country code if missing
        if (!str_starts_with($phone, '+')) {
            if (str_starts_with($phone, '1')) {
                $phone = '+' . $phone;
            } else {
                $phone = '+1' . $phone;
            }
        }
        
        // Validate format
        if (preg_match('/^\+[1-9]\d{1,14}$/', $phone)) {
            return $phone;
        }
        
        return false;
    }
    
    private function logSms($recipientId, $phone, $message, $type, $status, $providerId = null, $error = null) {
        global $conn;
        
        $stmt = $conn->prepare("
            INSERT INTO sms_logs (recipient_id, phone_number, message, message_type, status, provider_message_id, error_message, sent_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        
        $stmt->bind_param("issssss", $recipientId, $phone, $message, $type, $status, $providerId, $error);
        $stmt->execute();
    }
}
?>
