#!/usr/bin/env php
<?php
/**
 * Create Admin User Script
 * Creates the initial admin user for the system
 */

require_once __DIR__ . '/../config/init.php';

echo "Creating admin user...\n";

// Admin user details
$admin_email = 'admin@example.com';
$admin_password = 'password'; // Change this in production
$admin_name = 'System Administrator';

try {
    // Check if admin already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $admin_email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo "Admin user already exists.\n";
        exit(0);
    }
    
    // Create admin user
    $hashed_password = hashPassword($admin_password);
    
    $stmt = $conn->prepare("
        INSERT INTO users (name, email, password, role, email_verified, created_at) 
        VALUES (?, ?, ?, 'admin', 1, NOW())
    ");
    $stmt->bind_param("sss", $admin_name, $admin_email, $hashed_password);
    
    if ($stmt->execute()) {
        echo "✅ Admin user created successfully!\n";
        echo "Email: $admin_email\n";
        echo "Password: $admin_password\n";
        echo "⚠️  Please change the password after first login!\n";
    } else {
        echo "❌ Failed to create admin user: " . $conn->error . "\n";
        exit(1);
    }
    
} catch (Exception $e) {
    echo "❌ Error creating admin user: " . $e->getMessage() . "\n";
    exit(1);
}
?>
