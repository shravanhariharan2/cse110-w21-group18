const HtmlMocks = {
  TIMER: `
    <div id="timer-box">
    <div id ="which-container">
      <div id="pomo">Pomodoro</div>
      <div id="short-break">Short Break</div>
      <div id="long-break">Long Break</div>
    </div>
    <div id="time"></div>
    <div>
      <input type="button" id="start" value="Start">
    </div>
    <audio id="timer-alarm" src="media/audio/timer-alarm.mp3"></audio>
    </div>
   `,

  TASK_LIST: `
    <header id="to-do-list-header">
      <p id="list-title">Task List</p>
    </header>
    <input type="button" id="add-task" value="Add Task" title="Add Tasks"></input>
    <form id="task-add-input">
      <input type="text" id="add-task-name" placeholder="Task Name">
      <p id="expected">Expected Pomodoros:</p>
      <img src="./media/icons/clock.jpg" id="clock-clip-art">
      <select name="pomos" id="pomos">
        <option value="1">1 (25 min)</option>
        <option value="2">2 (50 min)</option>
        <option value="3">3 (1hr 15min)</option>
        <option value="4">4 (1hr 40min)</option>
        <option value="5">5 (2hr 05min)</option>
        <option value="6">6 (2hr 30min)</option>
        <option value="7">7 (2hr 55min)</option>
        <option value="8">8 (3hr 20min)</option>
      </select>
      <input type="button" id="cancel-input" value="Cancel" title="Cancel Input"></input>
      <input type="button" id="add-notes" value="Add Notes">
      <textarea id="add-task-description" placeholder="Add Notes"></textarea>
      <input type="button" id="save-task" value="Save">
    </form>
    <div id="to-do-list"></div>
    <button type="button" id="view-all">&#10133 Expand Task List</button>
    <header id="completed-list-header">
      <p id="completed-list-title">Completed Tasks</p>
      <input id="expand-completed" type="image" title="Expand View" src="./media/icons/expand-icon.png">
    </header>
    <div id="completed-list"></div>
  `,
  SETTINGS: `
    <div id="settings-button">
      <img id="settings-icon" src="media/icons/settings-gear.png"></img>
    </div>
    <div id="settings-modal">
      <form id="settings-container">
        <select class="c2" name="pomo-duration-select" id="pomo-duration-select"></select>
        <select class="c2" name="short-duration-select" id="short-duration-select"></select>
        <select class="c2" name="long-duration-select" id="long-duration-select"></select>
        <select class="c2" name="long-pomo-select" id="long-pomo-select"></select>
        <input id="pause-before-breaks" type="checkbox"> Pause timer at start of break
        <input id="pause-after-breaks" type="checkbox"> Pause timer at start of new work session
      </form>
      <div id="settings-buttons">
        <input type="button" id="cancel-button" value="Cancel">
        <input type="button" id="save-button" value="Save">
      </div>
    </div>
  `,
  AUDIO: '<audio id="timer-alarm" src="media/audio/timer-alarm.mp3"></audio>',
};

export default HtmlMocks;
