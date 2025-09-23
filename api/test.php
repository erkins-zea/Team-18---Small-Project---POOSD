<?php
// Simple test to verify PHP is working
echo "PHP is working!<br>";

// Test database connection
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) {
    echo "Database connection failed: " . $conn->connect_error;
} else {
    echo "Database connection successful!<br>";
    
    // Test if Users table exists
    $result = $conn->query("SHOW TABLES LIKE 'Users'");
    if ($result->num_rows > 0) {
        echo "Users table exists!<br>";
        
        // Count users
        $result = $conn->query("SELECT COUNT(*) as count FROM Users");
        $row = $result->fetch_assoc();
        echo "Number of users: " . $row['count'] . "<br>";
    } else {
        echo "Users table does not exist!<br>";
    }
    
    // Test if Contacts table exists
    $result = $conn->query("SHOW TABLES LIKE 'Contacts'");
    if ($result->num_rows > 0) {
        echo "Contacts table exists!<br>";
        
        // Count contacts
        $result = $conn->query("SELECT COUNT(*) as count FROM Contacts");
        $row = $result->fetch_assoc();
        echo "Number of contacts: " . $row['count'] . "<br>";
    } else {
        echo "Contacts table does not exist!<br>";
    }
}

$conn->close();
?>
