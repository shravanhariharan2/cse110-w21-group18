import TaskList from '../services/TaskList.js';

const TASK = new TaskList();

document.getElementById('add-task').addEventListener('click', TASK.displayInputBox);

document.addEventListener('DOMContentLoaded', TASK.loadTasks)
