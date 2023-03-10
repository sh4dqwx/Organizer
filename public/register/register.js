const form = document.querySelector(".form");
const errorMessages = document.getElementById("error-messages");
const email = document.getElementById("email");
const login = document.getElementById("login");
const password = document.getElementById("password");
const repeatPassword = document.getElementById("repeat-password");

const handleResponse = (response) => {
    return new Promise((resolve, reject) => {
        if(response.status === 400)
            response.json()
            .then(data => reject(data));
        else resolve(response);
    })
}

form.addEventListener("submit", async(event) => {
    event.preventDefault();

    fetch("/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            "email": email.value,
            "login": login.value,
            "password": password.value,
            "repeatPassword": repeatPassword.value
        })
    })
    .then(response => handleResponse(response))
    .then(response => window.location.href = response.url)
    .catch(error => {
        let tmp = "";
        console.log(error);
        error.error.forEach(message => {
            tmp += message + '<br>';
        });
        errorMessages.innerHTML = tmp;
    });
});