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
      this.shadowRoot.innerHTML = `
      <link rel=\'stylesheet\' href=\'styles/taskInput.css\'>
        <form class="task-input">
			<input type="text" class="add-task-name" placeholder="Task Name">
			<p class="expected">Expected Pomodoros:</p>
			<img src="media/icons/clock.jpg" class="clock-clip-art">
			<select name="pomos" class="pomos">
				<option value="0">...</option>
				<option value="1">1 (25 min)</option>
				<option value="2">2 (50 min)</option>
			    <option value="3">3 (1hr 15min)</option>
				<option value="4">4 (1hr 40min)</option>
				<option value="5">5 (2hr 05min)</option>
				<option value="6">6 (2hr 30min)</option>
				<option value="7">7 (2hr 55min)</option>
				<option value="8">8 (3hr 20min)</option>
			</select>
			<input type="button" class="cancel-input" value="Cancel" title="Cancel Input"></input>
			<textarea class="add-task-description" placeholder="Add Notes"></textarea>
			<input type="button" class="save-task" value="Save">
		</form>`;
    }
  }

  /**
   * Select/unselect task
   */
  toggleTaskSelection() {
    console.log('hello');
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
    this.shadowRoot.querySelector('.task-input').style.boxShadow = '0 3px 6px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)';
  }
}
window.customElements.define('task-input', TaskInput);
