const HtmlTemplates = {
  TASK_INPUT: `
    <link rel='stylesheet' href='styles/taskInput.css'>
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
    </form>`,
};

export default HtmlTemplates;
