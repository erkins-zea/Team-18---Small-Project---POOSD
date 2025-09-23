<?php
	// API endpoint to delete contacts from the database
	// expected JSON input: {"firstName": string, "lastName": string, "userId": int}
	
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
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
		// Columns: ContactID, UserID, FirstName, LastName
		
		// Delete contact by first name, last name, and user ID for security
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE FirstName=? AND LastName=? AND UserID=?");
		$stmt->bind_param("ssi", $firstName, $lastName, $userId);
		$stmt->execute();
		
		if ($stmt->affected_rows > 0) 
		{
			returnWithSuccess("Contact deleted successfully");
		} 
		else 
		{
			returnWithError("Contact not found or you don't have permission to delete it");
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
