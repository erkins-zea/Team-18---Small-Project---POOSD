<?php
// Test database connection
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) {
    $response = array(
        "success" => false,
        "error" => $conn->connect_error,
        "message" => "Database connection failed"
    );
} else {
    // Test if Users table exists
    $result = $conn->query("SHOW TABLES LIKE 'Users'");
    if ($result->num_rows > 0) {
        $response = array(
            "success" => true,
            "message" => "Database connection successful and Users table exists"
        );
    } else {
        $response = array(
            "success" => false,
            "message" => "Database connected but Users table not found"
        );
    }
}

header('Content-type: application/json');
echo json_encode($response);
$conn->close();
?>
