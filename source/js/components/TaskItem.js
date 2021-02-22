// TODO: Implement
class TaskItem extends HTMLElement {
  constructor(){
    super();
  }

  connectedCallback() {
    this.isExpanded = false;
    this.loadDOMElements();
  }

  loadDOMElements() {
    this.attachShadow({ mode: 'open' });
    
    const nameElement = this.createNameElement();
    const pomoProgressElement = this.createPomoProgressElement();
    const notesElement = this.createNotesElement();
    const expandButtonElement = this.createExpandButtonElement();
    const editButtonElement = this.createEditButtonElement();
    const removeButtonElement = this.createRemoveButtonElement();
    const checkboxElement = this.createCheckboxElement();
    
    this.shadowRoot.append(nameElement,notesElement, editButtonElement, pomoProgressElement,
        removeButtonElement, expandButtonElement,checkboxElement);
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
    taskEstimate.textContent = this.getAttribute('progress') + '/' + this.getAttribute('estimate');
    return taskEstimate;
  }
  
  createNotesElement() {
    const taskNotes = this.shadowRoot.appendChild(document.createElement('p'));
    taskNotes.className = 'notes';
    taskNotes.textContent = this.getAttribute('notes');
    return taskNotes;
  }
  
  createExpandButtonElement() {
    const button = this.shadowRoot.appendChild(document.createElement('button'));
    button.className = 'expand-button'
    button.onclick = () => this.displayButtons();
    
    return button;
  }

  displayButtons() {
    if(this.isExpanded) {
       this.shadowRoot.getElementByClass("edit-button").style.display = "none"; 
       this.shadowRoot.getElementByClass("remove-button").style.display = "none";
       this.shadowRoot.getElementByClass("notes").style.display = "none";
       return;
    }
    this.shadowRoot.getElementByClass("edit-button").style.display = "inline"; 
    this.shadowRoot.getElementByClass("remove-button").style.display = "inline";
    this.shadowRoot.getElementByClass("notes").style.display = "inline";
    this.isExpanded = true;
  }

  createEditButtonElement(){
    const button = this.shadowRoot.appendChild(document.createElement('button'));
    button.className = 'edit-button'
    button.textContent = 'Edit';
    return button;
  }
  createRemoveButtonElement(){
    const button = this.shadowRoot.appendChild(document.createElement('button'));
    button.className = 'remove-button'
    button.textContent = 'Remove';
    return button;
  }
  
  createCheckboxElement(){
    const checkbox = this.shadowRoot.appendChild(document.createElement('input'));
    checkbox.className = 'task-checkbox'
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('checked', this.isComplete);
    checkbox.onclick = () => this.setComplete(checkbox);
    return checkbox;
  }

  setComplete(checkbox) {
    if(checkbox.getAttribute('isComplete') == true) {
      this.isComplete = true;
    } else {
      this.isComplete = false;
    }
  }

}
customElements.define('task-item', TaskItem);
