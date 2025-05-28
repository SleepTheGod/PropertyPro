<?php
class EmailService {
    private $mailer;
    
    public function __construct() {
        $this->mailer = createMailer();
    }
    
    public function sendEmail($to, $subject, $body, $isHtml = true) {
        if (!$this->mailer) {
            error_log("Email service not configured");
            return false;
        }
        
        try {
            $this->mailer->clearAddresses();
            $this->mailer->addAddress($to);
            $this->mailer->Subject = $subject;
            $this->mailer->Body = $body;
            $this->mailer->isHTML($isHtml);
            
            return $this->mailer->send();
        } catch (Exception $e) {
            error_log("Email send error: " . $e->getMessage());
            return false;
        }
    }
    
    public function sendPaymentConfirmation($tenantEmail, $amount, $paymentDate, $transactionId) {
        $subject = "Payment Confirmation - " . SITE_NAME;
        $body = $this->getPaymentConfirmationTemplate($amount, $paymentDate, $transactionId);
        
        return $this->sendEmail($tenantEmail, $subject, $body);
    }
    
    public function sendPaymentReminder($tenantEmail, $tenantName, $amount, $dueDate) {
        $subject = "Rent Payment Reminder - " . SITE_NAME;
        $body = $this->getPaymentReminderTemplate($tenantName, $amount, $dueDate);
        
        return $this->sendEmail($tenantEmail, $subject, $body);
    }
    
    public function sendMaintenanceUpdate($tenantEmail, $tenantName, $requestTitle, $status, $message = '') {
        $subject = "Maintenance Request Update - " . SITE_NAME;
        $body = $this->getMaintenanceUpdateTemplate($tenantName, $requestTitle, $status, $message);
        
        return $this->sendEmail($tenantEmail, $subject, $body);
    }
    
    private function getPaymentConfirmationTemplate($amount, $paymentDate, $transactionId) {
        return "
        <html>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #2563eb;'>Payment Confirmation</h2>
                <p>Your payment has been successfully processed.</p>
                
                <div style='background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                    <h3>Payment Details</h3>
                    <p><strong>Amount:</strong> " . formatCurrency($amount) . "</p>
                    <p><strong>Date:</strong> " . formatDateTime($paymentDate) . "</p>
                    <p><strong>Transaction ID:</strong> $transactionId</p>
                </div>
                
                <p>Thank you for your payment!</p>
                
                <hr style='margin: 30px 0;'>
                <p style='font-size: 12px; color: #666;'>
                    This is an automated message from " . SITE_NAME . ". Please do not reply to this email.
                </p>
            </div>
        </body>
        </html>";
    }
    
    private function getPaymentReminderTemplate($tenantName, $amount, $dueDate) {
        return "
        <html>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #dc2626;'>Rent Payment Reminder</h2>
                <p>Dear $tenantName,</p>
                <p>This is a friendly reminder that your rent payment is due.</p>
                
                <div style='background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                    <h3>Payment Details</h3>
                    <p><strong>Amount Due:</strong> " . formatCurrency($amount) . "</p>
                    <p><strong>Due Date:</strong> " . formatDate($dueDate) . "</p>
                </div>
                
                <p>Please log in to your tenant portal to make a payment:</p>
                <p><a href='" . SITE_URL . "/pages/tenant/payments.php' style='background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Make Payment</a></p>
                
                <p>If you have already made this payment, please disregard this notice.</p>
                
                <hr style='margin: 30px 0;'>
                <p style='font-size: 12px; color: #666;'>
                    This is an automated message from " . SITE_NAME . ". Please do not reply to this email.
                </p>
            </div>
        </body>
        </html>";
    }
    
    private function getMaintenanceUpdateTemplate($tenantName, $requestTitle, $status, $message) {
        return "
        <html>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #2563eb;'>Maintenance Request Update</h2>
                <p>Dear $tenantName,</p>
                <p>Your maintenance request has been updated.</p>
                
                <div style='background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                    <h3>Request Details</h3>
                    <p><strong>Request:</strong> $requestTitle</p>
                    <p><strong>Status:</strong> " . ucfirst(str_replace('_', ' ', $status)) . "</p>
                    " . ($message ? "<p><strong>Update:</strong> $message</p>" : "") . "
                </div>
                
                <p>You can view the full details in your tenant portal:</p>
                <p><a href='" . SITE_URL . "/pages/tenant/maintenance.php' style='background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>View Request</a></p>
                
                <hr style='margin: 30px 0;'>
                <p style='font-size: 12px; color: #666;'>
                    This is an automated message from " . SITE_NAME . ". Please do not reply to this email.
                </p>
            </div>
        </body>
        </html>";
    }
}
?>
