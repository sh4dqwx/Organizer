const returnBtn = document.getElementById("return-btn");
const logoutBtn = document.getElementById("logout-btn");
const categoryList = document.getElementById("category-list");
const taskList = document.getElementById("task-list");

fetch("/todolist/tasks")
.then(response => response.json())
.then(data => {
    let categoryString = categoryList.innerHTML;
    data.categories.forEach(category => {
        categoryString += `<div class="category" style="background-color: ${category.color}">
        <input type="radio" name="category">
        <label>${category.name}</label>
        </div>`;
    });
    categoryList.innerHTML = categoryString;

    if(data.tasks.length === 0)
        taskList.innerHTML = "<p>Brak zadań</p>"
    else {
        let taskString = "";
        data.tasks.forEach(task => {
            taskString += `<div class="task">
            <p>${task.content}</p>
            </div>`;
        });
        taskList.innerHTML = taskString;
    }
})
.catch(error => console.log(error));

returnBtn.addEventListener("click", () => {
    fetch("/home")
    .then(response => window.location.href = response.url)
    .catch(error => console.log(error));
});

logoutBtn.addEventListener("click", () => {
    fetch("/logout")
    .then(response => window.location.href = response.url)
    .catch(error => console.log(error));
});