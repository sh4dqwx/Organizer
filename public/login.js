const form = document.querySelector(".form");
const loginInput = document.getElementById("login");
const passwordInput = document.getElementById("password");

form.addEventListener("submit", async(event) => {
    event.preventDefault();
    
    fetch("/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            "nickname": loginInput.value,
            "password": passwordInput.value
        })
    });
});