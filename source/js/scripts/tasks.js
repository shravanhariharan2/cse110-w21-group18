import { TaskList } from "../index.js";

document.getElementById('add-task').addEventListener('click', TaskList.displayInputBox);

document.addEventListener('DOMContentLoaded', TaskList.loadTasks);
