import HtmlTemplates from '../constants/HtmlTemplates.js';
import TaskList from '../services/TaskList.js';

class TaskInput extends HTMLElement {
  constructor() {
    super();
    this.isSelected = false;
    this.taskList = new TaskList();
    this.onclick = () => this.toggleTaskSelection();
  }

  connectedCallback() {
    this.loadDOMElements();
  }

  loadDOMElements() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.class = 'task-input dropzone';
      this.shadowRoot.innerHTML = HtmlTemplates.TASK_INPUT;
    }
  }

  /**
   * Select/unselect task
   */
  toggleTaskSelection() {
    if (this.isSelected) {
      this.markTaskAsUnSelected();
    } else {
      this.markTaskAsSelected();
    }
  }

  /**
   * Set isSelected instance variable to true and update UI
   */
  markTaskAsSelected() {
    this.styleSelectedTask();
    this.taskList.selectTask(this);
    this.isSelected = true;
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
    this.shadowRoot.querySelector('.task-input').style.border = '2px solid #026670';
    this.shadowRoot.querySelector('.task-input').style.borderRadius = '30px';
    this.shadowRoot.querySelector('.task-input').style.background = '#9fedd7';
    this.shadowRoot.querySelector('.task-input').style.top = '3px';
    this.shadowRoot.querySelector('.task-input').style.boxShadow = '0px 0px';
  }

  /**
   * Update UI for when unselecting task
   */
  styleUnselectedTask() {
    this.shadowRoot.querySelector('.task-input').style.background = '#fffbf6';
    this.shadowRoot.querySelector('.task-input').style.top = '0px';
    this.shadowRoot
      .querySelector('.task-input')
      .style
      .boxShadow = '0 3px 6px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)';
  }
}
window.customElements.define('task-input', TaskInput);
