import Controllers from '../index.js';

const TaskList = Controllers.taskList();

document.getElementById('add-task').addEventListener('click', TaskList.displayInputBox);
document.getElementById('add-notes').addEventListener('click', TaskList.addNotesToTask);
document.getElementById('save-task').addEventListener('click', TaskList.addTask);
document.getElementById('to-do-list').addEventListener('DOMSubtreeModified', TaskList.listChanged);
document.getElementById('completed-list').addEventListener('DOMSubtreeModified', TaskList.listChanged);
document.getElementById('cancel-input').addEventListener('click', TaskList.cancelInput);
document.getElementById('expand-completed').addEventListener('click', TaskList.expandCompletedTasks);
document.getElementById('view-all').style.display = 'none';
document.getElementById('completed-list').style.display = 'none';

document.addEventListener('DOMContentLoaded', TaskList.loadTasks);

TaskList.makeTasksDraggable();
TaskList.hideCompletedIfNoTasksExist();
