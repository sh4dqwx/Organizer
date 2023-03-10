const {readFileSync} = require("fs");

const loginHTML = readFileSync("public/login/login.html");
const loginCSS = readFileSync("public/login/login.css");
const loginJS = readFileSync("public/login/login.js");

const registerHTML = readFileSync("public/register/register.html");
const registerCSS = readFileSync("public/register/register.css");
const registerJS = readFileSync("public/register/register.js");

const homeHTML = readFileSync("public/home/home.html");
const homeCSS = readFileSync("public/home/home.css");
const homeJS = readFileSync("public/home/home.js");

const todolistHTML = readFileSync("public/todolist/todolist.html");

const calendarHTML = readFileSync("public/calendar/calendar.html");

const habitsHTML = readFileSync("public/habits/habits.html");

module.exports = {
    loginHTML,
    loginCSS,
    loginJS,
    registerHTML,
    registerCSS,
    registerJS,
    homeHTML,
    homeCSS,
    homeJS,
    todolistHTML,
    calendarHTML,
    habitsHTML
};