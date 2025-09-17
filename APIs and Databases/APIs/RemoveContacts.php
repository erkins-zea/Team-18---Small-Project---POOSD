<?php
	// API endpoint to remove/delete contacts from the database
	// expected JSON input: {"contactId": int, "userId": int}
	
	$inData = getRequestInfo();
	
	$contactId = $inData["contactId"];
	$userId = $inData["userId"];

	// DATABASE CONNECTION - UPDATE THESE IF DIFFERENT:
	// host: localhost
	// username: TheBeast 
	// password: WeLoveCOP4331
	// database: COP4331
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// TABLE AND COLUMN NAMES - UPDATE IF DIFFERENT:
		// table name: Contacts
		// columns: ContactID (or ID), UserID
    
		// verify with database that these match the actual database schema
    
		// only delete contacts that belong to the requesting user
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ContactID = ? AND UserID = ?");
		$stmt->bind_param("ii", $contactId, $userId);
		$stmt->execute();
		
		if ($stmt->affected_rows > 0) 
		{
			returnWithSuccess("Contact removed successfully");
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
