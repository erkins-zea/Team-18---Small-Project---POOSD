<?php
	// API endpoint to search/load contacts from the database
	// expected JSON input: {"search": string, "userId": int}
	
	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

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
		// Columns: ContactID, UserID, FirstName, LastName, EmailAddress, PhoneNumber
		$stmt = $conn->prepare("SELECT ContactID, FirstName, LastName, EmailAddress, PhoneNumber FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ? OR EmailAddress LIKE ? OR PhoneNumber LIKE ?) AND UserID = ?");
		$searchTerm = "%" . $inData["search"] . "%";
		$stmt->bind_param("ssssi", $searchTerm, $searchTerm, $searchTerm, $searchTerm, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"ID":"' . $row["ContactID"] . '","FirstName":"' . $row["FirstName"] . '","LastName":"' . $row["LastName"] . '","EmailAddress":"' . $row["EmailAddress"] . '","PhoneNumber":"' . $row["PhoneNumber"] . '"}';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
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
		$retValue = '{"results":[],"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
