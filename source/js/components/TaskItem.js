// TODO: Implement
class TaskItem extends HTMLElement {
  constructor(){
    super();
  }
  connectedCallback() {
    this.isExpanded = false;
    this.isComplete = false;
    this.loadDOMElements();
  }

  loadDOMElements() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<link rel="stylesheet" href="styles/tasks.css">`;
    const nameElement = this.createNameElement();
    const pomoProgressElement = this.createPomoProgressElement();
    const notesElement = this.createNotesElement();
    const expandButtonElement = this.createExpandButtonElement();
    const editButtonElement = this.createEditButtonElement();
    const removeButtonElement = this.createRemoveButtonElement();
    const checkboxElement = this.createCheckboxElement();
    
    this.shadowRoot.append(checkboxElement, nameElement, pomoProgressElement,
        expandButtonElement, notesElement, editButtonElement, removeButtonElement, );
    this.shadowRoot.querySelector(".edit-button").style.display = "none"; 
    this.shadowRoot.querySelector(".remove-button").style.display = "none";
    this.shadowRoot.querySelector(".notes").style.display = "none";
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
    button.title = 'Expand View'
    button.src = './media/expand-icon.png';
    button.onclick = () => this.displayButtons(button);
    
    return button;
  }

  displayButtons(button) {
    this.shadowRoot.querySelector(".expand-button").style.tranform = "rotate(180deg)";
    if(this.isExpanded) {
       this.shadowRoot.querySelector(".edit-button").style.display = "none"; 
       this.shadowRoot.querySelector(".remove-button").style.display = "none";
       this.shadowRoot.querySelector(".notes").style.display = "none";
       this.isExpanded = false;
       button.setAttribute('style','transform:rotate(0deg); -webkit-transform: rotate(0deg)')
       return;
    }
    this.shadowRoot.querySelector(".edit-button").style.display = "inline"; 
    this.shadowRoot.querySelector(".remove-button").style.display = "inline";
    this.shadowRoot.querySelector(".notes").style.display = "inline";
    this.isExpanded = true;
    button.setAttribute('style','transform:rotate(180deg); -webkit-transform: rotate(180deg)')
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
    button.className = 'remove-button'
    button.textContent = 'Remove';
    button.type = 'image';
    button.src = './media/delete-icon.jpeg';
    button.title = 'Delete Task'
    button.onclick = () => this.removeTask(button);
    return button;
  }
  
  removeTask(button){
      if(window.confirm('Delete Task?')) this.remove();
  }
  createCheckboxElement(){
    const checkbox = this.shadowRoot.appendChild(document.createElement('label'));
    checkbox.className = 'task-checkbox';
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.checked = false;
    console.log(this.isComplete)
    this.setAttribute('isComplete', this.isComplete);
    checkbox.onclick = () => this.setComplete(input,checkbox);
    checkbox.appendChild(input);
    checkbox.innerHTML += `<span class="checkmark"></span>`;
    checkbox.title = "Mark as Done";
    return checkbox;
  }
// need help fixing this method, it keeps running twice on click for some reason
// or if i prevent default it doesn't mark the box
  setComplete(input, checkbox) {
    
    console.log('run');
    if(input.checked == false) {
        console.log(input.checked);
        this.setAttribute('isComplete', 'true');
        checkbox.title = "Unmark as Done";
        this.isComplete = true;
        input.checked = true;
    } 
    else {
        console.log(input.checked);
        this.setAttribute('isComplete', 'false');
        checkbox.title = "Mark as Done";
        this.isComplete = false;
        input.checked = false;
        }
  }

}
customElements.define('task-item', TaskItem);
