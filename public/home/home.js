const title = document.getElementById("title");
const todolist = document.getElementById("todolist-list");
const calendar = document.getElementById("calendar-list");
const habits = document.getElementById("habits-list");
const logoutBtn = document.getElementById("logout-btn");

fetch("/home/tasks")
.then(response => response.json())
.then(data => {
    title.innerHTML = `<h1>Witaj ${data.login}, dziś jest ${data.currentDate}</h1>`;
    if(data.tasks.length === 0) {
        todolist.innerHTML = "<p>Brak zadań</p>";
    } else {
        let list = "";
        data.tasks.forEach(task => {
            list += `<div class="task">
            <input type="radio">
            <label>${task.content}</label>
            </div>`;
        });
        todolist.innerHTML = list;
    }

    if(data.calendarTasks.length === 0) {
        calendar.innerHTML = "<p>Brak zadań</p>";
    } else {
        let list = "";
        data.calendarTasks.forEach(task => {
            list += `<div class="task">
            <input type="radio">
            <label>${task.content}</label>
            </div>`;
        });
        calendar.innerHTML = list;
    }

    if(data.habitTasks.length === 0) {
        habits.innerHTML = "<p>Brak zadań</p>";
    } else {
        let list = "";
        data.habitTasks.forEach(task => {
            list += `<div class="task">
            <input type="radio">
            <label>${task.content}</label>
            </div>`;
        });
        habits.innerHTML = list;
    }
})
.catch(error => console.log(error));

logoutBtn.addEventListener("click", () => {
    fetch("/logout")
    .then(response => window.location.href = response.url)
    .catch(error => console.log(error));
});