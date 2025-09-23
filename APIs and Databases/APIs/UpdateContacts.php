<?php
	$inData = getRequestInfo();
	
	$contactId = $inData["id"];
	$newFirstName = $inData["newFirstName"];
	$newLastName = $inData["newLastName"];
	$emailAddress = $inData["emailAddress"];
	$phoneNumber = $inData["phoneNumber"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, EmailAddress=?, PhoneNumber=? WHERE ContactID=?");
		$stmt->bind_param("ssssi", $newFirstName, $newLastName, $emailAddress, $phoneNumber, $contactId);
		$stmt->execute();
		
		if ($stmt->affected_rows > 0) 
		{
			returnWithSuccess("Contact updated successfully");
		} 
		else 
		{
			returnWithError("Failed to update contact or contact not found");
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
