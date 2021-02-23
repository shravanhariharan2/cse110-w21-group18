// add new task
const addTaskButton = document.getElementById('add-task');
addTaskButton.addEventListener('click', () => {
    document.getElementById('task-add-input').style.display = "grid";
});

// add/remove notes to/from new task
const addNotesButton = document.getElementById('add-notes');
addNotesButton.addEventListener('click', () => {
    if (addNotesButton.value === 'Add Notes') {
        document.getElementById('add-task-description').style.display = "inline";
        addNotesButton.value = 'Remove Notes';
    }
    else {
        document.getElementById('add-task-description').style.display = "none";
        addNotesButton.value = 'Add Notes'; 
    }
});

// save neww task
const saveTaskButton = document.getElementById('save-task');
saveTaskButton.addEventListener('click', () => {
    const newTask = document.createElement('task-item');
    newTask.setAttribute('name', document.getElementById('add-task-name').value);
    newTask.setAttribute('estimate', document.getElementById('pomos').value);
    newTask.setAttribute('progress', '0');
    newTask.setAttribute('notes', document.getElementById('add-task-description').value);
    newTask.setAttribute('isComplete', false);
    newTask.setAttribute('class', 'dropzone');
    newTask.setAttribute('id', document.getElementById('to-do-list').childElementCount);
    document.getElementById('task-add-input').style.display = "none";
    document.getElementById('to-do-list').prepend(newTask);
});

// dragable code taken from https://jsfiddle.net/mrinex/yLpx7etg/3/
// is trying to make new shadow dom for some reason
let dragged;
let id;
let index;
let indexDrop;
let list;

  document.addEventListener("dragstart", ({target}) => {
      dragged = target;
      id = target.id;
      list = target.parentNode.children;
      for(let i = 0; i < list.length; i += 1) {
      	if(list[i] === dragged){
          index = i;
        }
      }
  });

  document.addEventListener("dragover", (event) => {
      event.preventDefault();
  });

  document.addEventListener("drop", ({target}) => {
   if(target.className == "dropzone" && target.id !== id) {
       dragged.remove( dragged );
      for(let i = 0; i < list.length; i += 1) {
      	if(list[i] === target){
          indexDrop = i;
        }
      }
      if(index > indexDrop) {
      	target.before( dragged );
      } else {
       target.after( dragged );
      }
    }
  });
// end draggable code