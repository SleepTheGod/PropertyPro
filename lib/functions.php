<?php
// Utility functions

function sanitize($input) {
    if (is_array($input)) {
        return array_map('sanitize', $input);
    }
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function validatePhone($phone) {
    $phone = preg_replace('/[^0-9+]/', '', $phone);
    return preg_match('/^\+?[1-9]\d{1,14}$/', $phone);
}

function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

function generateToken($length = 32) {
    return bin2hex(random_bytes($length / 2));
}

function isLoggedIn() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        redirect('login');
    }
}

function requireRole($role) {
    requireLogin();
    if ($_SESSION['user_role'] !== $role) {
        setMessage('Access denied', 'error');
        redirect('dashboard');
    }
}

function redirect($path) {
    $url = SITE_URL . '/' . ltrim($path, '/');
    header("Location: $url");
    exit;
}

function setMessage($message, $type = 'info') {
    $_SESSION['flash_message'] = $message;
    $_SESSION['flash_type'] = $type;
}

function getMessage() {
    if (isset($_SESSION['flash_message'])) {
        $message = $_SESSION['flash_message'];
        $type = $_SESSION['flash_type'] ?? 'info';
        unset($_SESSION['flash_message'], $_SESSION['flash_type']);
        return ['message' => $message, 'type' => $type];
    }
    return null;
}

function formatCurrency($amount) {
    return '$' . number_format($amount, 2);
}

function formatDate($date, $format = 'M j, Y') {
    if (empty($date)) return '';
    return date($format, strtotime($date));
}

function formatDateTime($datetime, $format = 'M j, Y g:i A') {
    if (empty($datetime)) return '';
    return date($format, strtotime($datetime));
}

function uploadFile($file, $allowedTypes = null) {
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        return false;
    }
    
    $allowedTypes = $allowedTypes ?: ALLOWED_FILE_TYPES;
    $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    if (!in_array($fileExtension, $allowedTypes)) {
        return false;
    }
    
    if ($file['size'] > MAX_FILE_SIZE) {
        return false;
    }
    
    $fileName = generateToken(16) . '.' . $fileExtension;
    $uploadPath = UPLOAD_PATH . $fileName;
    
    if (!is_dir(UPLOAD_PATH)) {
        mkdir(UPLOAD_PATH, 0755, true);
    }
    
    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        return $fileName;
    }
    
    return false;
}

function deleteFile($fileName) {
    $filePath = UPLOAD_PATH . $fileName;
    if (file_exists($filePath)) {
        return unlink($filePath);
    }
    return false;
}

function paginate($query, $page = 1, $perPage = ITEMS_PER_PAGE) {
    global $conn;
    
    $offset = ($page - 1) * $perPage;
    
    // Get total count
    $countQuery = preg_replace('/SELECT .+ FROM/i', 'SELECT COUNT(*) as total FROM', $query);
    $countResult = $conn->query($countQuery);
    $total = $countResult->fetch_assoc()['total'];
    
    // Get paginated results
    $paginatedQuery = $query . " LIMIT $perPage OFFSET $offset";
    $result = $conn->query($paginatedQuery);
    
    return [
        'data' => $result->fetch_all(MYSQLI_ASSOC),
        'total' => $total,
        'page' => $page,
        'perPage' => $perPage,
        'totalPages' => ceil($total / $perPage)
    ];
}

function logActivity($userId, $action, $details = null) {
    global $conn;
    
    $stmt = $conn->prepare("
        INSERT INTO activity_logs (user_id, action, details, ip_address, user_agent, created_at) 
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    
    $stmt->bind_param("issss", $userId, $action, $details, $ipAddress, $userAgent);
    $stmt->execute();
}

function sendNotification($userId, $type, $title, $message, $data = null) {
    global $conn;
    
    $stmt = $conn->prepare("
        INSERT INTO notifications (user_id, type, title, message, data, created_at) 
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    
    $dataJson = $data ? json_encode($data) : null;
    $stmt->bind_param("issss", $userId, $type, $title, $message, $dataJson);
    
    return $stmt->execute();
}

function calculateLateFee($dueDate, $amount = LATE_FEE_AMOUNT) {
    $gracePeriod = LATE_FEE_GRACE_DAYS;
    $graceDate = date('Y-m-d', strtotime($dueDate . " + $gracePeriod days"));
    
    if (date('Y-m-d') > $graceDate) {
        return $amount;
    }
    
    return 0;
}

function isMaintenanceUrgent($priority) {
    return in_array($priority, ['high', 'emergency']);
}

function getMaintenanceStatusColor($status) {
    $colors = [
        'submitted' => 'yellow',
        'assigned' => 'blue',
        'in_progress' => 'blue',
        'completed' => 'green',
        'cancelled' => 'red'
    ];
    
    return $colors[$status] ?? 'gray';
}

function getPaymentStatusColor($status) {
    $colors = [
        'pending' => 'yellow',
        'completed' => 'green',
        'failed' => 'red',
        'refunded' => 'orange'
    ];
    
    return $colors[$status] ?? 'gray';
}
?>
