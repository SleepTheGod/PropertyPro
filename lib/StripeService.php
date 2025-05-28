<?php
use Stripe\PaymentIntent;
use Stripe\Customer;
use Stripe\PaymentMethod;
use Stripe\Exception\CardException;
use Stripe\Exception\InvalidRequestException;
use Stripe\Webhook;

class StripeService {
    private $emailService;
    private $smsService;
    
    public function __construct() {
        $this->emailService = new EmailService();
        $this->smsService = new SmsService();
    }
    
    public function createCustomer($tenantId, $email, $name, $phone = null) {
        try {
            $customer = Customer::create([
                'email' => $email,
                'name' => $name,
                'phone' => $phone,
                'metadata' => [
                    'tenant_id' => $tenantId,
                    'source' => 'property_management_system'
                ]
            ]);
            
            // Save customer ID to database
            global $conn;
            $stmt = $conn->prepare("UPDATE tenants SET stripe_customer_id = ? WHERE id = ?");
            $stmt->bind_param("si", $customer->id, $tenantId);
            $stmt->execute();
            
            return $customer;
        } catch (Exception $e) {
            error_log("Stripe customer creation error: " . $e->getMessage());
            return false;
        }
    }
    
    public function createPaymentIntent($tenantId, $amount, $description = 'Rent Payment', $customerId = null) {
        try {
            // Validate amount
            if ($amount < PAYMENT_MINIMUM_AMOUNT || $amount > PAYMENT_MAXIMUM_AMOUNT) {
                throw new InvalidRequestException("Payment amount must be between $" . PAYMENT_MINIMUM_AMOUNT . " and $" . PAYMENT_MAXIMUM_AMOUNT);
            }
            
            $paymentIntentData = [
                'amount' => round($amount * 100), // Convert to cents
                'currency' => PAYMENT_CURRENCY,
                'description' => $description,
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
                'metadata' => [
                    'tenant_id' => $tenantId,
                    'type' => 'rent_payment',
                    'created_by' => 'property_management_system'
                ]
            ];
            
            if ($customerId) {
                $paymentIntentData['customer'] = $customerId;
            }
            
            $paymentIntent = PaymentIntent::create($paymentIntentData);
            
            return [
                'success' => true,
                'client_secret' => $paymentIntent->client_secret,
                'payment_intent_id' => $paymentIntent->id
            ];
            
        } catch (Exception $e) {
            error_log("Payment intent creation error: " . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    public function confirmPayment($paymentIntentId, $paymentMethodId) {
        try {
            $paymentIntent = PaymentIntent::retrieve($paymentIntentId);
            
            if ($paymentMethodId) {
                $paymentIntent->confirm([
                    'payment_method' => $paymentMethodId
                ]);
            } else {
                $paymentIntent->confirm();
            }
            
            return [
                'success' => true,
                'payment_intent' => $paymentIntent
            ];
            
        } catch (CardException $e) {
            return [
                'success' => false,
                'error' => $e->getError()->message,
                'decline_code' => $e->getError()->decline_code
            ];
        } catch (Exception $e) {
            error_log("Payment confirmation error: " . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Payment processing failed'
            ];
        }
    }
    
    public function processWebhook($payload, $signature) {
        try {
            $event = Webhook::constructEvent(
                $payload,
                $signature,
                STRIPE_WEBHOOK_SECRET
            );
            
            switch ($event->type) {
                case 'payment_intent.succeeded':
                    $this->handlePaymentSucceeded($event->data->object);
                    break;
                    
                case 'payment_intent.payment_failed':
                    $this->handlePaymentFailed($event->data->object);
                    break;
                    
                case 'invoice.payment_succeeded':
                    $this->handleInvoicePaymentSucceeded($event->data->object);
                    break;
                    
                case 'invoice.payment_failed':
                    $this->handleInvoicePaymentFailed($event->data->object);
                    break;
                    
                default:
                    error_log("Unhandled webhook event type: " . $event->type);
            }
            
            return ['success' => true];
            
        } catch (Exception $e) {
            error_log("Webhook processing error: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    private function handlePaymentSucceeded($paymentIntent) {
        global $conn;
        
        $tenantId = $paymentIntent->metadata->tenant_id ?? null;
        if (!$tenantId) return;
        
        // Calculate fees
        $amount = $paymentIntent->amount / 100;
        $processingFee = ($amount * PAYMENT_PROCESSING_FEE_PERCENT / 100) + PAYMENT_PROCESSING_FEE_FIXED;
        $netAmount = $amount - $processingFee;
        
        // Save transaction
        $stmt = $conn->prepare("
            INSERT INTO payment_transactions 
            (tenant_id, amount, payment_method, payment_type, status, stripe_payment_intent_id, stripe_charge_id, transaction_fee, net_amount, payment_date) 
            VALUES (?, ?, 'credit_card', 'rent', 'completed', ?, ?, ?, ?, NOW())
        ");
        
        $chargeId = $paymentIntent->charges->data[0]->id ?? null;
        $stmt->bind_param("idssdd", $tenantId, $amount, $paymentIntent->id, $chargeId, $processingFee, $netAmount);
        
        if ($stmt->execute()) {
            $transactionId = $conn->insert_id;
            
            // Send confirmations
            $this->sendPaymentConfirmations($tenantId, $amount, $transactionId);
            
            // Log activity
            logActivity($tenantId, 'payment_completed', "Payment of $" . number_format($amount, 2) . " completed via Stripe");
        }
    }
    
    private function handlePaymentFailed($paymentIntent) {
        global $conn;
        
        $tenantId = $paymentIntent->metadata->tenant_id ?? null;
        if (!$tenantId) return;
        
        $amount = $paymentIntent->amount / 100;
        $errorMessage = $paymentIntent->last_payment_error->message ?? 'Payment failed';
        
        // Save failed transaction
        $stmt = $conn->prepare("
            INSERT INTO payment_transactions 
            (tenant_id, amount, payment_method, payment_type, status, stripe_payment_intent_id, description) 
            VALUES (?, ?, 'credit_card', 'rent', 'failed', ?, ?)
        ");
        
        $stmt->bind_param("idss", $tenantId, $amount, $paymentIntent->id, $errorMessage);
        $stmt->execute();
        
        // Send failure notification
        $this->sendPaymentFailureNotification($tenantId, $amount, $errorMessage);
        
        // Log activity
        logActivity($tenantId, 'payment_failed', "Payment of $" . number_format($amount, 2) . " failed: " . $errorMessage);
    }
    
    private function sendPaymentConfirmations($tenantId, $amount, $transactionId) {
        global $conn;
        
        // Get tenant info
        $stmt = $conn->prepare("
            SELECT u.name, u.email, u.phone 
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
            if (PAYMENT_RECEIPT_EMAIL_ENABLED) {
                $this->emailService->sendPaymentConfirmation(
                    $tenant['email'], 
                    $amount, 
                    date('Y-m-d H:i:s'), 
                    $transactionId
                );
            }
            
            // Send SMS confirmation
            if (PAYMENT_RECEIPT_SMS_ENABLED && $tenant['phone']) {
                $this->smsService->sendPaymentConfirmation($tenantId, $amount, $transactionId);
            }
        }
    }
    
    private function sendPaymentFailureNotification($tenantId, $amount, $errorMessage) {
        global $conn;
        
        // Get tenant info
        $stmt = $conn->prepare("
            SELECT u.name, u.email, u.phone 
            FROM users u 
            JOIN tenants t ON u.id = t.user_id 
            WHERE t.id = ?
        ");
        $stmt->bind_param("i", $tenantId);
        $stmt->execute();
        $result = $stmt->get_result();
        $tenant = $result->fetch_assoc();
        
        if ($tenant) {
            // Send email notification
            $subject = "Payment Failed - " . SITE_NAME;
            $body = "Your payment of $" . number_format($amount, 2) . " could not be processed. Reason: " . $errorMessage . ". Please try again or contact support.";
            $this->emailService->sendEmail($tenant['email'], $subject, $body);
            
            // Send SMS notification
            if ($tenant['phone']) {
                $message = "Payment failed: Your payment of $" . number_format($amount, 2) . " could not be processed. Please try again or contact support.";
                $this->smsService->sendSms($tenant['phone'], $message, 'payment_failed', $tenantId);
            }
        }
    }
    
    public function createRefund($paymentIntentId, $amount = null, $reason = 'requested_by_customer') {
        try {
            $refundData = [
                'payment_intent' => $paymentIntentId,
                'reason' => $reason
            ];
            
            if ($amount) {
                $refundData['amount'] = round($amount * 100); // Convert to cents
            }
            
            $refund = \Stripe\Refund::create($refundData);
            
            return [
                'success' => true,
                'refund' => $refund
            ];
            
        } catch (Exception $e) {
            error_log("Refund creation error: " . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    public function getPaymentMethods($customerId) {
        try {
            $paymentMethods = PaymentMethod::all([
                'customer' => $customerId,
                'type' => 'card',
            ]);
            
            return [
                'success' => true,
                'payment_methods' => $paymentMethods->data
            ];
            
        } catch (Exception $e) {
            error_log("Payment methods retrieval error: " . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}
?>
