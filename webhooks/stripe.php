<?php
require_once '../config/init.php';

// Set content type
header('Content-Type: application/json');

// Get the payload
$payload = @file_get_contents('php://input');
$signature = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

if (empty($payload) || empty($signature)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing payload or signature']);
    exit;
}

// Process webhook
$stripeService = new StripeService();
$result = $stripeService->processWebhook($payload, $signature);

if ($result['success']) {
    http_response_code(200);
    echo json_encode(['status' => 'success']);
} else {
    http_response_code(400);
    echo json_encode(['error' => $result['error']]);
}
?>
