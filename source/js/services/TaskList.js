/**
 * Implements the TaskList class. This class is a controller for the task list which
 * holds all the task items and the to-do lists and completed lists
 */
class TaskList {
  constructor() {
    this.numTasks = 0;
    this.isLoaded = false; // make sure nothing else runs while loading

    this.displayInputBox = this.displayInputBox.bind(this);
    this.addNotesToTask = this.addNotesToTask.bind(this);
    this.addTask = this.addTask.bind(this);
    this.listChanged = this.listChanged.bind(this);
    this.cancelInput = this.cancelInput.bind(this);
    this.loadTasks = this.loadTasks.bind(this);

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
      cancelButton: document.getElementById('cancel-input'),
    };

    this.DOM_ELEMENTS.addTaskButton.addEventListener('click', this.displayInputBox);
    this.DOM_ELEMENTS.addNotesButton.addEventListener('click', this.addNotesToTask);
    this.DOM_ELEMENTS.saveNewTaskButton.addEventListener('click', this.addTask);
    this.DOM_ELEMENTS.taskList.addEventListener('DOMSubtreeModified', this.listChanged);
    this.DOM_ELEMENTS.cancelButton.addEventListener('click', this.cancelInput);
    this.makeTasksDraggable();
  }

  /**
   * Loads the tasks saved in sessionStorage back in the order that they were in previously
   */
  loadTasks() {
    this.isLoaded = false;

    for (let i = 0; i < sessionStorage.length; i += 1) {
      const key = sessionStorage.key(i);
      const isTaskItemKey = parseInt(key, 10) > 0 && parseInt(key, 10) <= sessionStorage.getItem('numTasks');
      if (isTaskItemKey) {
        const taskObj = JSON.parse(sessionStorage.getItem(key));
        const newTask = document.createElement('task-item');
        newTask.setAttribute('name', taskObj.name);
        newTask.setAttribute('estimate', taskObj.estimate);
        newTask.setAttribute('progress', taskObj.progress);
        newTask.setAttribute('notes', taskObj.notes);
        newTask.setAttribute('isComplete', taskObj.isComplete);
        newTask.setAttribute('class', taskObj.class);
        newTask.setAttribute('id', taskObj.id);
        newTask.setAttribute('isDraggable', taskObj.isDraggable);
        this.DOM_ELEMENTS.taskList.appendChild(newTask);
      }
    }

    for (let i = 1; i <= sessionStorage.getItem('numTasks'); i += 1) {
      this.DOM_ELEMENTS.taskList.prepend(document.getElementById(i));
    }

    this.isLoaded = true;
    this.numTasks = this.DOM_ELEMENTS.taskList.childElementCount;
    this.displayMessageIfNoTasksExist();
  }

  /**
   * Called when a Task is removed from the task-list
   * Had to be done here because the remove method is in the individual task
   * Does not run if the elements are being loaded in
   */
  listChanged() {
    if (this.isLoaded) {
      this.refreshTaskItemIds();
      this.numTasks = this.DOM_ELEMENTS.taskList.childElementCount;
      this.updateStorage();
      this.displayMessageIfNoTasksExist();
    }
  }

  /**
   * Updates the session storage when the list changes
   */
  updateStorage() {
    sessionStorage.clear();
    sessionStorage.setItem('numTasks', this.numTasks);
    const children = Array.from(this.DOM_ELEMENTS.taskList.children);
    children.forEach((element) => {
      const task = {
        name: element.getAttribute('name'),
        estimate: element.getAttribute('estimate'),
        progress: element.getAttribute('progress'),
        notes: element.getAttribute('notes'),
        isComplete: element.getAttribute('isComplete'),
        className: element.getAttribute('class'),
        id: element.getAttribute('id'),
        isDraggable: element.getAttribute('isDraggable'),
      };
      sessionStorage.setItem(task.id, JSON.stringify(task));
    });
  }

  /**
   * Cancel the input box
   */
  cancelInput() {
    this.DOM_ELEMENTS.inputBox.style.display = 'none';
    this.resetInputBox();
  }

  /**
   * Displays the 'View Tasks Here if there are no tasks'
   */
  displayMessageIfNoTasksExist() {
    if (sessionStorage.getItem('numTasks') !== 0) {
      this.DOM_ELEMENTS.noTasks.style.display = 'none';
    } else {
      this.DOM_ELEMENTS.noTasks.style.display = 'block';
    }
  }

  /**
   *  Displays input box for user to input a task
   */
  displayInputBox() {
    this.DOM_ELEMENTS.inputBox.style.display = 'grid';
  }

  /**
   * Add/remove notes to/from new task input
   */
  addNotesToTask() {
    if (this.DOM_ELEMENTS.addNotesButton.value === 'Add Notes') {
      this.DOM_ELEMENTS.newTaskNotes.style.display = 'inline';
      this.DOM_ELEMENTS.addNotesButton.value = 'Remove Notes';
    } else {
      this.DOM_ELEMENTS.newTaskNotes.style.display = 'none';
      this.DOM_ELEMENTS.addNotesButton.value = 'Add Notes';
    }
  }

  /**
   * Adds new task-item to the to-do list based on whats in the input box
   */
  addTask() {
    const newTask = document.createElement('task-item');
    newTask.setAttribute('name', this.DOM_ELEMENTS.newTaskName.value);
    newTask.setAttribute('estimate', this.DOM_ELEMENTS.newTaskPomos.value);
    newTask.setAttribute('progress', '0');
    newTask.setAttribute('notes', this.DOM_ELEMENTS.newTaskNotes.value);
    newTask.setAttribute('isComplete', false);
    newTask.setAttribute('class', 'dropzone');
    newTask.setAttribute('id', this.numTasks);

    this.DOM_ELEMENTS.taskList.prepend(newTask);
    this.DOM_ELEMENTS.inputBox.style.display = 'none';

    const task = {
      name: this.DOM_ELEMENTS.newTaskName.value,
      estimate: this.DOM_ELEMENTS.newTaskPomos.value,
      progress: 0,
      notes: this.DOM_ELEMENTS.newTaskNotes.value,
      isComplete: false,
      className: 'dropzone',
      id: this.numTasks,
      isDraggable: true,
    };

    sessionStorage.setItem(task.id, JSON.stringify(task));

    this.resetInputBox();
    this.numTasks = this.DOM_ELEMENTS.taskList.childElementCount;
  }

  /**
   * Resets the input box back to empty
   */
  resetInputBox() {
    this.DOM_ELEMENTS.newTaskNotes.style.display = 'none';
    this.DOM_ELEMENTS.addNotesButton.value = 'Add Notes';
    this.DOM_ELEMENTS.newTaskNotes.value = '';
    this.DOM_ELEMENTS.newTaskName.value = '';
    this.DOM_ELEMENTS.newTaskPomos.value = '?';
  }

  /**
   * Make the tasks in the list draggable
   * Code taken from https://jsfiddle.net/mrinex/yLpx7etg/3/
   */
  makeTasksDraggable() {
    let dragged;
    let id;
    let index;
    let indexDrop;
    let list;
    document.addEventListener('dragstart', ({ target }) => {
      dragged = target;
      id = target.id;
      list = target.parentNode.children;
      for (let i = 0; i < list.length; i += 1) {
        if (list[i] === dragged) {
          index = i;
        }
      }
    });
    document.addEventListener('dragover', (event) => {
      event.preventDefault();
    });
    document.addEventListener('drop', ({ target }) => {
      if (target.className === 'dropzone' && target.id !== id) {
        dragged.remove(dragged);
        for (let i = 0; i < list.length; i += 1) {
          if (list[i] === target) {
            indexDrop = i;
          }
        }
        if (index > indexDrop) {
          target.before(dragged);
        } else {
          target.after(dragged);
        }
      }
      this.refreshTaskItemIds();
    });
  }

  /**
   * Change the ID's of task-items when they get dragged around so that the top
   * is the highest number ID
   */
  refreshTaskItemIds() {
    const children = Array.from(this.DOM_ELEMENTS.taskList.children);
    children.forEach((element) => {
      const elementPosition = Array.from(element.parentNode.children).indexOf(element);
      const totalElementCount = this.DOM_ELEMENTS.taskList.childElementCount;
      element.id = totalElementCount - elementPosition;
    });
  }

  incrementPomodoroCount(taskId) {
    // TODO: Implement
    this.incrementPomodoroCount(taskId);
  }
}
export default TaskList;
