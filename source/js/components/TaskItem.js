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

}
