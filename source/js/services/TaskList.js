/**
 * Implements the TaskList class. This class is a controller for the task list which
 * holds all the task items and the to-do lists and completed lists
 */
let instance = null // hold singleton of TaskLIst  class

class TaskList {
  constructor() {
    if(instance) return;
    instance = this;
    instance.numTasks = 0;
    instance.selectedTask = null;
    instance.completedTasks = 0;
    instance.completedIsExpanded = false;
    instance.hasLoadedIntoDOM = false; // make sure nothing else runs while loading

    instance.displayInputBox = instance.displayInputBox.bind(this);
    instance.addNotesToTask = instance.addNotesToTask.bind(this);
    instance.addTask = instance.addTask.bind(this);
    instance.listChanged = instance.listChanged.bind(this);
    instance.cancelInput = instance.cancelInput.bind(this);
    instance.loadTasks = instance.loadTasks.bind(this);
    instance.expandCompletedTasks = instance.expandCompletedTasks.bind(this);
    instance.DOM_ELEMENTS = {
      addTaskButton: document.getElementById('add-task'),
      inputBox: document.getElementById('task-add-input'),
      addNotesButton: document.getElementById('add-notes'),
      newTaskNotes: document.getElementById('add-task-description'),
      newTaskName: document.getElementById('add-task-name'),
      newTaskPomos: document.getElementById('pomos'),
      taskList: document.getElementById('to-do-list'),
      saveNewTaskButton: document.getElementById('save-task'),
      cancelButton: document.getElementById('cancel-input'),
      completedList: document.getElementById('completed-list'),
      completedListTitle: document.getElementById('completed-list-header'),
      expandCompleted: document.getElementById('expand-completed'),
    };

    instance.DOM_ELEMENTS.addTaskButton.addEventListener('click', instance.displayInputBox);
    instance.DOM_ELEMENTS.addNotesButton.addEventListener('click', instance.addNotesToTask);
    instance.DOM_ELEMENTS.saveNewTaskButton.addEventListener('click', instance.addTask);
    instance.DOM_ELEMENTS.taskList.addEventListener('DOMSubtreeModified', instance.listChanged);
    instance.DOM_ELEMENTS.completedList.addEventListener('DOMSubtreeModified', instance.listChanged);
    instance.DOM_ELEMENTS.cancelButton.addEventListener('click', instance.cancelInput);
    instance.DOM_ELEMENTS.expandCompleted.addEventListener('click', instance.expandCompletedTasks);
    instance.makeTasksDraggable();
    instance.DOM_ELEMENTS.completedList.style.display = 'none';
  }

  /**
   * Loads the tasks saved in sessionStorage back in the order that they were in previously
   */
  loadTasks() {
    instance.hasLoadedIntoDOM = false;
    const keys = Object.keys(sessionStorage);
    keys.forEach((key) => {
      const numTasks = sessionStorage.getItem('numTasks');
      const completedTasks = sessionStorage.getItem('completedTasks');
      const isTaskItem = (parseInt(key, 10) >= -completedTasks) && (parseInt(key, 10) <= numTasks);
      if (isTaskItem) {
        const taskObj = JSON.parse(sessionStorage.getItem(key));
        const newTask = document.createElement('task-item');
        newTask.setAttribute('name', taskObj.name);
        newTask.setAttribute('estimate', taskObj.estimate);
        newTask.setAttribute('progress', taskObj.progress);
        newTask.setAttribute('notes', taskObj.notes);
        newTask.setAttribute('isComplete', taskObj.isComplete);
        newTask.isComplete = taskObj.isComplete;
        newTask.setAttribute('class', taskObj.class);
        newTask.setAttribute('id', taskObj.id);
        newTask.setAttribute('draggable', taskObj.draggable);
        if (parseInt(key, 10) > 0) {
          instance.DOM_ELEMENTS.taskList.appendChild(newTask);
        } else {
          instance.DOM_ELEMENTS.completedList.prepend(newTask);
          newTask.shadowRoot.querySelector('.checkbox').checked = taskObj.isComplete;
          newTask.style.cursor = 'pointer';
        }
        newTask.addEventListener('click', instance.selectTask.bind(this, newTask));
      }
    });
    for (let i = 1; i <= sessionStorage.getItem('numTasks'); i += 1) {
      instance.DOM_ELEMENTS.taskList.prepend(document.getElementById(i));
    }
    for (let i = 1; i <= sessionStorage.getItem('completedTasks'); i += 1) {
      instance.DOM_ELEMENTS.completedList.appendChild(document.getElementById(-i));
    }
    instance.numTasks = instance.DOM_ELEMENTS.taskList.childElementCount;
    instance.completedTasks = instance.DOM_ELEMENTS.completedList.childElementCount;
    instance.hasLoadedIntoDOM = true;
    instance.displayMessageIfNoTasksExist();
  }

  /**
   * Called when a Task is removed from the task-list
   * Had to be done here because the remove method is in the individual task
   * Does not run if the elements are being loaded in
   */
  listChanged() {
    if (instance.hasLoadedIntoDOM) {
      instance.refreshTaskItemIds();
      instance.numTasks = instance.DOM_ELEMENTS.taskList.childElementCount;
      instance.completedTasks = instance.DOM_ELEMENTS.completedList.childElementCount;
      instance.updateStorage();
      instance.displayMessageIfNoTasksExist();
    }
  }

  /**
   * Updates the session storage when the list changes
   */
  updateStorage() {
    sessionStorage.clear();
    sessionStorage.setItem('numTasks', instance.numTasks);
    sessionStorage.setItem('completedTasks', instance.completedTasks);
    const TLChildren = Array.from(instance.DOM_ELEMENTS.taskList.children);
    TLChildren.forEach((element) => {
      const taskObj = {
        name: element.getAttribute('name'),
        estimate: element.getAttribute('estimate'),
        progress: element.getAttribute('progress'),
        notes: element.getAttribute('notes'),
        isComplete: false,
        class: 'dropzone',
        id: element.getAttribute('id'),
        draggable: true,
      };
      const taskJSON = JSON.stringify(taskObj);
      sessionStorage.setItem(element.getAttribute('id'), taskJSON);
    });
    const CLChildren = Array.from(instance.DOM_ELEMENTS.completedList.children);
    CLChildren.forEach((element) => {
      const taskObj = {
        name: element.getAttribute('name'),
        estimate: element.getAttribute('estimate'),
        progress: element.getAttribute('progress'),
        notes: element.getAttribute('notes'),
        isComplete: element.getAttribute('isComplete'),
        class: 'none',
        id: element.getAttribute('id'),
        draggable: false,
      };
      const taskJSON = JSON.stringify(taskObj);
      sessionStorage.setItem(element.getAttribute('id'), taskJSON);
    });
  }

  /**
   * Cancel the input box
   */
  cancelInput() {
    instance.DOM_ELEMENTS.inputBox.style.display = 'none';
    instance.DOM_ELEMENTS.addTaskButton.style.display = 'block';
    instance.resetInputBox();
  }

  /**
   * Displays the 'View Tasks Here if there are no tasks'
   * Hides the Completed task list if there are no completed tasks
   */
  displayMessageIfNoTasksExist() {
    const hasCompletedTasks = sessionStorage.getItem('completedTasks') !== '0';
    if (hasCompletedTasks) {
      instance.DOM_ELEMENTS.completedListTitle.style.display = 'flex';
    } else {
      instance.DOM_ELEMENTS.completedListTitle.style.display = 'none';
    }
  }

  /**
   *  Displays input box for user to input a task
   */
  displayInputBox() {
    instance.DOM_ELEMENTS.inputBox.style.display = 'grid';
    instance.DOM_ELEMENTS.addTaskButton.style.display = 'none';
  }

  /**
   * Add/remove notes to/from new task input
   */
  addNotesToTask() {
    if (instance.DOM_ELEMENTS.addNotesButton.value === 'Add Notes') {
      instance.DOM_ELEMENTS.newTaskNotes.style.display = 'inline';
      instance.DOM_ELEMENTS.addNotesButton.value = 'Remove Notes';
    } else {
      instance.DOM_ELEMENTS.newTaskNotes.style.display = 'none';
      instance.DOM_ELEMENTS.addNotesButton.value = 'Add Notes';
    }
  }

  /**
   * Adds new task-item to the to-do list based on whats in the input box
   */
  addTask() {
    const newTask = document.createElement('task-item');
    newTask.setAttribute('name', instance.DOM_ELEMENTS.newTaskName.value);
    newTask.setAttribute('estimate', instance.DOM_ELEMENTS.newTaskPomos.value);
    newTask.setAttribute('progress', '0');
    newTask.setAttribute('notes', instance.DOM_ELEMENTS.newTaskNotes.value);
    newTask.setAttribute('isComplete', false);
    newTask.setAttribute('class', 'dropzone');
    newTask.setAttribute('id', instance.numTasks);

    instance.DOM_ELEMENTS.taskList.appendChild(newTask);
    instance.DOM_ELEMENTS.inputBox.style.display = 'none';

    const task = {
      name: instance.DOM_ELEMENTS.newTaskName.value,
      estimate: instance.DOM_ELEMENTS.newTaskPomos.value,
      progress: 0,
      notes: instance.DOM_ELEMENTS.newTaskNotes.value,
      isComplete: false,
      className: 'dropzone',
      id: instance.numTasks,
      isDraggable: true,
    };

    sessionStorage.setItem(task.id, JSON.stringify(task));
    newTask.addEventListener('click', instance.selectTask.bind(this, newTask));

    instance.resetInputBox();
    instance.numTasks = instance.DOM_ELEMENTS.taskList.childElementCount;
  }

  /**
   * Resets the input box back to empty
   */
  resetInputBox() {
    instance.DOM_ELEMENTS.newTaskNotes.style.display = 'none';
    instance.DOM_ELEMENTS.addNotesButton.value = 'Add Notes';
    instance.DOM_ELEMENTS.newTaskNotes.value = '';
    instance.DOM_ELEMENTS.newTaskName.value = '';
    instance.DOM_ELEMENTS.newTaskPomos.value = '0';
    instance.DOM_ELEMENTS.addTaskButton.style.display = 'block';
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
      instance.refreshTaskItemIds();
    });
  }

  /**
   * Change the ID's of task-items when they get dragged around so that the top
   * is the highest number ID
   */
  refreshTaskItemIds() {
    const TLChildren = Array.from(instance.DOM_ELEMENTS.taskList.children);
    TLChildren.forEach((element) => {
      const elementPosition = Array.from(element.parentNode.children).indexOf(element);
      const totalElementCount = instance.DOM_ELEMENTS.taskList.childElementCount;
      element.id = totalElementCount - elementPosition;
    });
    const CLChildren = Array.from(instance.DOM_ELEMENTS.completedList.children);
    CLChildren.forEach((element) => {
      const elementPosition = Array.from(element.parentNode.children).indexOf(element);
      element.id = -elementPosition - 1;
    });
  }

  /**
   * Expand the list of completed tasks
  */
  expandCompletedTasks() {
    instance.DOM_ELEMENTS.expandCompleted.style.tranform = 'rotate(180deg)';
    if (instance.completedIsExpanded) {
      instance.completedIsExpanded = false;
      instance.DOM_ELEMENTS.completedList.style.display = 'none';
      instance.DOM_ELEMENTS.completedList.style.marginRight = '35px';
      instance.DOM_ELEMENTS.expandCompleted.style = 'transform:rotate(0deg); -webkit-transform: rotate(0deg)';
      return;
    }
    instance.completedIsExpanded = true;
    instance.DOM_ELEMENTS.completedList.style.display = 'inline';
    instance.DOM_ELEMENTS.completedList.style.marginRight = '40px';
    instance.DOM_ELEMENTS.expandCompleted.style = 'transform:rotate(180deg); -webkit-transform: rotate(180deg)';
  }

  /**
   * Increases the top task progress when the pomodoro session increases
   */
  incrementPomodoroCount() {
    const topTask = document.getElementById('1');
    if (topTask !== null) {
      topTask.progress += 1;
    }
    instance.listChanged();
  }

  /**
   * Set the selected task to selectedTask instance variable and unselect other
   * tasks
   * @param {TaskItem} taskItem task selected
   */
  selectTask(taskItem) {
    if (instance.selectedTask === taskItem) {
      instance.selectedTask = null;
    } else {
      instance.selectedTask = taskItem;
      instance.unselectOtherTasks();
    }
  }

  /**
   * Unselect the other tasks that is not the selectedTask
   */
  unselectOtherTasks() {
    const children = Array.from(instance.DOM_ELEMENTS.taskList.children);
    children.forEach((element) => {
      if (instance.selectedTask !== element) {
        if (element.isSelected) {
          element.toggleTaskSelection();
        }
      }
    });
  }
}

export default TaskList;
