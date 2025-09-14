<?php
	// API endpoint to add new contacts to the database
	// expected JSON input: {"userId": int, "firstName": string, "lastName": string, "email": string, "phone": string}
	
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phone = $inData["phone"];
	$userId = $inData["userId"];

	// DATABASE CONNECTION - UPDATE THESE IF DIFFERENT:
	// Host: localhost
	// Username: TheBeast 
	// Password: WeLoveCOP4331
	// Database: COP4331
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// TABLE AND COLUMN NAMES - UPDATE IF DIFFERENT:
		// Table name: Contacts
		// Columns: UserID, FirstName, LastName, Email, Phone
		// NOTE: Verify with Hugo that these match the actual database schema
		$stmt = $conn->prepare("INSERT INTO Contacts (UserID, FirstName, LastName, Email, Phone) VALUES(?,?,?,?,?)");
		$stmt->bind_param("issss", $userId, $firstName, $lastName, $email, $phone);
		$stmt->execute();
		
		if ($stmt->affected_rows > 0) 
		{
			returnWithSuccess("Contact added successfully");
		} 
		else 
		{
			returnWithError("Failed to add contact");
		}
		
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithSuccess( $message )
	{
		$retValue = '{"message":"' . $message . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
