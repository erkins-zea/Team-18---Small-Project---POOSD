const urlBase = "placeholderURL";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";
const ids = [];

function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("login-user").value;
    let password = document.getElementById("login-password").value;

    let hash = md5(password)

    if (!validLoginForm(login, password)) {
        document.getElementById("login-result").innerHTML = "Invalid username or password";
        return;
    }

    document.getElementById("login-result").innerHTML = "";

    let temp = {
        login : login,
        password : hash,
    };

    let jsonPayload = JSON.stringify(temp);
    let url = urlBase + "/Login." + extension; // Remember to rename if .php filename is different

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = () => {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    document.getElementById("login-result").innerHTML = "User/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "contacts.html";
            }
        };
        xhr.send(jsonPayload);
    } catch (error) {
        document.getElementById("loginResult").innerHTML = error.message;
    }
}

function doSignup() {
    firstName = document.getElementById("signup-first-name").value;
    lastName = document.getElementById("signup-last-name").value;

    let username = document.getElementById("signup-user").value;
    let password = document.getElementById("signup-password").value;

    if (!validSignUpForm(firstName, lastName, username, password)) {
        document.getElementById("signup-result").innerHTML = "Invalid signup";
        return;
    }

    let hash = md5(password)

    document.getElementById("signup-result").innerHTML = "";

    let temp = {
        firstName : firstName,
        lastName : lastName,
        login : username,
        password : hash,
    };

    let jsonPayload = JSON.stringify(temp)
    let url = urlBase + "/SignUp." + extension // Replace name sure whatever

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = () => {
            if (this.readyState != 4)
                return;

            if (this.status == 409) {
                document.getElementById("signup-result").innerHTML = "User already exists";
                return;
            }

            if (this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
                document.getElementById("signup-result").innerHTML = "User added";
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
                saveCookie();
            }
        };
        xhr.send(jsonPayload);
    } catch (error) {
        document.getElementById("signup-result").innerHTML = error.message;
    }
}

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime + (minutes * 60 * 1000));
    document.cookie = `firstName=${firstName},lastName=${lastName},userId=${userId};expires=${date.toGMTString()}`;
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(',')

    for (let i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");

		if (tokens[0] == "firstName")
			firstName = tokens[1];
		else if (tokens[0] == "lastName")
			lastName = tokens[1];
		else if (tokens[0] == "userId")
			userId = parseInt(tokens[1].trim());
    }

    if (userId < 0)
        window.location.href = "index.html"
    else
        document.getElementById("user-name").innerHTML = `Welcome, ${firstName} ${lastName}!`;
}

function doLogout() {
    userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// This function is probably going to have to be changed quite a bit
function showTable() {
    let x = document.getElementById("add-me");
    let contacts = document.getElementById("contacts-table")
    if (x.style.display === "none") {
        x.style.display = "block";
        contacts.style.display = "none";
    } 
    else {
        x.style.display = "none";
        contacts.style.display = "block";
    }
}

function addContact() {
    let firstname = document.getElementById("contact-text-first").value;
    let lastname = document.getElementById("contact-text-last").value;
    let phonenumber = document.getElementById("contact-text-number").value;
    let emailaddress = document.getElementById("contact-text-email").value;

    if (!validAddContact(firstname, lastname, phonenumber, emailaddress)) {
        console.log("INVALID FIRST NAME, LAST NAME, PHONE, OR EMAIL SUBMITTED");
        return;
    }

    let temp = {
        firstName : firstname,
        lastName : lastname,
        phoneNumber : phonenumber,
        emailAddress : emailaddress,
        userId : userId,
    }

    let jsonPayload = JSON.stringify(temp);
    let url = urlBase + '/AddContacts.' + extension; // Remember to rename if .php filename is different
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true)
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = () => {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been added");
                document.getElementById("add-me").reset(); // Clear form input
                loadContacts(); // Reload contacts
                showTable(); // Switch view to show, this whole part might be unnecessary since I may just decide not to hide the table when adding a contact
            }
        };
        xhr.send(jsonPayload)
    } catch (error) {
        console.log(error.message);
    }
}

function loadContacts() {
    let temp = {
        search : "",
        userId : userId,
    };

    let jsonPayload = JSON.stringify(temp);

    let url = urlBase + "/SearchContacts." + extension; // Remember to change yeah yeah yeah
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = () => {
            if (this.readyState == 4 && this.readyState == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }

                let text = "<table>"
                for (let i = 0; i < jsonObject.results.length; i++) {
                    ids[i] = jsonObject.results[i].ID
                    text += "<tr id='row" + i + "'>"
                    text += "<td id='first-name" + i + "'><span>" + jsonObject.results[i].FirstName + "</span></td>";
                    text += "<td id='last-name" + i + "'><span>" + jsonObject.results[i].LastName + "</span></td>";
                    text += "<td id='email" + i + "'><span>" + jsonObject.results[i].EmailAddress + "</span></td>";
                    text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].PhoneNumber + "</span></td>";
                    text += "<td>" +
                    "<button type='button' id='edit-button" + i + "'>" + "<i class='material-symbols-outlined'>edit_square</i> + </button>" +
                    // TODO: Add save button here
                    "<button type='button' onclick='deleteRow(" + i + ")'>" + "<i class='material-symbols-outlined'>person_remove</i> + </button>";
                    text += "</tr>";
                }
                text += "</table>";
                document.getElementById("tbody").innerHTML = text;
            }
        };
        xhr.send(jsonPayload);
    } catch (error) {
        console.log(error.message);
    }
}