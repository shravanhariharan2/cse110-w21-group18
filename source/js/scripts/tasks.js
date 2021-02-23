// add new task
let addTaskButton = document.getElementById('add-task');
addTaskButton.addEventListener('click', () => {
    document.getElementById('task-add-input').style.display = "grid";
});

//add/remove notes to/from new task
let addNotesButton = document.getElementById('add-notes');
addNotesButton.addEventListener('click', () => {
    if(addNotesButton.value == 'Add Notes'){
        document.getElementById('add-task-description').style.display = "inline";
        addNotesButton.value = 'Remove Notes';
    }
    else{
        document.getElementById('add-task-description').style.display = "none";
        addNotesButton.value = 'Add Notes';
        
    }
});
//save neww task
let saveTaskButton = document.getElementById('save-task');
saveTaskButton.addEventListener('click', () => {
    let newTask = document.createElement('task-item');
    newTask.setAttribute('name', document.getElementById('add-task-name').value);
    newTask.setAttribute('estimate', document.getElementById('pomos').value);
    newTask.setAttribute('progress', '0');
    newTask.setAttribute('notes', document.getElementById('add-task-description').value);
    newTask.setAttribute('isComplete', false);
    document.getElementById('task-add-input').style.display = "none";
    document.getElementById('task-list').prepend(newTask);
});
