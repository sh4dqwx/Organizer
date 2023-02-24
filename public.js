const {readFileSync} = require('fs');

const homeHTML = readFileSync('public/home.html');
const homeCSS = readFileSync('public/home.css');
const homeJS = readFileSync('public/home.js');

const todolistHTML = readFileSync('public/todolist.html');

const calendarHTML = readFileSync('public/calendar.html');

const habitsHTML = readFileSync('public/habits.html');

module.exports = {
    homeHTML,
    homeCSS,
    homeJS,
    todolistHTML,
    calendarHTML,
    habitsHTML
};