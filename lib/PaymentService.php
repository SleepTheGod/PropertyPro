<?php
use Stripe\PaymentIntent;
use Stripe\Exception\CardException;

class PaymentService {
    private $emailService;
    private $smsService;
    
    public function __construct() {
        $this->emailService = new EmailService();
        $this->smsService = new SmsService();
    }
    
    public function createPaymentIntent($tenantId, $amount, $description = 'Rent Payment') {
        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => $amount * 100, // Convert to cents
                'currency' => PAYMENT_CURRENCY,
                'description' => $description,
                'metadata' => [
                    'tenant_id' => $tenantId,
                    'type' => 'rent_payment'
                ]
            ]);
            
            return $paymentIntent;
        } catch (Exception $e) {
            error_log("Payment intent creation error: " . $e->getMessage());
            return false;
        }
    }
    
    public function processPayment($tenantId, $amount, $paymentMethodId, $paymentType = 'rent') {
        global $conn;
        
        try {
            // Create payment intent
            $paymentIntent = PaymentIntent::create([
                'amount' => $amount * 100,
                'currency' => PAYMENT_CURRENCY,
                'payment_method' => $paymentMethodId,
                'confirmation_method' => 'manual',
                'confirm' => true,
                'metadata' => [
                    'tenant_id' => $tenantId,
                    'type' => $paymentType
                ]
            ]);
            
            if ($paymentIntent->status === 'succeeded') {
                // Calculate fees
                $processingFee = ($amount * PAYMENT_PROCESSING_FEE_PERCENT / 100) + PAYMENT_PROCESSING_FEE_FIXED;
                $netAmount = $amount - $processingFee;
                
                // Save transaction
                $transactionId = $this->saveTransaction($tenantId, $amount, 'credit_card', $paymentType, 'completed', $paymentIntent->id, $paymentIntent->charges->data[0]->id, $processingFee, $netAmount);
                
                if ($transactionId) {
                    // Send confirmations
                    $this->sendPaymentConfirmations($tenantId, $amount, $transactionId);
                    
                    return [
                        'success' => true,
                        'transaction_id' => $transactionId,
                        'payment_intent_id' => $paymentIntent->id
                    ];
                }
            }
            
            return ['success' => false, 'error' => 'Payment processing failed'];
            
        } catch (CardException $e) {
            error_log("Card error: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getError()->message];
        } catch (Exception $e) {
            error_log("Payment error: " . $e->getMessage());
            return ['success' => false, 'error' => 'Payment processing failed'];
        }
    }
    
    public function saveTransaction($tenantId, $amount, $paymentMethod, $paymentType, $status, $paymentIntentId = null, $chargeId = null, $fee = 0, $netAmount = null) {
        global $conn;
        
        $netAmount = $netAmount ?: $amount;
        
        $stmt = $conn->prepare("
            INSERT INTO payment_transactions 
            (tenant_id, amount, payment_method, payment_type, status, stripe_payment_intent_id, stripe_charge_id, transaction_fee, net_amount, payment_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        
        $stmt->bind_param("idsssssdd", $tenantId, $amount, $paymentMethod, $paymentType, $status, $paymentIntentId, $chargeId, $fee, $netAmount);
        
        if ($stmt->execute()) {
            return $conn->insert_id;
        }
        
        return false;
    }
    
    public function getPaymentHistory($tenantId, $limit = 10) {
        global $conn;
        
        $stmt = $conn->prepare("
            SELECT * FROM payment_transactions 
            WHERE tenant_id = ? 
            ORDER BY payment_date DESC 
            LIMIT ?
        ");
        
        $stmt->bind_param("ii", $tenantId, $limit);
        $stmt->execute();
        
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
    
    public function getOutstandingBalance($tenantId) {
        global $conn;
        
        // Get tenant rent info
        $stmt = $conn->prepare("
            SELECT rent_amount, rent_due_day 
            FROM tenants 
            WHERE id = ?
        ");
        $stmt->bind_param("i", $tenantId);
        $stmt->execute();
        $tenant = $stmt->get_result()->fetch_assoc();
        
        if (!$tenant) {
            return 0;
        }
        
        // Calculate current month's due date
        $currentMonth = date('Y-m');
        $dueDate = $currentMonth . '-' . str_pad($tenant['rent_due_day'], 2, '0', STR_PAD_LEFT);
        
        // If due date has passed this month, it's overdue
        if (date('Y-m-d') > $dueDate) {
            // Check if payment was made for this month
            $stmt = $conn->prepare("
                SELECT SUM(amount) as paid 
                FROM payment_transactions 
                WHERE tenant_id = ? 
                AND status = 'completed' 
                AND payment_date >= ? 
                AND payment_date &lt; ?
            ");
            
            $monthStart = $currentMonth . '-01';
            $nextMonth = date('Y-m-01', strtotime('+1 month'));
            
            $stmt->bind_param("iss", $tenantId, $monthStart, $nextMonth);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            
            $paidAmount = $result['paid'] ?: 0;
            $balance = $tenant['rent_amount'] - $paidAmount;
            
            // Add late fee if applicable
            if ($balance > 0) {
                $balance += calculateLateFee($dueDate);
            }
            
            return max(0, $balance);
        }
        
        return 0;
    }
    
    private function sendPaymentConfirmations($tenantId, $amount, $transactionId) {
        global $conn;
        
        // Get tenant info
        $stmt = $conn->prepare("
            SELECT u.name, u.email 
            FROM users u 
            JOIN tenants t ON u.id = t.user_id 
            WHERE t.id = ?
        ");
        $stmt->bind_param("i", $tenantId);
        $stmt->execute();
        $result = $stmt->get_result();
        $tenant = $result->fetch_assoc();
        
        if ($tenant) {
            // Send email confirmation
            if (ENABLE_EMAIL_NOTIFICATIONS) {
                $this->emailService->sendPaymentConfirmation(
                    $tenant['email'], 
                    $amount, 
                    date('Y-m-d H:i:s'), 
                    $transactionId
                );
            }
            
            // Send SMS confirmation
            if (ENABLE_SMS_NOTIFICATIONS) {
                $this->smsService->sendPaymentConfirmation($tenantId, $amount, $transactionId);
            }
        }
    }
}
?>
