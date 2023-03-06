const form = document.querySelector(".form");
const errorMessages = document.getElementById("error-messages");
const loginInput = document.getElementById("login");
const passwordInput = document.getElementById("password");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    
    try {
        fetch("/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                "login": loginInput.value,
                "password": passwordInput.value
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.messages[0] === "Poprawne logowanie") {
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
    } catch(error) {
        console.log(error);
    }
});