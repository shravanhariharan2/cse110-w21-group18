import HtmlTemplates from '../constants/HtmlTemplates.js';

class TaskInput extends HTMLElement {
  connectedCallback() {
    this.loadDOMElements();
  }

  loadDOMElements() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.class = 'task-input dropzone';
      this.shadowRoot.innerHTML = HtmlTemplates.TASK_INPUT_UI;
    }
  }
}

window.customElements.define('task-input', TaskInput);
