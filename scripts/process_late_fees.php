#!/usr/bin/env php
<?php
/**
 * Late Fee Processing Script
 * This script processes late fees for overdue rent payments
 * 
 * Run daily via cron: 0 6 * * * /usr/bin/php /path/to/scripts/process_late_fees.php
 */

require_once __DIR__ . '/../config/init.php';

$emailService = new EmailService();
$smsService = new SmsService();

echo "Starting late fee processing...\n";

// Get tenants with overdue payments
$stmt = $conn->prepare("
    SELECT 
        t.id as tenant_id,
        t.rent_amount,
        t.rent_due_day,
        u.name,
        u.email,
        u.phone,
        p.name as property_name
    FROM tenants t
    JOIN users u ON t.user_id = u.id
    JOIN properties p ON t.property_id = p.id
    WHERE t.status = 'active'
    AND NOT EXISTS (
        SELECT 1 FROM payment_transactions pt
        WHERE pt.tenant_id = t.id
        AND pt.status = 'completed'
        AND MONTH(pt.payment_date) = MONTH(CURRENT_DATE())
        AND YEAR(pt.payment_date) = YEAR(CURRENT_DATE())
    )
    AND CURDATE() > DATE(CONCAT(YEAR(CURDATE()), '-', MONTH(CURDATE()), '-', t.rent_due_day)) + INTERVAL " . LATE_FEE_GRACE_DAYS . " DAY
");

$stmt->execute();
$overdue_tenants = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

$processed = 0;
$errors = 0;

foreach ($overdue_tenants as $tenant) {
    try {
        $tenant_id = $tenant['tenant_id'];
        $rent_amount = $tenant['rent_amount'];
        $late_fee = LATE_FEE_AMOUNT;
        $total_due = $rent_amount + $late_fee;
        
        // Check if late fee already applied this month
        $stmt = $conn->prepare("
            SELECT COUNT(*) as count 
            FROM payment_transactions 
            WHERE tenant_id = ? 
            AND payment_type = 'late_fee'
            AND MONTH(created_at) = MONTH(CURRENT_DATE())
            AND YEAR(created_at) = YEAR(CURRENT_DATE())
        ");
        $stmt->bind_param("i", $tenant_id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        
        if ($result['count'] == 0) {
            // Apply late fee
            $stmt = $conn->prepare("
                INSERT INTO payment_transactions 
                (tenant_id, amount, payment_method, payment_type, status, description, due_date, created_at) 
                VALUES (?, ?, 'system', 'late_fee', 'pending', 'Late fee for overdue rent payment', CURDATE(), NOW())
            ");
            $stmt->bind_param("id", $tenant_id, $late_fee);
            $stmt->execute();
            
            // Send notifications
            $tenant_name = $tenant['name'];
            $tenant_email = $tenant['email'];
            $tenant_phone = $tenant['phone'];
            
            // Email notification
            if (ENABLE_EMAIL_NOTIFICATIONS && $tenant_email) {
                $subject = "Late Fee Applied - " . SITE_NAME;
                $body = "Dear $tenant_name,\n\nA late fee of " . formatCurrency($late_fee) . " has been applied to your account for overdue rent payment.\n\nTotal amount due: " . formatCurrency($total_due) . "\n\nPlease log in to your tenant portal to make a payment immediately to avoid additional fees.\n\nThank you.";
                
                $emailService->sendEmail($tenant_email, $subject, $body, false);
            }
            
            // SMS notification
            if (ENABLE_SMS_NOTIFICATIONS && $tenant_phone) {
                $message = str_replace(
                    ['{tenant_name}', '{late_fee}', '{total_amount}', '{site_name}'],
                    [$tenant_name, formatCurrency($late_fee), formatCurrency($total_due), SITE_NAME],
                    SMS_TEMPLATES['late_fee_notice']
                );
                
                $smsService->sendSms($tenant_phone, $message, 'late_fee_notice', $tenant_id);
            }
            
            echo "Late fee applied to {$tenant_name} (Tenant ID: {$tenant_id}): " . formatCurrency($late_fee) . "\n";
            $processed++;
            
            // Log activity
            logActivity($tenant_id, 'late_fee_applied', "Late fee of " . formatCurrency($late_fee) . " applied for overdue rent");
        }
        
    } catch (Exception $e) {
        echo "Error processing late fee for tenant ID {$tenant['tenant_id']}: " . $e->getMessage() . "\n";
        $errors++;
    }
}

echo "Late fee processing completed.\n";
echo "Processed: {$processed}\n";
echo "Errors: {$errors}\n";
?>
