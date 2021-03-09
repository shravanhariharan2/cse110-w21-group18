/**
 * Implements the TaskList class. This singleton class is a controller for the task list which
 * holds all the task items and the to-do lists and completed lists
 */
let instance = null; // hold singleton of TaskLIst  class

class TaskList {
  constructor() {
    if (instance) return instance;
    instance = this;
    this.numTasks = 0;
    this.selectedTask = null;
    this.completedTasks = 0;
    this.completedIsExpanded = false;
    this.hasLoadedIntoDOM = false; // make sure nothing else runs while loading
    this.hasActiveSession = false;
    this.displayInputBox = this.displayInputBox.bind(this);
    this.addNotesToTask = this.addNotesToTask.bind(this);
    this.addTask = this.addTask.bind(this);
    this.listChanged = this.listChanged.bind(this);
    this.cancelInput = this.cancelInput.bind(this);
    this.loadTasks = this.loadTasks.bind(this);
    this.expandCompletedTasks = this.expandCompletedTasks.bind(this);
    this.DOM_ELEMENTS = {
      taskListTitle: document.getElementById('list-title'),
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
    this.DOM_ELEMENTS.addTaskButton.addEventListener('click', this.displayInputBox);
    this.DOM_ELEMENTS.addNotesButton.addEventListener('click', this.addNotesToTask);
    this.DOM_ELEMENTS.saveNewTaskButton.addEventListener('click', this.addTask);
    this.DOM_ELEMENTS.taskList.addEventListener('DOMSubtreeModified', this.listChanged);
    this.DOM_ELEMENTS.completedList.addEventListener('DOMSubtreeModified', this.listChanged);
    this.DOM_ELEMENTS.cancelButton.addEventListener('click', this.cancelInput);
    this.DOM_ELEMENTS.expandCompleted.addEventListener('click', this.expandCompletedTasks);
    this.makeTasksDraggable();
    this.displayMessageIfNoTasksExist();
    this.DOM_ELEMENTS.completedList.style.display = 'none';
    return instance;
  }

  /**
   * Loads the tasks saved in sessionStorage back in the order that they were in previously
   */
  loadTasks() {
    this.hasLoadedIntoDOM = false;
    let selectedID = null;
    while (this.DOM_ELEMENTS.taskList.firstChild) {
      if(this.DOM_ELEMENTS.taskList.firstChild.isSelected){
        selectedID = this.DOM_ELEMENTS.taskList.firstChild.getAttribute('id');
      }
      this.DOM_ELEMENTS.taskList.removeChild(this.DOM_ELEMENTS.taskList.firstChild);
    }
    while (this.DOM_ELEMENTS.completedList.firstChild) {
      this.DOM_ELEMENTS.completedList.removeChild(this.DOM_ELEMENTS.completedList.firstChild);
    }
    const keys = Object.keys(sessionStorage);
    keys.forEach((key) => {
      const numTasks = sessionStorage.getItem('numTasks');
      const completedTasks = sessionStorage.getItem('completedTasks');
      const isTaskItem = (parseInt(key, 10) >= -completedTasks) && (parseInt(key, 10) <= numTasks) && (parseInt(key, 10) !==0);
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
          this.DOM_ELEMENTS.taskList.appendChild(newTask);
        } else {
          this.DOM_ELEMENTS.completedList.prepend(newTask);
          newTask.shadowRoot.querySelector('.checkbox').checked = taskObj.isComplete;
          newTask.style.cursor = 'pointer';
        }
        newTask.addEventListener('click', this.selectTask.bind(this, newTask));
      }
    });
    for (let i = 1; i <= sessionStorage.getItem('numTasks'); i += 1) {
      this.DOM_ELEMENTS.taskList.prepend(document.getElementById(i));
    }
    for (let i = 1; i <= sessionStorage.getItem('completedTasks'); i += 1) {
      this.DOM_ELEMENTS.completedList.appendChild(document.getElementById(-i));
    }
    if (selectedID !== null) {
      this.selectedTask = document.getElementById(selectedID);
    }
    this.numTasks = this.DOM_ELEMENTS.taskList.childElementCount;
    this.completedTasks = this.DOM_ELEMENTS.completedList.childElementCount;
    this.hasLoadedIntoDOM = true;
    this.displayMessageIfNoTasksExist();
  }

  /**
   * Called when a Task is removed from the task-list
   * Had to be done here because the remove method is in the individual task
   * Does not run if the elements are being loaded in
   */
  listChanged() {
    if (this.hasLoadedIntoDOM) {
      this.refreshTaskItemIds();
      this.numTasks = this.DOM_ELEMENTS.taskList.childElementCount;
      this.completedTasks = this.DOM_ELEMENTS.completedList.childElementCount;
      this.updateStorage();
      this.displayMessageIfNoTasksExist();
      //if we need a new selected task
      if((this.selectedTask !== null) && (this.selectedTask.getAttribute('isComplete') === 'true')) {
        this.selectedTask.style.display = 'grid';
        this.selectedTask = null;
        if (this.numTasks !== 0) {
          if (this.selectedTask === null) {
            const defaultTask = this.DOM_ELEMENTS.taskList.children[0];
            defaultTask.toggleTaskSelection();
            this.selectedTask = defaultTask;
            if (this.hasActiveSession) {
              this.showCurrentTask();
            }
          }
        }
      }
      
    }
  }
  /**
   * Displays only the working task
   */
  showCurrentTask() {
    console.log(this.selectedTask)
    this.DOM_ELEMENTS.taskListTitle.innerText = 'Current Task';
    this.DOM_ELEMENTS.addTaskButton.style.display = 'none';
    const TLChildren = Array.from(this.DOM_ELEMENTS.taskList.children);
    TLChildren.forEach((element) => {
        element.style.display = 'none';
    });
    if (this.selectedTask !== null) {
      // removes selected style
      this.selectedTask.styleUnselectedTask();
      this.selectedTask.onclick = null;
      this.selectedTask.style.display = 'grid';
      if (this.selectedTask.isExpanded == false) {
        this.selectedTask.shadowRoot.querySelector('.expand-button').click();
      }
      this.selectedTask.shadowRoot.querySelector('.expand-button').style.display = 'none';
      this.selectedTask.shadowRoot.querySelector('.edit-button').style.display = 'none';
      this.selectedTask.shadowRoot.querySelector('.remove-button').style.display = 'none';
    }
    this.DOM_ELEMENTS.completedListTitle.style.display = 'none';
    this.DOM_ELEMENTS.completedList.style.display = 'none';
    
  }

  /**
   * Updates the session storage when the list changes
   */
  updateStorage() {
    sessionStorage.clear();
    sessionStorage.setItem('numTasks', this.numTasks);
    sessionStorage.setItem('completedTasks', this.completedTasks);
    const TLChildren = Array.from(this.DOM_ELEMENTS.taskList.children);
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
    const CLChildren = Array.from(this.DOM_ELEMENTS.completedList.children);
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
    this.DOM_ELEMENTS.inputBox.style.display = 'none';
    this.DOM_ELEMENTS.addTaskButton.style.display = 'block';
    this.resetInputBox();
  }

  /**
   * Hides the Completed task list if there are no completed tasks
   */
  displayMessageIfNoTasksExist() {
    if (!this.hasActiveSession) {
      const hasCompletedTasks = sessionStorage.getItem('completedTasks') !== '0';
      if (hasCompletedTasks) {
        this.DOM_ELEMENTS.completedListTitle.style.display = 'flex';
      } else {
        this.DOM_ELEMENTS.completedListTitle.style.display = 'none';
      }
    }
    
  }

  /**
   *  Displays input box for user to input a task
   */
  displayInputBox() {
    this.DOM_ELEMENTS.inputBox.style.display = 'grid';
    this.DOM_ELEMENTS.addTaskButton.style.display = 'none';
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

    this.DOM_ELEMENTS.taskList.appendChild(newTask);
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
    this.updateStorage();
    //sessionStorage.setItem(task.id, JSON.stringify(task));
    newTask.addEventListener('click', this.selectTask.bind(this, newTask));

    this.resetInputBox();
    this.numTasks = this.DOM_ELEMENTS.taskList.childElementCount  ;
  }

  /**
   * Resets the input box back to empty
   */
  resetInputBox() {
    this.DOM_ELEMENTS.newTaskNotes.style.display = 'none';
    this.DOM_ELEMENTS.addNotesButton.value = 'Add Notes';
    this.DOM_ELEMENTS.newTaskNotes.value = '';
    this.DOM_ELEMENTS.newTaskName.value = '';
    this.DOM_ELEMENTS.newTaskPomos.value = '0';
    this.DOM_ELEMENTS.addTaskButton.style.display = 'block';
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
      if ((target.className === 'dropzone' || target.className === 'task-input dropzone') && target.id !== id) {
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
    const TLChildren = Array.from(this.DOM_ELEMENTS.taskList.children);
    TLChildren.forEach((element) => { 
        const elementPosition = Array.from(element.parentNode.children).indexOf(element);
        const totalElementCount = this.DOM_ELEMENTS.taskList.childElementCount;
        element.id = totalElementCount - elementPosition;
    });
    const CLChildren = Array.from(this.DOM_ELEMENTS.completedList.children);
    CLChildren.forEach((element) => {
        const elementPosition = Array.from(element.parentNode.children).indexOf(element);
        element.id = -elementPosition - 1;
    });
  }

  /**
   * Expand the list of completed tasks
  */
  expandCompletedTasks() {
    this.DOM_ELEMENTS.expandCompleted.style.tranform = 'rotate(180deg)';
    if (this.completedIsExpanded) {
      this.completedIsExpanded = false;
      this.DOM_ELEMENTS.completedList.style.display = 'none';
      this.DOM_ELEMENTS.completedList.style.marginRight = '35px';
      this.DOM_ELEMENTS.expandCompleted.style = 'transform:rotate(0deg); -webkit-transform: rotate(0deg)';
      return;
    }
    this.completedIsExpanded = true;
    this.DOM_ELEMENTS.completedList.style.display = 'inline';
    this.DOM_ELEMENTS.completedList.style.marginRight = '40px';
    this.DOM_ELEMENTS.expandCompleted.style = 'transform:rotate(180deg); -webkit-transform: rotate(180deg)';
  }

  /**
   * Increases the top task progress when the pomodoro session increases
   */
  incrementPomodoroCount() {
    const topTask = this.selectedTask;
    if (topTask !== null) {
      const updatedProgress = Number(topTask.getAttribute('progress')) + 1;
      topTask.setAttribute('progress', updatedProgress);
    }
    this.listChanged();
  }

  /**
   * Set the selected task to selectedTask instance variable and unselect other
   * tasks
   * @param {TaskItem} taskItem task selected
   */
  selectTask(taskItem) {
    if (!this.hasActiveSession){
      if (!taskItem.isComplete) {
        if (this.selectedTask === taskItem) {
          this.selectedTask = null;
        } else {
          this.selectedTask = taskItem;
          this.unselectOtherTasks();
        }
      }
    }
  }

  /**
   * Unselect the other tasks that is not the selectedTask
   */
  unselectOtherTasks() {
    const children = Array.from(this.DOM_ELEMENTS.taskList.children);
    children.forEach((element) => {
      if (this.selectedTask !== element) {
        if (element.isSelected) {
          element.toggleTaskSelection();
        }
      }
    });
  }
}

export default TaskList;
