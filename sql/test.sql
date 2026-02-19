-- Create the users database
CREATE DATABASE IF NOT EXISTS users_db;
USE users_db;

-- Create the registered_users table
CREATE TABLE registered_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    time_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    session_token VARCHAR(255) UNIQUE,
    INDEX idx_email (email),
    INDEX idx_session_token (session_token),
    INDEX idx_time_created (time_created)
);

-- Example inserts (optional)
INSERT INTO registered_users (firstname, lastname, email, phone_number, ip_address, session_token) 
VALUES 
('John', 'Doe', 'john.doe@example.com', '+1-555-0123', '192.168.1.1', 'token_abc123xyz789'),
('Jane', 'Smith', 'jane.smith@example.com', NULL, '192.168.1.2', 'token_def456uvw012'),
('Bob', 'Johnson', 'bob.johnson@example.com', '+1-555-0456', '192.168.1.3', 'token_ghi789rst345');

-- View the table structure
DESCRIBE registered_users;

-- View the sample data
SELECT * FROM registered_users;