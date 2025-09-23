const urlBase = "http://hugoputigna.xyz/api";
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
    
    console.log("Attempting login for user:", login);

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
    let url = urlBase + "/Login." + extension;
    
    console.log("Login URL:", url);
    console.log("Login payload:", jsonPayload);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
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
        document.getElementById("login-result").innerHTML = error.message;
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
    let url = urlBase + "/SignUp." + extension

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4)
                return;

            if (xhr.status == 409) {
                document.getElementById("signup-result").innerHTML = "User already exists";
                return;
            }

            if (xhr.status == 200) {
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
    date.setTime(date.getTime() + (minutes * 60 * 1000));
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

function showTable() {
    let x = document.querySelector(".add-contact-box")
    let contacts = document.getElementById("contacts-table")
    if (x.style.display === "none") {
        x.style.display = "flex";
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

    let temp = {
        firstName : firstname,
        lastName : lastname,
        phone : phonenumber,
        email : emailaddress,
        userId : userId,
    }

    let jsonPayload = JSON.stringify(temp);
    let url = urlBase + '/AddContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true)
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log("Contact has been added");
                document.getElementById("add-me").reset();
                loadContacts();
                showTable();
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

    let url = urlBase + "/SearchContacts." + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
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
                    "<button type='button' id='edit-button" + i + "' onclick='editRow(" + i + ")'>" + "<i class='material-symbols-outlined'>edit_square</i></button>" +
                    "<button type='button' id='save-button" + i + "' onclick='saveRow(" + i + ")' style='display: none;'>" + "<i class='material-symbols-outlined'>save</i></button>" +
                    "<button type='button' onclick='deleteRow(" + i + ")'>" + "<i class='material-symbols-outlined'>person_remove</i></button>";
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

function editRow(id) {
    document.getElementById("edit-button" + id).style.display = "none";
    document.getElementById("save-button" + id).style.display = "flex";

    let firstNameI = document.getElementById("first-name" + id);
    let lastNameI = document.getElementById("last-name" + id);
    let email = document.getElementById("email" + id);
    let phone = document.getElementById("phone" + id);

    let firstNameData = firstNameI.innerText;
    let lastNameData = lastNameI.innerText;
    let emailData = email.innerText;
    let phoneData = phone.innerText;

    firstNameI.innerHTML = "<input type='text' id='first-name-text" + id + "' value='" + firstNameData + "'>";
    lastNameI.innerHTML = "<input type='text' id='last-name-text" + id + "' value='" + lastNameData + "'>";
    email.innerHTML = "<input type='text' id='email-text" + id + "' value='" + emailData + "'>";
    phone.innerHTML = "<input type='text' id='phone-text" + id + "' value='" + phoneData + "'>";
}

function saveRow(id) {
    let firstNameVal = document.getElementById("first-name-text" + id).value;
    let lastNameVal = document.getElementById("last-name-text" + id).value;
    let emailVal = document.getElementById("email-text" + id).value;
    let phoneVal = document.getElementById("phone-text" + id).value;
    let idVal = ids[id]

    document.getElementById("first-name" + id).innerHTML = firstNameVal;
    document.getElementById("last-name" + id).innerHTML = lastNameVal;
    document.getElementById("email" + id).innerHTML = emailVal;
    document.getElementById("phone" + id).innerHTML = phoneVal;

    document.getElementById("edit-button" + id).style.display = "flex";
    document.getElementById("save-button" + id).style.display = "none";

    let temp = {
        phoneNumber: phoneVal,
        emailAddress: emailVal,
        newFirstName: firstNameVal,
        newLastName: lastNameVal,
        id: idVal
    };

    let jsonPayload = JSON.stringify(temp);
    let url = urlBase + "/UpdateContacts." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log("Contact has been updated");
                loadContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (error) {
        console.log(error.message);
    }
}

function deleteRow(id) {
    let firstNameVal = document.getElementById("first-name" + id).innerText;
    let lastNameVal = document.getElementById("last-name" + id).innerText;
    nameOne = firstNameVal.substring(0, firstNameVal.length);
    nameTwo = lastNameVal.substring(0, lastNameVal.length);
    let check = confirm(`Are you sure you want to delete ${nameOne} ${nameTwo}?`);

    if (check) {
        document.getElementById("row" + id + "").outerHTML = "";
        let temp = {
            firstName : nameOne,
            lastName : nameTwo,
            userId : userId,
        };

        let jsonPayload = JSON.stringify(temp);
        let url = urlBase + '/DeleteContacts.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    console.log("Contact has been deleted");
                    loadContacts();
                }
            };
            xhr.send(jsonPayload);
        } catch (error) {
            console.log(error.message);
        }
    }
}

function searchContacts() {
    const content = document.getElementById("search-text");
    const selections = content.value.toUpperCase().split(' ');
    const table = document.getElementById("contacts-table");
    const tr = table.getElementsByTagName("tr");

    for (let i = 0; i < tr.length; i++) {
        const tdFirstName = tr[i].getElementsByTagName("td")[0];
        const tdLastName = tr[i].getElementsByTagName("td")[1];

        if (tdFirstName && tdLastName) {
            const textValueFirstName = tdFirstName.textContent || tdFirstName.innerText;
            const textValueLastName = tdLastName.textContent || tdLastName.innerText;
            tr[i].style.display = "none";

            for (const selection of selections) {
                if (textValueFirstName.toUpperCase().indexOf(selection) > -1)
                    tr[i].style.display = "";

                if (textValueLastName.toUpperCase().indexOf(selection) > -1)
                    tr[i].style.display = "";
            }
        }
    }
}

// Validation functions (you may need to implement these)
function validLoginForm(login, password) {
    return login.length > 0 && password.length > 0;
}

function validSignUpForm(firstName, lastName, username, password) {
    return firstName.length > 0 && lastName.length > 0 && username.length > 0 && password.length > 0;
}

function validAddContact(firstName, lastName, phone, email) {
    return firstName.length > 0 && lastName.length > 0 && phone.length > 0 && email.length > 0;
}
