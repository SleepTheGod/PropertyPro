-- Rent Reminder Cron Job Script
-- This script should be run daily to send rent reminders

-- Create a stored procedure for rent reminders
DELIMITER //

CREATE PROCEDURE SendRentReminders()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE tenant_id INT;
    DECLARE tenant_name VARCHAR(255);
    DECLARE tenant_email VARCHAR(255);
    DECLARE rent_amount DECIMAL(10,2);
    DECLARE rent_due_day INT;
    DECLARE days_until_due INT;
    
    -- Cursor to get tenants whose rent is due soon
    DECLARE tenant_cursor CURSOR FOR
        SELECT 
            t.id,
            u.name,
            u.email,
            t.rent_amount,
            t.rent_due_day,
            DATEDIFF(
                DATE(CONCAT(YEAR(CURDATE()), '-', MONTH(CURDATE()), '-', t.rent_due_day)),
                CURDATE()
            ) as days_until_due
        FROM tenants t
        JOIN users u ON t.user_id = u.id
        WHERE t.status = 'active'
        AND DATEDIFF(
            DATE(CONCAT(YEAR(CURDATE()), '-', MONTH(CURDATE()), '-', t.rent_due_day)),
            CURDATE()
        ) IN (7, 3, 1); -- Send reminders 7, 3, and 1 days before due date
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN tenant_cursor;
    
    read_loop: LOOP
        FETCH tenant_cursor INTO tenant_id, tenant_name, tenant_email, rent_amount, rent_due_day, days_until_due;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Check if reminder was already sent for this period
        IF NOT EXISTS (
            SELECT 1 FROM sms_logs 
            WHERE recipient_id = (SELECT user_id FROM tenants WHERE id = tenant_id)
            AND message_type = 'payment_reminder'
            AND DATE(created_at) = CURDATE()
        ) THEN
            -- Insert reminder task (to be processed by PHP script)
            INSERT INTO reminder_queue (tenant_id, reminder_type, due_date, created_at)
            VALUES (tenant_id, 'rent_reminder', 
                DATE(CONCAT(YEAR(CURDATE()), '-', MONTH(CURDATE()), '-', rent_due_day)),
                NOW());
        END IF;
        
    END LOOP;
    
    CLOSE tenant_cursor;
END //

DELIMITER ;

-- Call the procedure
CALL SendRentReminders();
