-- Create backup logs table
CREATE TABLE IF NOT EXISTS backup_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    backup_type ENUM('database', 'files', 'full') NOT NULL,
    file_path VARCHAR(500),
    file_size BIGINT,
    status ENUM('completed', 'failed', 'in_progress') NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_type (backup_type),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);
