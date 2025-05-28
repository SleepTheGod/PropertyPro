<?php
class MaintenanceService {
    private $emailService;
    private $smsService;
    
    public function __construct() {
        $this->emailService = new EmailService();
        $this->smsService = new SmsService();
    }
    
    public function createRequest($tenantId, $title, $description, $category, $priority, $accessInstructions = '', $attachments = []) {
        global $conn;
        
        $stmt = $conn->prepare("
            INSERT INTO maintenance_requests 
            (tenant_id, title, description, category, priority, access_instructions, attachments) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $attachmentsJson = json_encode($attachments);
        $stmt->bind_param("issssss", $tenantId, $title, $description, $category, $priority, $accessInstructions, $attachmentsJson);
        
        if ($stmt->execute()) {
            $requestId = $conn->insert_id;
            
            // Send notifications to property managers
            $this->notifyPropertyManagers($requestId, $tenantId, $title, $priority);
            
            return $requestId;
        }
        
        return false;
    }
    
    public function updateStatus($requestId, $newStatus, $updateMessage = '', $assignedTo = null, $scheduledDate = null) {
        global $conn;
        
        // Get current request info
        $stmt = $conn->prepare("
            SELECT mr.*, u.name as tenant_name, u.email as tenant_email 
            FROM maintenance_requests mr 
            JOIN tenants t ON mr.tenant_id = t.id 
            JOIN users u ON t.user_id = u.id 
            WHERE mr.id = ?
        ");
        $stmt->bind_param("i", $requestId);
        $stmt->execute();
        $request = $stmt->get_result()->fetch_assoc();
        
        if (!$request) {
            return false;
        }
        
        // Update request
        $updateFields = ["status = ?"];
        $params = [$newStatus];
        $types = "s";
        
        if ($assignedTo) {
            $updateFields[] = "assigned_to = ?";
            $params[] = $assignedTo;
            $types .= "i";
        }
        
        if ($scheduledDate) {
            $updateFields[] = "scheduled_date = ?";
            $params[] = $scheduledDate;
            $types .= "s";
        }
        
        if ($newStatus === 'completed') {
            $updateFields[] = "completed_date = NOW()";
        }
        
        $sql = "UPDATE maintenance_requests SET " . implode(", ", $updateFields) . " WHERE id = ?";
        $params[] = $requestId;
        $types .= "i";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        
        if ($stmt->execute()) {
            // Send notifications
            $this->sendStatusUpdateNotifications($request['tenant_id'], $request['tenant_name'], $request['tenant_email'], $request['title'], $newStatus, $updateMessage);
            
            return true;
        }
        
        return false;
    }
    
    public function getRequestsByTenant($tenantId, $status = null) {
        global $conn;
        
        $sql = "SELECT * FROM maintenance_requests WHERE tenant_id = ?";
        $params = [$tenantId];
        $types = "i";
        
        if ($status) {
            $sql .= " AND status = ?";
            $params[] = $status;
            $types .= "s";
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
    
    public function getRequestsByProperty($propertyId, $status = null) {
        global $conn;
        
        $sql = "
            SELECT mr.*, u.name as tenant_name, u.email as tenant_email, t.unit 
            FROM maintenance_requests mr 
            JOIN tenants t ON mr.tenant_id = t.id 
            JOIN users u ON t.user_id = u.id 
            WHERE t.property_id = ?
        ";
        $params = [$propertyId];
        $types = "i";
        
        if ($status) {
            $sql .= " AND mr.status = ?";
            $params[] = $status;
            $types .= "s";
        }
        
        $sql .= " ORDER BY mr.created_at DESC";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
    
    public function getAllRequests($status = null, $priority = null) {
        global $conn;
        
        $sql = "
            SELECT mr.*, u.name as tenant_name, u.email as tenant_email, t.unit, p.name as property_name 
            FROM maintenance_requests mr 
            JOIN tenants t ON mr.tenant_id = t.id 
            JOIN users u ON t.user_id = u.id 
            JOIN properties p ON t.property_id = p.id 
            WHERE 1=1
        ";
        $params = [];
        $types = "";
        
        if ($status) {
            $sql .= " AND mr.status = ?";
            $params[] = $status;
            $types .= "s";
        }
        
        if ($priority) {
            $sql .= " AND mr.priority = ?";
            $params[] = $priority;
            $types .= "s";
        }
        
        $sql .= " ORDER BY mr.created_at DESC";
        
        $stmt = $conn->prepare($sql);
        if ($params) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
    
    public function addComment($requestId, $userId, $comment) {
        global $conn;
        
        // For now, we'll add this as an update to the request
        // In a full implementation, you'd have a separate comments table
        $stmt = $conn->prepare("
            UPDATE maintenance_requests 
            SET updated_at = NOW() 
            WHERE id = ?
        ");
        $stmt->bind_param("i", $requestId);
        
        return $stmt->execute();
    }
    
    private function notifyPropertyManagers($requestId, $tenantId, $title, $priority) {
        global $conn;
        
        // Get property managers for this tenant's property
        $stmt = $conn->prepare("
            SELECT DISTINCT u.email, u.name 
            FROM users u 
            JOIN properties p ON u.id = p.property_manager_id 
            JOIN tenants t ON p.id = t.property_id 
            WHERE t.id = ? AND u.role = 'property_manager'
        ");
        $stmt->bind_param("i", $tenantId);
        $stmt->execute();
        $managers = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        
        // Also notify admins
        $stmt = $conn->prepare("SELECT email, name FROM users WHERE role = 'admin'");
        $stmt->execute();
        $admins = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        
        $recipients = array_merge($managers, $admins);
        
        foreach ($recipients as $recipient) {
            $subject = "New Maintenance Request - Priority: " . ucfirst($priority);
            $body = "A new maintenance request has been submitted:\n\nTitle: $title\nPriority: " . ucfirst($priority) . "\nRequest ID: $requestId\n\nPlease log in to the admin panel to review and assign this request.";
            
            $this->emailService->sendEmail($recipient['email'], $subject, $body, false);
        }
    }
    
    private function sendStatusUpdateNotifications($tenantId, $tenantName, $tenantEmail, $requestTitle, $status, $message) {
        // Send email notification
        if (ENABLE_EMAIL_NOTIFICATIONS) {
            $this->emailService->sendMaintenanceUpdate($tenantEmail, $tenantName, $requestTitle, $status, $message);
        }
        
        // Send SMS notification
        if (ENABLE_SMS_NOTIFICATIONS) {
            $this->smsService->sendMaintenanceUpdate($tenantId, $requestTitle, $status, $message);
        }
    }
}
?>
