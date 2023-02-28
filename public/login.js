const formButton = document.getElementById("form-button");
const loginInput = document.getElementById("login");
const passwordInput = document.getElementById("password");

formButton.addEventListener("click", () => {
    console.log(loginInput.value);
});