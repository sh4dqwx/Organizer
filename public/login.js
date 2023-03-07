const form = document.querySelector(".form");
const errorMessages = document.getElementById("error-messages");
const loginInput = document.getElementById("login");
const passwordInput = document.getElementById("password");

const handleResponse = (response) => {
    return new Promise((resolve, reject) => {
        if(response.status === 400)
            reject(response.json());
        else resolve();
    })
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    fetch("/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            "login": loginInput.value,
            "password": passwordInput.value
        })
    })
    .then(response => handleResponse(response))
    .then(() => errorMessages.innerHTML = "")
    .catch(error => {
        let tmp = "";
        error.messages.forEach(message => {
            tmp += message + '<br>';
        });
        errorMessages.innerHTML = tmp;
    });
});