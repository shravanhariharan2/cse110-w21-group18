/**
 * Implements the TaskList class. This class is a controller for the task list which
 * holds all the task items and the to-do lists and completed lists
 */
class TaskList {
  constructor() {

    this.numTasks = 0;
    this.displayInputBox = this.displayInputBox.bind(this);
    this.addNotesToTask = this.addNotesToTask.bind(this);
    this.addTask = this.addTask.bind(this);
    this.listChanged = this.listChanged.bind(this);
    this.cancelInput = this.cancelInput.bind(this);

    this.DOM_ELEMENTS = {
      addTaskButton: document.getElementById('add-task'),
      inputBox: document.getElementById('task-add-input'),
      addNotesButton: document.getElementById('add-notes'),
      newTaskNotes: document.getElementById('add-task-description'),
      newTaskName: document.getElementById('add-task-name'),
      newTaskPomos: document.getElementById('pomos'),
      taskList: document.getElementById('to-do-list'),
      saveNewTaskButton: document.getElementById('save-task'),
      noTasks: document.getElementById('no-tasks'),
      cancelButton: document.getElementById('cancel-input')
    };

    this.DOM_ELEMENTS.addTaskButton.addEventListener('click', this.displayInputBox);
    this.DOM_ELEMENTS.addNotesButton.addEventListener('click', this.addNotesToTask);
    this.DOM_ELEMENTS.saveNewTaskButton.addEventListener('click', this.addTask);
    this.DOM_ELEMENTS.taskList.addEventListener('DOMSubtreeModified', this.listChanged);
    this.DOM_ELEMENTS.cancelButton.addEventListener('click', this.cancelInput);
    this.makeTasksDraggable();
  }

  /**
   * Called when a Task is removed from the task-list
   * Had to be done here because the remove method is in the individual task
   */
  listChanged(){
    this.updateIds();
    this.numTasks = this.DOM_ELEMENTS.taskList.childElementCount;
    this.ifTasksExist();
  }

  cancelInput(){
    this.DOM_ELEMENTS.inputBox.style.display = 'none';
    this.resetInputBox();
  }
  ifTasksExist(){
    if(this.numTasks != 0){
      this.DOM_ELEMENTS.noTasks.style.display = "none";
      return;
    }
    this.DOM_ELEMENTS.noTasks.style.display = "block";
  }

  /**
   *  Displays input box for user to input a task
   */
   displayInputBox() {
      this.DOM_ELEMENTS.inputBox.style.display = "grid";
  }

  /**
   * Add/remove notes to/from new task input
   */
  addNotesToTask(){
        if (this.DOM_ELEMENTS.addNotesButton.value === 'Add Notes') {
          this.DOM_ELEMENTS.newTaskNotes.style.display = "inline";
          this.DOM_ELEMENTS.addNotesButton.value = 'Remove Notes';
        }
        else {
          this.DOM_ELEMENTS.newTaskNotes.style.display = "none";
          this.DOM_ELEMENTS.addNotesButton.value = 'Add Notes'; 
        }
  }

  /**
   * Adds new task-item to the to-do list based on whats in the input box
   */
  addTask() {
    this.updateIds();
      const newTask = document.createElement('task-item');
      newTask.setAttribute('name', this.DOM_ELEMENTS.newTaskName.value);
      newTask.setAttribute('estimate', this.DOM_ELEMENTS.newTaskPomos.value);
      newTask.setAttribute('progress', '0');
      newTask.setAttribute('notes', this.DOM_ELEMENTS.newTaskNotes.value);
      newTask.setAttribute('isComplete', false);
      newTask.setAttribute('class', 'dropzone');
      newTask.setAttribute('id', this.numTasks);
      this.DOM_ELEMENTS.inputBox.style.display = "none";
      this.DOM_ELEMENTS.taskList.prepend(newTask);
      this.resetInputBox();
  }

  /**
   * Resets the input box back to empty
   */
  resetInputBox(){
    this.DOM_ELEMENTS.newTaskNotes.style.display = "none";
    this.DOM_ELEMENTS.addNotesButton.value = 'Add Notes'; 
    this.DOM_ELEMENTS.newTaskNotes.value = '';
    this.DOM_ELEMENTS.newTaskName.value = '';
    this.DOM_ELEMENTS.newTaskPomos.value = '?';
  }

  /**
   * Make the tasks in the list draggable
   * Code taken from https://jsfiddle.net/mrinex/yLpx7etg/3/
   */
  makeTasksDraggable(){
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
        this.updateIds();
      });
      
  }
  
  /**
   * Change the ID's of task-items when they get dragged around so that the top
   * is the highest number ID
   */
  updateIds(){
    const children = Array.from(this.DOM_ELEMENTS.taskList.children);
    children.forEach((element) => {
      element.id = this.DOM_ELEMENTS.taskList.childElementCount - Array.from(element.parentNode.children).indexOf(element);
    }); 
  }
  markTaskAsComplete(taskId) {}

  incrementPomodoroCount(taskId) {}
}

export default TaskList;