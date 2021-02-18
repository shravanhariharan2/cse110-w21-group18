// TODO: Implement
class TaskList extends HTMLElement {
  constructor(){
    super();
  }
  
  createList() {
    const list = document.createElement('li')
    list.className = 'TaskList';
    return list;
  }

}
