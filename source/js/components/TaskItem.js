class TaskItem extends HTMLElement {
  constructor() {
    super();

    this.isExpanded = false;
    this.isComplete = false;
    this.isSelected = false;

    this.onclick = () => this.toggleTaskSelection();
  }

  connectedCallback() {
    this.setAttribute('draggable', 'true');
    this.loadDOMElements();
  }

  loadDOMElements() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = '<link rel=\'stylesheet\' href=\'styles/tasks.css\'>';
      const nameElement = this.createNameElement();
      const pomoProgressElement = this.createPomoProgressElement();
      const notesElement = this.createNotesElement();
      const expandButtonElement = this.createExpandButtonElement();
      const editButtonElement = this.createEditButtonElement();
      const removeButtonElement = this.createRemoveButtonElement();
      const checkboxElement = this.createCheckboxElement();

      this.shadowRoot.append(checkboxElement, nameElement, pomoProgressElement,
        expandButtonElement, notesElement, editButtonElement, removeButtonElement);
      this.shadowRoot.querySelector('.edit-button').style.display = 'none';
      this.shadowRoot.querySelector('.remove-button').style.display = 'none';
      this.shadowRoot.querySelector('.notes').style.display = 'none';
    }
  }

  createNameElement() {
    const taskName = this.shadowRoot.appendChild(document.createElement('p'));
    taskName.className = 'name';
    taskName.textContent = this.getAttribute('name');
    return taskName;
  }

  createPomoProgressElement() {
    const taskEstimate = this.shadowRoot.appendChild(document.createElement('p'));
    taskEstimate.className = 'pomo-progress';
    taskEstimate.textContent = `${this.getAttribute('progress')}/${this.getAttribute('estimate')} Pomodoros`;
    return taskEstimate;
  }

  createNotesElement() {
    const taskNotes = this.shadowRoot.appendChild(document.createElement('p'));
    taskNotes.className = 'notes';
    taskNotes.textContent = this.getAttribute('notes');
    return taskNotes;
  }

  createExpandButtonElement() {
    const button = this.shadowRoot.appendChild(document.createElement('input'));
    button.className = 'expand-button';
    button.type = 'image';
    button.title = 'Expand View';
    button.src = './media/icons/expand-icon.png';
    button.onclick = (event) => this.displayButtons(button, event);
    return button;
  }

  displayButtons(button, event) {
    event.stopPropagation();
    this.shadowRoot.querySelector('.expand-button').style.tranform = 'rotate(180deg)';
    if (this.isExpanded) {
      this.shadowRoot.querySelector('.edit-button').style.display = 'none';
      this.shadowRoot.querySelector('.remove-button').style.display = 'none';
      this.shadowRoot.querySelector('.notes').style.display = 'none';
      this.isExpanded = false;
      button.setAttribute('style', 'transform:rotate(0deg); -webkit-transform: rotate(0deg)');
      return;
    }
    if (this.isComplete) {
      this.shadowRoot.querySelector('.edit-button').style.display = 'none';
      this.shadowRoot.querySelector('.remove-button').style.display = 'inline';
      this.style.gridTemplateAreas = ' check taskName pomo', ' notes notes notes', ' remove remove remove';
      this.shadowRoot.querySelector('.remove-button').style.marginLeft = '200px';
    } else {
      this.shadowRoot.querySelector('.edit-button').style.display = 'inline';
      this.shadowRoot.querySelector('.remove-button').style.display = 'inline';
      this.style.gridTemplateAreas = ' check taskName pomo', ' notes notes notes', ' remove remove edit';
      this.shadowRoot.querySelector('.remove-button').style.marginLeft = '175px';
    }
    this.shadowRoot.querySelector('.notes').style.display = 'inline';
    this.isExpanded = true;
    button.setAttribute('style', 'transform:rotate(180deg); -webkit-transform: rotate(180deg)');
  }

  createEditButtonElement() {
    const button = this.shadowRoot.appendChild(document.createElement('input'));
    button.className = 'edit-button';
    button.type = 'image';
    button.title = 'Edit Task';
    button.src = './media/icons/edit-icon.png';
    button.textContent = 'Edit';
    button.onclick = (event) => this.allowEditing(event);

    return button;
  }

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
    inputElement.setAttribute('draggable', true);
    this.after(inputElement);
    inputElement.shadowRoot.querySelector('.add-task-name').value = this.shadowRoot.querySelector('.name').innerText;
    inputElement.shadowRoot.querySelector('.pomos').value = this.getAttribute('estimate');
    inputElement.shadowRoot.querySelector('.add-task-description').value = this.shadowRoot.querySelector('.notes').innerText;
    inputElement.shadowRoot.querySelector('.add-task-name').addEventListener('click', (event) => event.stopPropagation());
    inputElement.shadowRoot.querySelector('.pomos').addEventListener('click', (event) => event.stopPropagation());
    inputElement.shadowRoot.querySelector('.add-task-description').addEventListener('click', (event) => event.stopPropagation());
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
      inputElement.remove();
      // insert where it was before
      if (inputElement.id !== '1') {
        document.getElementById(inputElement.id - 1).before(newTask);
      }
      // if its the last task
      else {
        document.getElementById('to-do-list').appendChild(newTask);
      }
    });
    inputElement.shadowRoot.querySelector('.save-task').addEventListener('click', (event) => {
      event.stopPropagation();
      const newTask = document.createElement('task-item');
      newTask.setAttribute('name', inputElement.shadowRoot.querySelector('.add-task-name').value);
      newTask.setAttribute('estimate', inputElement.shadowRoot.querySelector('.pomos').value);
      newTask.setAttribute('progress', inputElement.getAttribute('progress'));
      newTask.setAttribute('notes', inputElement.shadowRoot.querySelector('.add-task-description').value);
      newTask.setAttribute('isComplete', inputElement.getAttribute('isComplete'));
      newTask.setAttribute('class', inputElement.getAttribute('class'));
      newTask.setAttribute('id', inputElement.id);
      newTask.setAttribute('draggable', inputElement.getAttribute('draggable'));
      inputElement.remove();
      // insert where it was before
      if (inputElement.id !== '1') {
        document.getElementById(inputElement.id - 1).before(newTask);
      }
      // if its the last task
      else {
        document.getElementById('to-do-list').appendChild(newTask);
      }
    });
  }

  createRemoveButtonElement() {
    const button = this.shadowRoot.appendChild(document.createElement('input'));
    button.className = 'remove-button';
    button.textContent = 'Remove';
    button.type = 'image';
    button.src = './media/icons/delete-icon.jpeg';
    button.title = 'Delete Task';
    button.onclick = (event) => this.removeTask(event);
    return button;
  }

  removeTask(event) {
    event.stopPropagation();
    // if (window.confirm('Delete Task?')) {
    this.remove();
    // }
  }

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

  markTaskAsComplete(taskId, checkboxLabel, event) {
    event.stopPropagation();
    const task = document.getElementById(taskId);
    const checkedElement = task.shadowRoot.querySelector('.checkbox');
    const taskList = document.getElementById('to-do-list');
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
      taskList.appendChild(this);
      this.setAttribute('draggable', true);
      this.setAttribute('class', 'dropzone');
      this.style.cursor = 'move';
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
    this.style.border = '2px solid #026670';
    this.style.borderRadius = '30px';
    this.style.background = '#9fedd7';
    this.style.top = '3px';
    this.style.boxShadow = '0px 0px';
  }

  /**
   * Update UI for when unselecting task
   */
  styleUnselectedTask() {
    this.style.background = '#fffbf6';
    this.style.top = '0px';
    this.style.boxShadow = '0 3px 6px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)';
  }
}

window.customElements.define('task-item', TaskItem);
