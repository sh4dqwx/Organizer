const formButton = document.getElementById("form-button");
const loginInput = document.getElementById("login");
const passwordInput = document.getElementById("password");

formButton.addEventListener("click", async() => {
    try {
        const user = {
            "nickname": loginInput.value,
            "password": passwordInput.value
        };
        await fetch("/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(user)
        })
            .then(response => response.json)
            .then(data => console.log(data))
            .catch(err => console.log(err));
    } catch(err) {
        console.log(err);
    }
});