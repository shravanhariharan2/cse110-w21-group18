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
    <input type="button" id="add-task" value="Add Task" title="Add Tasks"></input>
    <form id="task-add-input">
      <input type="text" id="add-task-name" placeholder="Task Name">
      <p id="expected">Expected Pomodoros:</p>
      <select name="pomos" id="pomos"></select>
      <input type="button" id="cancel-input" value="Cancel" title="Cancel Input"></input>
      <input type="button" id="add-notes" value="Add Notes">
      <textarea id="add-task-description" placeholder="Add Notes"></textarea>
      <input type="button" id="save-task" value="Save">
    </form>
    <div id="to-do-list"></div>
    <header id="completed-list-header">
      <input id="expand-completed" type="image" title="Expand View" src="./media/expand-icon.png">
    </header>
    <div id="completed-list"></div>
  `,
};

export default HtmlMocks;
