import HtmlTemplates from '../constants/HtmlTemplates.js';
import { TaskStyles } from '../constants/Styles.js';
import Controllers from '../index.js';

class TaskInput extends HTMLElement {
  constructor() {
    super();
    this.isSelected = false;
    this.taskList = Controllers.taskList();
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
    this.shadowRoot.querySelector('.task-input').style.border = TaskStyles.SELECTED_TASK_BORDER;
    this.shadowRoot.querySelector('.task-input').style.borderRadius = TaskStyles.SELECTED_TASK_BORDER_RADIUS;
    this.shadowRoot.querySelector('.task-input').style.background = TaskStyles.SELECTED_TASK_BACKGROUND;
    this.shadowRoot.querySelector('.task-input').style.top = TaskStyles.SELECTED_TASK_TOP_OFFSET;
    this.shadowRoot.querySelector('.task-input').style.boxShadow = TaskStyles.NO_BOX_SHADOW;
  }

  /**
   * Update UI for when unselecting task
   */
  styleUnselectedTask() {
    this.shadowRoot.querySelector('.task-input').style.background = TaskStyles.UNSELECTED_TASK_BACKGROUND;
    this.shadowRoot.querySelector('.task-input').style.top = TaskStyles.UNSELECTED_TASK_TOP_OFFSET;
    this.shadowRoot.querySelector('.task-input').style.boxShadow = TaskStyles.BOX_SHADOW;
  }
}
window.customElements.define('task-input', TaskInput);
