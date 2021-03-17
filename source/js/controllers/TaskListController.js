/**
 * Implements the TaskList class. This class is a controller for the task list which
 * holds all the task items and the to-do lists and completed lists
 */
class TaskListController {
  constructor() {
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
    this.clearCompletedList = this.clearCompletedList.bind(this);
    this.cancelInput = this.cancelInput.bind(this);
    this.loadTasks = this.loadTasks.bind(this);
    this.expandCompletedTasks = this.expandCompletedTasks.bind(this);
    this.collapseTaskList = this.collapseTaskList.bind(this);
    this.expandTaskList = this.expandTaskList.bind(this);
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
      clearCompletedList: document.getElementById('clear-completed-list'),
      completedListTitle: document.getElementById('completed-list-header'),
      expandCompleted: document.getElementById('expand-completed'),
      viewAll: document.getElementById('view-all'),
      collapseTaskList: document.getElementById('collapse-task-list'),
      expandTaskList: document.getElementById('expand-task-list'),
      rightHalf: document.getElementById('right-half'),
      timerBox: document.getElementById('timer-box'),
      leftHalf: document.getElementById('left-half'),
    };

    this.DOM_ELEMENTS.clearCompletedList.addEventListener('click', this.clearCompletedList.bind(this));
  }

  /**
   * Loads the tasks saved in sessionStorage back in the order that they were in previously
   */
  loadTasks() {
    this.hasLoadedIntoDOM = false;
    let selectedID = null;
    while (this.DOM_ELEMENTS.taskList.firstChild) {
      if (this.DOM_ELEMENTS.taskList.firstChild.isSelected) {
        selectedID = this.DOM_ELEMENTS.taskList.firstChild.getAttribute('id');
      }
      this.DOM_ELEMENTS.taskList.removeChild(this.DOM_ELEMENTS.taskList.firstChild);
    }
    while (this.DOM_ELEMENTS.completedList.firstChild) {
      this.DOM_ELEMENTS.completedList.removeChild(this.DOM_ELEMENTS.completedList.firstChild);
    }
    let sessionNumTasks = 0;
    let sessionCompletedTasks = 0;
    const keys = Object.keys(sessionStorage);
    keys.forEach((key) => {
      const keyNum = parseInt(key, 10);
      // maximum of 1000 tasks in both lists
      const isTaskItem = (keyNum > -1000) && (keyNum < 1000) && (keyNum !== 0);
      if (isTaskItem) {
        // need the try in case the session storage gets messed with
        try {
          const taskObj = JSON.parse(sessionStorage.getItem(key));
          if (typeof taskObj.name !== 'undefined' && typeof taskObj.estimate !== 'undefined'
            && typeof taskObj.progress !== 'undefined' && typeof taskObj.distraction !== 'undefined'
            && typeof taskObj.isComplete !== 'undefined' && typeof taskObj.class !== 'undefined'
            && typeof taskObj.id !== 'undefined' && typeof taskObj.draggable !== 'undefined') {
            const newTask = document.createElement('task-item');
            newTask.setAttribute('name', taskObj.name);
            newTask.setAttribute('estimate', taskObj.estimate);
            newTask.setAttribute('progress', taskObj.progress);
            newTask.setAttribute('distraction', taskObj.distraction);
            newTask.setAttribute('notes', taskObj.notes);
            newTask.setAttribute('isComplete', taskObj.isComplete);
            newTask.isComplete = taskObj.isComplete;
            newTask.setAttribute('class', taskObj.class);
            newTask.setAttribute('id', taskObj.id);
            newTask.setAttribute('tabindex', 10);
            newTask.setAttribute('draggable', taskObj.draggable);
            if (parseInt(key, 10) > 0) {
              this.DOM_ELEMENTS.taskList.appendChild(newTask);
              sessionNumTasks += 1;
            } else {
              this.DOM_ELEMENTS.completedList.prepend(newTask);
              newTask.shadowRoot.querySelector('.checkbox').checked = taskObj.isComplete;
              newTask.style.cursor = 'pointer';
              sessionCompletedTasks += 1;
            }
            newTask.addEventListener('click', this.selectTask.bind(this, newTask));
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
    sessionStorage.setItem('numTasks', sessionNumTasks);
    sessionStorage.setItem('completedTasks', sessionCompletedTasks);
    for (let i = 1; i <= sessionNumTasks; i += 1) {
      this.DOM_ELEMENTS.taskList.prepend(document.getElementById(i));
    }
    for (let i = 1; i <= sessionCompletedTasks; i += 1) {
      this.DOM_ELEMENTS.completedList.appendChild(document.getElementById(-i));
    }
    if (selectedID !== null) {
      this.selectTask(document.getElementById(selectedID));
    }
    this.numTasks = this.DOM_ELEMENTS.taskList.childElementCount;
    this.completedTasks = this.DOM_ELEMENTS.completedList.childElementCount;
    this.hasLoadedIntoDOM = true;
    this.hideCompletedIfNoTasksExist();
    this.updateStorage();
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
      this.deselectTaskIfComplete();
      this.updateStorage();
      this.hideCompletedIfNoTasksExist();
      if (this.numTasks === 0) {
        document.getElementById('distraction-button').style.display = 'none';
      } else {
        document.getElementById('distraction-button').style.display = 'block';
      }
    }
  }

  /**
   * Displays only the working task
   */
  showSelectedTask() {
    this.DOM_ELEMENTS.taskListTitle.innerText = 'Current Task';
    this.cancelInput();
    const TLChildren = Array.from(this.DOM_ELEMENTS.taskList.children);
    TLChildren.forEach((element) => {
      element.style.display = 'none';
    });
    if (this.selectedTask) {
      // removes selected style
      this.selectedTask.styleUnselectedTask();
      this.selectedTask.onclick = null;
      if (this.selectedTask.shadowRoot) {
        if (this.selectedTask.isExpanded === false) {
          this.selectedTask.shadowRoot.querySelector('.expand-button').click();
        }
        this.selectedTask.shadowRoot.querySelector('.expand-button').style.display = 'none';
        this.selectedTask.shadowRoot.querySelector('.edit-button').style.display = 'none';
        this.selectedTask.shadowRoot.querySelector('.remove-button').style.display = 'none';
      }
      this.selectedTask.style.display = 'grid';
    }
    this.DOM_ELEMENTS.completedListTitle.style.display = 'none';
    this.DOM_ELEMENTS.completedList.style.display = 'none';
    this.DOM_ELEMENTS.clearCompletedList.style.display = 'none';
    this.DOM_ELEMENTS.viewAll.style.display = 'inline';
    this.DOM_ELEMENTS.addTaskButton.style.display = 'none';
  }

  /**
   * Updates the session storage when the list changes
   */
  updateStorage() {
    sessionStorage.clear();
    sessionStorage.setItem('numTasks', this.numTasks);
    sessionStorage.setItem('completedTasks', this.completedTasks);
    // gets rid of null items
    if (this.DOM_ELEMENTS.taskList.innerHTML.includes('null')) {
      this.DOM_ELEMENTS.taskList.innerHTML = this.DOM_ELEMENTS.taskList.innerHTML.replace('null', '');
    }
    const TLChildren = Array.from(this.DOM_ELEMENTS.taskList.children);
    TLChildren.forEach((element) => {
      const taskObj = {
        name: element.getAttribute('name'),
        estimate: element.getAttribute('estimate'),
        progress: element.getAttribute('progress'),
        distraction: element.getAttribute('distraction'),
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
        distraction: element.getAttribute('distraction'),
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
    this.DOM_ELEMENTS.addTaskButton.style.display = 'block';
    this.resetInputBox();
  }

  /**
   * Hides the Completed task list (and clear all button) if there are no completed tasks
   */
  hideCompletedIfNoTasksExist() {
    // only if its not in current task view
    if (this.DOM_ELEMENTS.addTaskButton.style.display !== 'none') {
      const hasCompletedTasks = sessionStorage.getItem('completedTasks') !== '0';
      if (hasCompletedTasks) {
        this.DOM_ELEMENTS.completedListTitle.style.display = 'flex';
        if (this.completedIsExpanded) {
          this.DOM_ELEMENTS.clearCompletedList.style.display = 'inline';
        }
      } else {
        this.DOM_ELEMENTS.completedListTitle.style.display = 'none';
        this.DOM_ELEMENTS.clearCompletedList.style.display = 'none';
      }
    }
  }

  /**
   *  Displays input box for user to input a task
   */
  displayInputBox() {
    this.DOM_ELEMENTS.inputBox.style.display = 'grid';
    this.DOM_ELEMENTS.addTaskButton.style.display = 'none';
    this.DOM_ELEMENTS.newTaskName.focus();
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
      this.DOM_ELEMENTS.newTaskNotes.value = '';
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
    newTask.setAttribute('distraction', '0');
    newTask.setAttribute('notes', this.DOM_ELEMENTS.newTaskNotes.value);
    newTask.setAttribute('isComplete', false);
    newTask.setAttribute('class', 'dropzone');
    newTask.setAttribute('id', this.numTasks);
    newTask.setAttribute('tabindex', 10);
    newTask.addEventListener('click', this.selectTask.bind(this, newTask));

    this.DOM_ELEMENTS.taskList.style.display = 'none';
    this.DOM_ELEMENTS.taskList.appendChild(newTask);
    this.numTasks = this.DOM_ELEMENTS.taskList.childElementCount;
    this.updateStorage();
    this.resetInputBox();
    this.DOM_ELEMENTS.taskList.style.display = 'initial';
  }

  /**
   * Resets the input box back to empty
   */
  resetInputBox() {
    this.DOM_ELEMENTS.inputBox.style.display = 'none';
    this.DOM_ELEMENTS.newTaskNotes.style.display = 'none';
    this.DOM_ELEMENTS.addNotesButton.value = 'Add Notes';
    this.DOM_ELEMENTS.newTaskNotes.value = '';
    this.DOM_ELEMENTS.newTaskName.value = '';
    this.DOM_ELEMENTS.newTaskPomos.value = '1';
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
   * Collapses the TaskList to the right side of the screen w/ animation
   */
  collapseTaskList() {
    let isMobile = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) isMobile = true;})(navigator.userAgent||navigator.vendor||window.opera);
    if (!isMobile) {
      // move timer to center
      this.DOM_ELEMENTS.timerBox.style.animationDuration = '1s';
      this.DOM_ELEMENTS.timerBox.style.animationName = 'slideRight';
    }
    // move task list
    this.DOM_ELEMENTS.rightHalf.style.animationDuration = '1s';
    this.DOM_ELEMENTS.rightHalf.style.animationName = 'slideout';
    this.DOM_ELEMENTS.rightHalf.style.marginLeft = '2000px';

    // change style of others after animations
    setTimeout(() => {
      this.DOM_ELEMENTS.timerBox.id = 'timer-box-center';
      this.DOM_ELEMENTS.leftHalf.style.width = '100%';
      this.DOM_ELEMENTS.expandTaskList.style.display = 'inline';
      this.DOM_ELEMENTS.rightHalf.style.display = 'none';
      document.getElementById('settings-icon').style.marginTop = '17px';
    }, 600);
  }

  /**
   * Expands the task list from the right side of the screen w/ animation
   */
  expandTaskList() {
    this.DOM_ELEMENTS.rightHalf.style.display = 'flex';
    this.DOM_ELEMENTS.rightHalf.style.animationDuration = '1s';
    this.DOM_ELEMENTS.rightHalf.style.animationName = 'slidein';
    this.DOM_ELEMENTS.rightHalf.style.marginLeft = 'initial';

    let isMobile = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) isMobile = true;})(navigator.userAgent||navigator.vendor||window.opera);
    //const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
      this.DOM_ELEMENTS.timerBox.style.animationDuration = '1s';
      this.DOM_ELEMENTS.timerBox.style.animationName = 'slideLeft';
    }
    // reset styles
    this.DOM_ELEMENTS.timerBox.id = 'timer-box';
    this.DOM_ELEMENTS.leftHalf.style.width = '50%';
    this.DOM_ELEMENTS.expandTaskList.style.display = 'none';
    document.getElementById('settings-icon').style.marginTop = '10px';
  }

  /**
   * Expand the list of completed tasks
  */
  expandCompletedTasks() {
    this.DOM_ELEMENTS.expandCompleted.style.tranform = 'rotate(180deg)';
    if (this.completedIsExpanded) {
      this.completedIsExpanded = false;
      this.DOM_ELEMENTS.clearCompletedList.style.display = 'none';
      this.DOM_ELEMENTS.completedList.style.display = 'none';
      this.DOM_ELEMENTS.completedList.style.marginRight = '35px';
      this.DOM_ELEMENTS.expandCompleted.style = 'transform:rotate(0deg); -webkit-transform: rotate(0deg)';
      return;
    }
    this.completedIsExpanded = true;
    this.DOM_ELEMENTS.clearCompletedList.style.display = 'inline';
    this.DOM_ELEMENTS.completedList.style.display = 'inline';
    this.DOM_ELEMENTS.completedList.style.marginRight = '40px';
    this.DOM_ELEMENTS.expandCompleted.style = 'transform:rotate(180deg); -webkit-transform: rotate(180deg)';
  }

  /**
   * Set the selected task to selectedTask instance variable and unselect other
   * tasks
   * @param {TaskItem} taskItem task selected
   */
  selectTask(taskItem) {
    if (taskItem && !taskItem.isComplete) {
      if (this.selectedTask === taskItem) {
        this.selectedTask = null;
      } else {
        this.selectedTask = taskItem;
        this.selectedID = this.selectedTask.id;
        this.selectedTask.isSelected = true;
        this.unselectOtherTasks();
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

  /**
   * Selects the first task in the list if no task selected
   */
  autoSelectTask() {
    if (this.numTasks !== 0) {
      if (this.selectedTask === null) {
        const defaultTask = this.DOM_ELEMENTS.taskList.children[0];
        defaultTask.toggleTaskSelection();
        this.selectTask(defaultTask);
      }
    }
  }

  /**
   * Update the selected task session progress count
   */
  updateSelectedTaskSessionCount() {
    this.selectedTask.incrementTaskProgressCount();
  }

  /**
   * Deselect selected task if complete
   */
  deselectTaskIfComplete() {
    if (this.selectedTask) {
      if (this.selectedTask.isComplete) {
        this.selectedTask.markTaskAsUnSelected();
        this.selectedTask = null;
      }
    } else if (this.hasActiveSession && this.DOM_ELEMENTS.addTaskButton.style.display === 'none') {
      // shows the next task if it is marked as completed and is in session
      this.autoSelectTask();
      if (this.selectedTask) {
        this.showSelectedTask();
      }
    }
  }

  /**
   * Clear completed list
   */
  clearCompletedList() {
    if (localStorage.getItem('hideAlerts') === 'false' && !window.confirm('Clear Completed Tasks?')) return;
    const CLChildren = Array.from(this.DOM_ELEMENTS.completedList.children);
    CLChildren.forEach((element) => {
      element.remove();
    });
  }
}

export default TaskListController;
