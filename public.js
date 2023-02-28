const {readFileSync} = require("fs");

const loginHTML = readFileSync("public/login.html");
const loginCSS = readFileSync("public/login.css");
const loginJS = readFileSync("public/login.js");

const registerHTML = readFileSync("public/register.html");

const homeHTML = readFileSync("public/home.html");
const homeCSS = readFileSync("public/home.css");
const homeJS = readFileSync("public/home.js");

const todolistHTML = readFileSync("public/todolist.html");

const calendarHTML = readFileSync("public/calendar.html");

const habitsHTML = readFileSync("public/habits.html");

module.exports = {
    loginHTML,
    loginCSS,
    loginJS,
    registerHTML,
    homeHTML,
    homeCSS,
    homeJS,
    todolistHTML,
    calendarHTML,
    habitsHTML
};