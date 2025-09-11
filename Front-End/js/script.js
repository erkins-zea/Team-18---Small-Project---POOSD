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

    // TODO: Declare md5 hash here

    if (!validLoginForm(login, password)) {
        document.getElementById("login-result").innerHTML = "Invalid username or password";
        return;
    }

    document.getElementById("login-result").innerHTML = "";

    let temp = {
        login : login,
        password : password, // Remember to replace with hash
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

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}