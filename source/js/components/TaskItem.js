import { TaskStyles } from '../constants/Styles.js';
import TaskList from '../scripts/tasks.js';

/**
 * HTML web component for a task item to be displayed inside the task list
 */
class TaskItem extends HTMLElement {
  constructor() {
    super();

    this.isExpanded = false;
    this.isComplete = false;
    this.isSelected = false;

    this.onclick = () => this.toggleTaskSelection();
    this.taskList = document.getElementById('to-do-list');
  }

  connectedCallback() {
    this.setAttribute('draggable', 'true');
    this.loadDOMElements();
  }

  /**
   * Loads all dependent DOM elements into the shadow DOM
   */
  loadDOMElements() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <link rel='stylesheet' href='styles/tasks.css'>
        <link rel='stylesheet' href='styles/index.css'>
        `;
      const nameElement = this.createNameElement();
      const pomoProgressElement = this.createPomoProgressElement();
      const distractionElement = this.createDistractionElement();
      const notesElement = this.createNotesElement();
      const expandButtonElement = this.createExpandButtonElement();
      const editButtonElement = this.createEditButtonElement();
      const removeButtonElement = this.createRemoveButtonElement();
      const checkboxElement = this.createCheckboxElement();

      this.shadowRoot.append(checkboxElement, nameElement, pomoProgressElement,
        expandButtonElement, notesElement, distractionElement,
        editButtonElement, removeButtonElement);
      this.shadowRoot.querySelector('.edit-button').style.display = 'none';
      this.shadowRoot.querySelector('.remove-button').style.display = 'none';
      this.shadowRoot.querySelector('.notes').style.display = 'none';
      this.shadowRoot.querySelector('.distraction').style.display = 'none';
    }
  }

  /**
   * Creates the name element for task item
   * @returns the element for the task name
   */
  createNameElement() {
    const taskName = this.shadowRoot.appendChild(document.createElement('p'));
    taskName.className = 'name';
    taskName.textContent = this.getAttribute('name');
    return taskName;
  }

  /**
   * Creates the progress/estimate element for task item
   * @returns the element for the task progress
   */
  createPomoProgressElement() {
    const taskEstimate = this.shadowRoot.appendChild(document.createElement('p'));
    taskEstimate.className = 'pomo-progress';
    taskEstimate.textContent = `${this.getAttribute('progress')}/${this.getAttribute('estimate')} Pomodoros`;
    return taskEstimate;
  }

  /**
   * Creates the notes element for task item
   * @returns the element for the task notes
   */
  createNotesElement() {
    const taskNotes = this.shadowRoot.appendChild(document.createElement('p'));
    taskNotes.className = 'notes';
    taskNotes.textContent = this.getAttribute('notes');
    return taskNotes;
  }

  /**
   * Creates the distraction count element for task item
   * @returns the element for the task distraction count
   */
  createDistractionElement() {
    const taskDistraction = this.shadowRoot.appendChild(document.createElement('p'));
    taskDistraction.className = 'distraction';
    taskDistraction.textContent = `Distraction(s): ${this.getAttribute('distraction')}`;
    return taskDistraction;
  }

  /**
   * Creates the expand button element for task item
   * @returns the expand button element
   */
  createExpandButtonElement() {
    const button = this.shadowRoot.appendChild(document.createElement('input'));
    button.className = 'expand-button';
    button.type = 'image';
    button.title = 'Expand View';
    button.src = './media/icons/expand-icon.png';
    button.onclick = (event) => this.displayButtons(button, event);
    return button;
  }

  /**
   * Displays the buttons of the task item
   * @param {HTMLElement} button the expand button to be displayed
   * @param {Event} event the event triggered when clicking expand
   * @returns void
   */
  displayButtons(button, event) {
    event.stopPropagation();
    this.shadowRoot.querySelector('.expand-button').style.tranform = 'rotate(180deg)';
    if (this.isExpanded) {
      this.shadowRoot.querySelector('.edit-button').style.display = 'none';
      this.shadowRoot.querySelector('.remove-button').style.display = 'none';
      this.shadowRoot.querySelector('.notes').style.display = 'none';
      this.shadowRoot.querySelector('.distraction').style.display = 'none';
      this.isExpanded = false;
      button.setAttribute('style', 'transform:rotate(0deg); -webkit-transform: rotate(0deg)');
      return;
    }
    const taskGridTemplate = '"check taskName pomo" "notes notes notes" "distraction distraction distraction"';
    if (this.isComplete) {
      this.shadowRoot.querySelector('.edit-button').style.display = 'none';
      this.shadowRoot.querySelector('.remove-button').style.display = 'inline';
      this.style.gridTemplateAreas = `'${taskGridTemplate} "remove remove remove"'`;
      this.shadowRoot.querySelector('.remove-button').style.marginLeft = '200px';
    } else {
      this.shadowRoot.querySelector('.edit-button').style.display = 'inline';
      this.shadowRoot.querySelector('.remove-button').style.display = 'inline';
      this.style.gridTemplateAreas = `'${taskGridTemplate} "remove remove edit"'`;
      this.shadowRoot.querySelector('.remove-button').style.marginLeft = '145px';
    }
    this.shadowRoot.querySelector('.notes').style.display = 'inline';
    this.shadowRoot.querySelector('.distraction').style.display = 'inline';
    this.shadowRoot.querySelector('.distraction').style.textAlign = 'center';
    this.isExpanded = true;
    button.setAttribute('style', 'transform:rotate(180deg); -webkit-transform: rotate(180deg)');
  }

  /**
   * Creates the edit button element for task item
   * @returns the element for the task distraction count
   */
  createEditButtonElement() {
    const button = this.shadowRoot.appendChild(document.createElement('button'));
    button.className = 'edit-button';
    button.title = 'Edit Task';
    button.textContent = 'Edit';
    button.onclick = (event) => this.allowEditing(event);
    return button;
  }

  /**
   * Allows a task to be edited onclick
   * @param {Event} event the onclick event for editing a taks
   */
  allowEditing(event) {
    event.stopPropagation();
    const inputElement = document.createElement('task-input');
    inputElement.setAttribute('class', 'task-input dropzone');
    inputElement.id = this.id;
    inputElement.setAttribute('name', this.getAttribute('name'));
    inputElement.setAttribute('estimate', this.getAttribute('estimate'));
    inputElement.setAttribute('isComplete', this.getAttribute('isComplete'));
    inputElement.setAttribute('progress', this.getAttribute('progress'));
    inputElement.setAttribute('notes', this.getAttribute('notes'));
    inputElement.setAttribute('distraction', this.getAttribute('distraction'));
    inputElement.setAttribute('draggable', true);
    this.after(inputElement);
    inputElement.shadowRoot.querySelector('.add-task-name').value = this.shadowRoot.querySelector('.name').innerText;
    inputElement.shadowRoot.querySelector('.pomos').value = this.getAttribute('estimate');
    inputElement.shadowRoot
      .querySelector('.add-task-description')
      .value = this.shadowRoot.querySelector('.notes').innerText;
    inputElement.shadowRoot
      .querySelector('.add-task-name')
      .addEventListener('click', (e) => e.stopPropagation());
    inputElement.shadowRoot.querySelector('.pomos').addEventListener('click', (e) => e.stopPropagation());
    inputElement.shadowRoot
      .querySelector('.add-task-description')
      .addEventListener('click', (e) => e.stopPropagation());
    if (this.isSelected) {
      inputElement.isSelected = true;
      inputElement.styleSelectedTask();
    }
    this.remove();
    inputElement.shadowRoot.querySelector('.cancel-input').addEventListener('click', (ev) => {
      ev.stopPropagation();
      const taskObj = JSON.parse(sessionStorage.getItem(inputElement.id));
      const newTask = document.createElement('task-item');
      newTask.setAttribute('name', taskObj.name);
      newTask.setAttribute('estimate', taskObj.estimate);
      newTask.setAttribute('progress', taskObj.progress);
      newTask.setAttribute('notes', taskObj.notes);
      newTask.setAttribute('isComplete', taskObj.isComplete);
      newTask.setAttribute('class', taskObj.class);
      newTask.setAttribute('id', taskObj.id);
      newTask.setAttribute('draggable', taskObj.draggable);
      newTask.setAttribute('distraction', taskObj.distraction);
      newTask.addEventListener('click', TaskList.selectTask.bind(TaskList, newTask));
      if (inputElement.isSelected) {
        newTask.styleSelectedTask();
        TaskList.selectTask(newTask);
      }
      inputElement.remove();
      // insert where it was before
      if (inputElement.id !== '1') {
        document.getElementById(inputElement.id - 1).before(newTask);
      } else {
        this.taskList.appendChild(newTask);
      }
    });
    inputElement.shadowRoot.querySelector('.save-task').addEventListener('click', (e) => {
      e.stopPropagation();
      const newTask = document.createElement('task-item');
      newTask.setAttribute('name', inputElement.shadowRoot.querySelector('.add-task-name').value);
      newTask.setAttribute('estimate', inputElement.shadowRoot.querySelector('.pomos').value);
      newTask.setAttribute('progress', inputElement.getAttribute('progress'));
      newTask.setAttribute('notes', inputElement.shadowRoot.querySelector('.add-task-description').value);
      newTask.setAttribute('isComplete', inputElement.getAttribute('isComplete'));
      newTask.setAttribute('class', inputElement.getAttribute('class'));
      newTask.setAttribute('id', inputElement.id);
      newTask.setAttribute('draggable', inputElement.getAttribute('draggable'));
      newTask.setAttribute('distraction', inputElement.getAttribute('distraction'));
      newTask.addEventListener('click', TaskList.selectTask.bind(TaskList, newTask));
      if (inputElement.isSelected) {
        TaskList.selectTask(newTask);
        newTask.styleSelectedTask();
      }
      inputElement.remove();
      // insert where it was before
      if (inputElement.id !== '1') {
        document.getElementById(inputElement.id - 1).before(newTask);
      } else {
        this.taskList.appendChild(newTask);
      }
    });
  }

  /**
   * Creates the remove button element for task item
   * @returns the remove button element
   */
  createRemoveButtonElement() {
    const button = this.shadowRoot.appendChild(document.createElement('button'));
    button.className = 'remove-button';
    button.textContent = 'Remove';
    button.title = 'Delete Task';
    button.onclick = (event) => this.removeTask(event);
    return button;
  }

  /**
   * Removes the current task item from the DOM
   * @param {Event} event the onclick event
   * @returns void
   */
  removeTask(event) {
    event.stopPropagation();
    if (localStorage.getItem('hideAlerts') === 'false' && !window.confirm('Delete Task?')) return;
    this.remove();
  }

  /**
   * Creates the checkbox element for task item
   * @returns the checkbox element
   */
  createCheckboxElement() {
    const checkboxLabel = this.shadowRoot.appendChild(document.createElement('label'));
    checkboxLabel.className = 'task-checkbox';
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('class', 'checkbox');
    input.checked = false;
    checkboxLabel.onclick = (event) => this.markTaskAsComplete(this.id, checkboxLabel, event);
    checkboxLabel.appendChild(input);
    checkboxLabel.innerHTML += '<span class=\'checkmark\'></span>';
    checkboxLabel.title = 'Mark as Done';
    return checkboxLabel;
  }

  /**
   *
   * @param {number} taskId the id of the current task
   * @param {HTMLLabelElement} checkboxLabel the checkbox element
   * @param {Event} event the onclick event
   */
  markTaskAsComplete(taskId, checkboxLabel, event) {
    event.stopPropagation();
    const task = document.getElementById(taskId);
    const checkedElement = task.shadowRoot.querySelector('.checkbox');
    const checkedList = document.getElementById('completed-list');
    if (checkedElement.checked === true) {
      if (this.isSelected) {
        this.markTaskAsUnSelected();
      }
      this.isComplete = true;
      this.setAttribute('isComplete', 'true');
      checkboxLabel.title = 'Unmark as Done';
      checkedList.appendChild(this);
      this.setAttribute('draggable', false);
      this.setAttribute('class', 'none');
      this.style.cursor = 'pointer';
      this.shadowRoot.querySelector('.edit-button').style.display = 'none';
    } else {
      this.isComplete = false;
      this.onclick = () => this.toggleTaskSelection();
      this.setAttribute('isComplete', 'false');
      checkboxLabel.title = 'Mark as Done';
      this.taskList.appendChild(this);
      this.setAttribute('draggable', true);
      this.setAttribute('class', 'dropzone');
      this.style.cursor = 'pointer';
      this.shadowRoot.querySelector('.edit-button').style.display = 'none';
      // resets it to not expanded
      if (this.isExpanded) {
        this.shadowRoot.querySelector('.expand-button').click();
      }
    }
  }

  /**
   * Select/unselect task
   */
  toggleTaskSelection() {
    if (!this.isComplete) {
      if (this.isSelected) {
        this.markTaskAsUnSelected();
      } else {
        this.markTaskAsSelected();
      }
    }
  }

  /**
   * Unselect the other tasks that is not the selectedElement
   */
  unselectOtherTasks(selectedElement) {
    const children = Array.from(this.taskList.children);
    children.forEach((element) => {
      if (selectedElement !== element) {
        if (element.isSelected) {
          element.toggleTaskSelection();
        }
      }
    });
  }

  /**
   * Set isSelected instance variable to true and update UI
   */
  markTaskAsSelected() {
    this.isSelected = true;
    this.styleSelectedTask();
  }

  /**
   * Set isSelected instance variable to false and update UI
   */
  markTaskAsUnSelected() {
    this.isSelected = false;
    this.styleUnselectedTask();
  }

  /**
   * Update UI for when selecting task
   */
  styleSelectedTask() {
    this.style.border = TaskStyles.SELECTED_TASK_BORDER;
    this.style.borderRadius = TaskStyles.SELECTED_TASK_BORDER_RADIUS;
    this.style.top = TaskStyles.SELECTED_TASK_TOP_OFFSET;
    this.style.boxShadow = TaskStyles.NO_BOX_SHADOW;
  }

  /**
   * Update UI for when unselecting task
   */
  styleUnselectedTask() {
    this.style.border = TaskStyles.UNSELECTED_TASK_BORDER;
    this.style.background = TaskStyles.UNSELECTED_TASK_BACKGROUND;
    this.style.top = TaskStyles.UNSELECTED_TASK_TOP_OFFSET;
    this.style.boxShadow = TaskStyles.BOX_SHADOW;
  }

  /**
   * Increments the progress count of the task item
   */
  incrementTaskProgressCount() {
    const taskProgress = parseInt(this.getAttribute('progress'), 10);
    this.setAttribute('progress', taskProgress + 1);
    this.updateTaskProgressUI();
  }

  /**
   * Updates the UI count of the task
   * Updates the UI location of the task (move to completed if done)
   */
  updateTaskProgressUI() {
    const taskProgress = parseInt(this.getAttribute('progress'), 10);
    const taskEstimate = parseInt(this.getAttribute('estimate'), 10);

    const taskSessionCountUI = `${taskProgress}/${taskEstimate} Pomodoros`;
    this.shadowRoot.querySelector('.pomo-progress').textContent = taskSessionCountUI;
  }

  /**
   * Increment task distraction attribute
   */
  incrementTaskDistraction() {
    const taskDistraction = this.getAttribute('distraction');
    this.setAttribute('distraction', parseInt(taskDistraction, 10) + 1);
    this.updateTaskDistractionUI();
  }

  /**
   * Update the task UI when distraction is logged
   */
  updateTaskDistractionUI() {
    const taskDistractionHTML = this.shadowRoot.querySelector('.distraction');
    const taskDistraction = this.getAttribute('distraction');
    taskDistractionHTML.textContent = `Distraction(s): ${taskDistraction}`;
  }
}

window.customElements.define('task-item', TaskItem);
