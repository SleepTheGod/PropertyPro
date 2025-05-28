#!/usr/bin/env php
<?php
/**
 * Database Backup Script
 * Creates automated backups of the property management database
 * 
 * Run daily via cron: 0 2 * * * /usr/bin/php /path/to/scripts/backup_database.php
 */

require_once __DIR__ . '/../config/init.php';

echo "Starting database backup...\n";

// Create backup directory if it doesn't exist
$backup_dir = __DIR__ . '/../backups';
if (!is_dir($backup_dir)) {
    mkdir($backup_dir, 0755, true);
}

// Generate backup filename with timestamp
$timestamp = date('Y-m-d_H-i-s');
$backup_file = $backup_dir . '/property_management_backup_' . $timestamp . '.sql';

// Database connection details
$host = DB_HOST;
$username = DB_USER;
$password = DB_PASS;
$database = DB_NAME;

// Create mysqldump command
$command = "mysqldump --host={$host} --user={$username} --password={$password} --single-transaction --routines --triggers {$database} > {$backup_file}";

// Execute backup
$output = [];
$return_code = 0;
exec($command, $output, $return_code);

if ($return_code === 0) {
    echo "Database backup created successfully: {$backup_file}\n";
    
    // Compress the backup
    $compressed_file = $backup_file . '.gz';
    exec("gzip {$backup_file}", $output, $return_code);
    
    if ($return_code === 0) {
        echo "Backup compressed: {$compressed_file}\n";
        $backup_file = $compressed_file;
    }
    
    // Get file size
    $file_size = filesize($backup_file);
    $file_size_mb = round($file_size / 1024 / 1024, 2);
    echo "Backup size: {$file_size_mb} MB\n";
    
    // Log backup
    global $conn;
    $stmt = $conn->prepare("
        INSERT INTO backup_logs (backup_type, file_path, file_size, status, created_at) 
        VALUES ('database', ?, ?, 'completed', NOW())
    ");
    $stmt->bind_param("si", $backup_file, $file_size);
    $stmt->execute();
    
    // Clean up old backups (keep last 30 days)
    $old_backups = glob($backup_dir . '/property_management_backup_*.sql*');
    $cutoff_time = time() - (30 * 24 * 60 * 60); // 30 days ago
    
    foreach ($old_backups as $old_backup) {
        if (filemtime($old_backup) < $cutoff_time) {
            unlink($old_backup);
            echo "Deleted old backup: " . basename($old_backup) . "\n";
        }
    }
    
} else {
    echo "Database backup failed!\n";
    echo "Error output: " . implode("\n", $output) . "\n";
    
    // Log failed backup
    global $conn;
    $stmt = $conn->prepare("
        INSERT INTO backup_logs (backup_type, file_path, status, error_message, created_at) 
        VALUES ('database', ?, 'failed', ?, NOW())
    ");
    $error_message = implode("\n", $output);
    $stmt->bind_param("ss", $backup_file, $error_message);
    $stmt->execute();
}

echo "Database backup process completed.\n";
?>
