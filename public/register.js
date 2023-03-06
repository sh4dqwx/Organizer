const form = document.querySelector(".form");
const errorMessages = document.getElementById("error-messages");
const email = document.getElementById("email");
const login = document.getElementById("login");
const password = document.getElementById("password");
const repeatPassword = document.getElementById("repeat-password");

form.addEventListener("submit", async(event) => {
    event.preventDefault();

    try {
        fetch("/register", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                "email": email.value,
                "nickname": login.value,
                "password": password.value,
                "repeatPassword": repeatPassword.value
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.messages[0] === "Dodano użytkownika") {
                window.location.href = "/home";
            } else {
                let tmp = "";
                data.messages.forEach(message => {
                    tmp += message + '<br>';
                });
                errorMessages.innerHTML = tmp;
            }
        })
        .catch(error => console.log(error));
    } catch(err) {
        console.log(err);
    }
});