#!/usr/bin/env php
<?php
/**
 * Rent Reminder Processing Script
 * This script should be run via cron job daily
 * 
 * Add to crontab:
 * 0 9 * * * /usr/bin/php /path/to/scripts/process_reminders.php
 */

require_once __DIR__ . '/../config/init.php';

$emailService = new EmailService();
$smsService = new SmsService();

echo "Starting rent reminder processing...\n";

// Get pending reminders
$stmt = $conn->prepare("
    SELECT rq.*, t.rent_amount, u.name, u.email, u.phone
    FROM reminder_queue rq
    JOIN tenants t ON rq.tenant_id = t.id
    JOIN users u ON t.user_id = u.id
    WHERE rq.processed = 0
    AND rq.reminder_type = 'rent_reminder'
    ORDER BY rq.created_at ASC
");

$stmt->execute();
$reminders = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

$processed = 0;
$errors = 0;

foreach ($reminders as $reminder) {
    try {
        $tenant_name = $reminder['name'];
        $tenant_email = $reminder['email'];
        $tenant_phone = $reminder['phone'];
        $rent_amount = $reminder['rent_amount'];
        $due_date = $reminder['due_date'];
        
        // Send email reminder
        if (ENABLE_EMAIL_NOTIFICATIONS && $tenant_email) {
            $emailSent = $emailService->sendPaymentReminder(
                $tenant_email,
                $tenant_name,
                $rent_amount,
                $due_date
            );
            
            if ($emailSent) {
                echo "Email reminder sent to {$tenant_name} ({$tenant_email})\n";
            } else {
                echo "Failed to send email to {$tenant_name} ({$tenant_email})\n";
                $errors++;
            }
        }
        
        // Send SMS reminder
        if (ENABLE_SMS_NOTIFICATIONS && $tenant_phone) {
            $smsSent = $smsService->sendPaymentReminder(
                $reminder['tenant_id'],
                $tenant_name,
                $rent_amount,
                $due_date
            );
            
            if ($smsSent) {
                echo "SMS reminder sent to {$tenant_name} ({$tenant_phone})\n";
            } else {
                echo "Failed to send SMS to {$tenant_name} ({$tenant_phone})\n";
                $errors++;
            }
        }
        
        // Mark as processed
        $updateStmt = $conn->prepare("UPDATE reminder_queue SET processed = 1, processed_at = NOW() WHERE id = ?");
        $updateStmt->bind_param("i", $reminder['id']);
        $updateStmt->execute();
        
        $processed++;
        
    } catch (Exception $e) {
        echo "Error processing reminder for tenant ID {$reminder['tenant_id']}: " . $e->getMessage() . "\n";
        $errors++;
    }
}

echo "Rent reminder processing completed.\n";
echo "Processed: {$processed}\n";
echo "Errors: {$errors}\n";

// Clean up old processed reminders (older than 30 days)
$conn->query("DELETE FROM reminder_queue WHERE processed = 1 AND processed_at < DATE_SUB(NOW(), INTERVAL 30 DAY)");

echo "Cleanup completed.\n";
?>
