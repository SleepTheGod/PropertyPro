<?php
class BulkSmsService {
    private $smsService;
    
    public function __construct() {
        $this->smsService = new SmsService();
    }
    
    public function sendToAllTenants($message, $propertyId = null) {
        global $conn;
        
        $sql = "
            SELECT u.id as user_id, u.name, u.phone 
            FROM users u 
            JOIN tenants t ON u.id = t.user_id 
            WHERE u.phone IS NOT NULL AND u.phone != ''
        ";
        $params = [];
        $types = "";
        
        if ($propertyId) {
            $sql .= " AND t.property_id = ?";
            $params[] = $propertyId;
            $types = "i";
        }
        
        $stmt = $conn->prepare($sql);
        if ($params) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        
        $recipients = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        
        return $this->smsService->sendBulkMessage($recipients, $message);
    }
    
    public function sendToTenantsByUnit($message, $units) {
        global $conn;
        
        if (empty($units)) {
            return [];
        }
        
        $placeholders = str_repeat('?,', count($units) - 1) . '?';
        $sql = "
            SELECT u.id as user_id, u.name, u.phone 
            FROM users u 
            JOIN tenants t ON u.id = t.user_id 
            WHERE u.phone IS NOT NULL AND u.phone != '' 
            AND t.unit IN ($placeholders)
        ";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param(str_repeat('s', count($units)), ...$units);
        $stmt->execute();
        
        $recipients = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        
        return $this->smsService->sendBulkMessage($recipients, $message);
    }
    
    public function sendToOverdueTenants($message) {
        global $conn;
        
        // Get tenants with overdue payments
        $sql = "
            SELECT DISTINCT u.id as user_id, u.name, u.phone 
            FROM users u 
            JOIN tenants t ON u.id = t.user_id 
            WHERE u.phone IS NOT NULL AND u.phone != ''
            AND t.id IN (
                SELECT tenant_id 
                FROM payment_transactions pt 
                WHERE pt.due_date &lt; CURDATE() 
                AND pt.status != 'completed'
            )
        ";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        
        $recipients = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        
        return $this->smsService->sendBulkMessage($recipients, $message);
    }
    
    public function sendCustomMessage($recipientIds, $message) {
        global $conn;
        
        if (empty($recipientIds)) {
            return [];
        }
        
        $placeholders = str_repeat('?,', count($recipientIds) - 1) . '?';
        $sql = "
            SELECT id as user_id, name, phone 
            FROM users 
            WHERE phone IS NOT NULL AND phone != '' 
            AND id IN ($placeholders)
        ";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param(str_repeat('i', count($recipientIds)), ...$recipientIds);
        $stmt->execute();
        
        $recipients = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        
        return $this->smsService->sendBulkMessage($recipients, $message);
    }
    
    public function getSmsStats($startDate = null, $endDate = null) {
        global $conn;
        
        $sql = "
            SELECT 
                message_type,
                status,
                COUNT(*) as count,
                SUM(cost) as total_cost
            FROM sms_logs 
            WHERE 1=1
        ";
        $params = [];
        $types = "";
        
        if ($startDate) {
            $sql .= " AND created_at >= ?";
            $params[] = $startDate;
            $types .= "s";
        }
        
        if ($endDate) {
            $sql .= " AND created_at &lt;= ?";
            $params[] = $endDate . ' 23:59:59';
            $types .= "s";
        }
        
        $sql .= " GROUP BY message_type, status ORDER BY message_type, status";
        
        $stmt = $conn->prepare($sql);
        if ($params) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
    
    public function getRecentSmsLogs($limit = 50) {
        global $conn;
        
        $stmt = $conn->prepare("
            SELECT sl.*, u.name as recipient_name 
            FROM sms_logs sl 
            LEFT JOIN users u ON sl.recipient_id = u.id 
            ORDER BY sl.created_at DESC 
            LIMIT ?
        ");
        $stmt->bind_param("i", $limit);
        $stmt->execute();
        
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
}
?>
