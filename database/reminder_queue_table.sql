-- Create reminder queue table for cron job processing
CREATE TABLE IF NOT EXISTS reminder_queue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    reminder_type ENUM('rent_reminder', 'late_fee_notice', 'maintenance_update') NOT NULL,
    due_date DATE,
    processed BOOLEAN DEFAULT FALSE,
    processed_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_processed (processed),
    INDEX idx_type (reminder_type),
    INDEX idx_created (created_at)
);
