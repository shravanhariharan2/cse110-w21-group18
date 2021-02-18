// TODO: Implement
class TaskList extends HTMLElement {
  constructor(){
    super();
  }
  
  createList() {
    const list = document.createElement('li')
    list.className = 'tasklist';
    return list;
  }
  
  createName(taskList) {
    const taskName = taskList.appendChild(document.createElement('p'));
    taskName.className = 'name';
    taskName.textContent = this.getAttribute('name');
    return taskName;
  }
  
  createDuration(taskList) {
    const taskDuration = taskList.appendChild(document.createElement('p'));
    taskDuration.className = 'duration';
    taskDuration.textContent = this.getAttribute('duration');
    return taskDuration;
  }

}
