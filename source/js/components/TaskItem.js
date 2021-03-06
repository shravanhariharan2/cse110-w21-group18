class TaskItem extends HTMLElement {
  constructor() {
    super();

    this.isExpanded = false;
    this.isComplete = false;
    this.isSelected = false;

    this.onclick = () => this.markTaskAsSelected();
  }
  connectedCallback() {
    this.setAttribute('draggable', 'true');
    this.loadDOMElements();
  }

  loadDOMElements() {
    if (this.shadowRoot == null) {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `<link rel='stylesheet' href='styles/tasks.css'>`;
        const nameElement = this.createNameElement();
        const pomoProgressElement = this.createPomoProgressElement();
        const notesElement = this.createNotesElement();
        const expandButtonElement = this.createExpandButtonElement();
        const editButtonElement = this.createEditButtonElement();
        const removeButtonElement = this.createRemoveButtonElement();
        const checkboxElement = this.createCheckboxElement();
        
        this.shadowRoot.append(checkboxElement, nameElement, pomoProgressElement,
            expandButtonElement, notesElement, editButtonElement, removeButtonElement );
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
    taskEstimate.textContent = this.getAttribute('progress') + '/' + this.getAttribute('estimate') + ' Pomodoros';
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
    button.src = './media/expand-icon.png';
    button.onclick = () => this.displayButtons(button);
    return button;
  }

  displayButtons(button) {
    this.shadowRoot.querySelector('.expand-button').style.tranform = 'rotate(180deg)';
    if (this.isExpanded) {
       this.shadowRoot.querySelector('.edit-button').style.display = 'none'; 
       this.shadowRoot.querySelector('.remove-button').style.display = 'none';
       this.shadowRoot.querySelector('.notes').style.display = 'none';
       this.isExpanded = false;
       button.setAttribute('style','transform:rotate(0deg); -webkit-transform: rotate(0deg)');
       return;
    }
    this.shadowRoot.querySelector('.edit-button').style.display = 'inline'; 
    this.shadowRoot.querySelector('.remove-button').style.display = 'inline';
    this.shadowRoot.querySelector('.notes').style.display = 'inline';
    if (this.shadowRoot.querySelector('.notes').innerText == '') {
        this.shadowRoot.querySelector('.edit-button').style.marginTop = this.offsetHeight*0.65 + 'px';
    }
    else {
        this.shadowRoot.querySelector('.edit-button').style.marginTop = this.offsetHeight*0.50 + 'px';
    }
    this.isExpanded = true;
    button.setAttribute('style','transform:rotate(180deg); -webkit-transform: rotate(180deg)');
  }

  createEditButtonElement(){
    const button = this.shadowRoot.appendChild(document.createElement('input'));
    button.className = 'edit-button';
    button.type = 'image';
    button.title = 'Edit Task';
    button.src = './media/edit-icon.png';
    button.textContent = 'Edit';
    return button;
  }
  createRemoveButtonElement(){
    const button = this.shadowRoot.appendChild(document.createElement('input'));
    button.className = 'remove-button';
    button.textContent = 'Remove';
    button.type = 'image';
    button.src = './media/delete-icon.jpeg';
    button.title = 'Delete Task';
    button.onclick = () => this.removeTask();
    return button;
  }
  
  removeTask(){
      //if (window.confirm('Delete Task?')) {
          this.remove();
        // }
  }
  createCheckboxElement(){
    const checkboxLabel = this.shadowRoot.appendChild(document.createElement('label'));
    checkboxLabel.className = 'task-checkbox';
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('class', 'checkbox');
    input.checked = false;
    this.setAttribute('isComplete', false);
    checkboxLabel.onclick = () => this.markTaskAsComplete(this.id,checkboxLabel);
    checkboxLabel.appendChild(input);
    checkboxLabel.innerHTML += `<span class='checkmark'></span>`;
    checkboxLabel.title = 'Mark as Done';
    return checkboxLabel;
  }
  markTaskAsComplete(taskId,checkboxLabel) {
    const task = document.getElementById(taskId);
    const checkedElement = task.shadowRoot.querySelector('.checkbox');
    const taskList = document.getElementById('to-do-list');
    const checkedList = document.getElementById('completed-list');
    if (checkedElement.checked == true) {
        this.setAttribute('isComplete', 'true');
        checkboxLabel.title = 'Unmark as Done';
        checkedList.appendChild(this);
        this.setAttribute('id', -checkedList.childElementCount );
    } 
    else {
        this.setAttribute('isComplete', 'false');
        checkboxLabel.title = 'Mark as Done';
        taskList.appendChild(this);
        }
  }

  markTaskAsSelected() {
    if (this.isSelected) {
      this.isSelected = false;
      this.style.background = '#edeae500';
      this.style.top = '0px';
      this.style.boxShadow = '0px 3px';
    }
    else {
      this.markTaskAsUnselected();
    }
  }

  markTaskAsUnselected() {
    this.isSelected = true;
    this.style.border = '2px solid #026670';
    this.style.borderRadius = '30px';
    this.style.background = '#9fedd7';
    this.style.top = '3px';
    this.style.boxShadow = '0px 0px';
  }
}

window.customElements.define('task-item', TaskItem);
