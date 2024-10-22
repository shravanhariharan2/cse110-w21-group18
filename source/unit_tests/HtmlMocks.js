const HTML = `
  <!DOCTYPE html>
  <html lang = "en">
    <head>
      <link rel="stylesheet" href="styles/index.css">
      <link rel="stylesheet" href="styles/tasks.css">
      <link rel="stylesheet" href="styles/settings.css">
      <link rel="stylesheet" href="styles/distraction-marker.css">
      <title id="title">      - Pomodoro Timer</title>
      <meta charset="UTF-8">
      <link rel="preconnect" href="https://fonts.gstatic.com">
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet">
    </head>

    <body>
      <div id="left-half">
        <div id="timer-box">
          <div id ="session-type">
            <div id="pomo">Pomodoro</div>
            <div id="short-break">Short Break</div>
            <div id="long-break">Long Break</div>
          </div>
          <div id="time"></div>
          <div>
            <input type="button" id="start" value="Start" title="Start Pomodoro Session">
          </div>
          <audio id="timer-alarm" src="media/audio/timer-alarm.mp3"></audio>
          </div>
      </div>
      <div class="side-bar">
        <div class="side-bar-icons">
          <div id="settings">
            <div id="settings-button">
              <img id="settings-icon" src="media/icons/settings-gear.png"></img>
            </div>
            <div id="settings-modal">
              <div id="settings-box">
                <p id="settings-text">Settings</p>
                <form id="settings-container">
                  <label class="c1" for="pomo-duration-select" style="word-wrap:break-word">
                    Pomodoro Duration
                    <select class="c2" name="pomo-duration-select" id="pomo-duration-select">
                      <option value="20">20 min</option>
                      <option value="25">25 min</option>
                      <option value="30">30 min</option>
                      <option value="35">35 min</option>
                      <option value="40">40 min</option>
                      <option value="45">45 min</option>
                    </select>
                  </label>
                  <label class="c1" for="short-duration-select" style="word-wrap:break-word">
                    Short Break Duration
                    <select class="c2" name="short-duration-select" id="short-duration-select">
                      <option value="3">3 min</option>
                      <option value="5">5 min</option>
                      <option value="7">7 min</option>
                      <option value="10">10 min</option>
                    </select>
                  </label>
                  <label class="c1" for="long-duration-select" style="word-wrap:break-word">
                    Long Break Duration
                    <select class="c2" name="long-duration-select" id="long-duration-select">
                      <option value="15">15 min</option>
                      <option value="20">20 min</option>
                      <option value="25">25 min</option>
                      <option value="30">30 min</option>
                      <option value="35">35 min</option>
                      <option value="40">40 min</option>
                      <option value="45">45 min</option>
                    </select>
                  </label>
                  <label class="c1" for="long-pomo-select" style="word-wrap:break-word">
                    Pomodoros Before Long Break
                    <select class="c2" name="long-pomo-select" id="long-pomo-select">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                    </select>
                  </label>
                  <label class="c1" for="pause-before-breaks">
                    <input id="pause-before-breaks" type="checkbox"> Pause timer at start of break
                  </label>
                  <label class="c1" for="pause-after-breaks">
                    <input id="pause-after-breaks" type="checkbox"> Pause timer at start of new work session
                  </label>
                  <label class="c1" for="hide-seconds">
                    <input id="hide-seconds" type="checkbox">Hide seconds on timer before 1 minute
                  </label>
                  <label class="c1" for="hide-alerts">
                    <input id="hide-alerts" type="checkbox">Hide confirmation alerts
                  </label>
                </form>
                <div id="settings-buttons">
                  <input type="button" id="cancel-button" value="Cancel">
                  <input type="button" id="save-button" value="Save">
                </div>
              </div>
            </div>
          </div>
          <div id="distraction-marker">
            <div id="distraction-button">
              <img id="distraction-icon" class="disabled" src="media/icons/thought-bubble.png"></img>
            </div>
          </div>
        </div>
      </div>
      <div id="right-half">
        <header id="to-do-list-header">
          <p id="list-title">Tasks</p>
        </header>
        <hr id="task-line-break">
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
        <button type="button" id="view-all">View All Tasks</button>
        <header id="completed-list-header">
          <p id="completed-list-title">Completed Tasks</p>
          <input id="expand-completed" type="image" title="Expand View" src="./media/icons/expand-icon.png">
        </header>
        <div id ="completed-list-box">
          <input type="button" id="clear-completed-list" value="Clear All" title="Clear All"></input>
          <div id="completed-list"></div>
        </div>
      </div>
    </body>
  </html>
`;

export default HTML;
