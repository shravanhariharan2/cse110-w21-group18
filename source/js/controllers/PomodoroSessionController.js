import Constants from '../constants/Constants.js';
import PomodoroSessions from '../constants/Enums.js';
import { TimerStyles } from '../constants/Styles.js';

/**
 * Implements the PomodoroSessionController class. This class is a controller for the timer
 * object which keeps track of pomodoro session durations
 */
export default class PomodoroSessionController {
  constructor(timer, taskList, notifications) {
    this.timer = timer;
    this.taskList = taskList;
    this.notifications = notifications;

    this.sessionNumber = 0;
    this.numDistraction = 0;
    this.isFullListVisible = true;

    this.currentSession = PomodoroSessions.WORK;
    this.isIdle = true;

    this.DOM_ELEMENTS = {
      timer: document.getElementById('timer-box'),
      title: document.getElementById('title'),
      shortBreak: document.getElementById('short-break'),
      longBreak: document.getElementById('long-break'),
      workSession: document.getElementById('pomo'),
      button: document.getElementById('start'),
      taskListTitle: document.getElementById('list-title'),
      distraction: document.getElementById('distraction-icon'),
    };

    if (this.taskList.DOM_ELEMENTS.viewAll) {
      this.taskList.DOM_ELEMENTS.viewAll.onclick = () => this.viewAll();
    }
    this.loadTimerSettings();
  }

  /**
   * Loads the session config from browser storage
   */
  loadTimerSettings() {
    this.workSessionDuration = parseInt(localStorage.getItem('workSessionDuration'), 10);
    this.shortBreakDuration = parseInt(localStorage.getItem('shortBreakDuration'), 10);
    this.longBreakDuration = parseInt(localStorage.getItem('longBreakDuration'), 10);
    this.numSessionsBeforeLongBreak = parseInt(localStorage.getItem('numSessionsBeforeLongBreak'), 10);
    this.pauseBeforeBreak = localStorage.getItem('pauseBeforeBreak') === 'true';
    this.pauseAfterBreak = localStorage.getItem('pauseAfterBreak') === 'true';
    this.hideSeconds = localStorage.getItem('hideSeconds') === 'true';
    this.hideAlerts = localStorage.getItem('hideAlerts') === 'true';
    this.timer.loadHideSecondsBoolean();
    if (this.isIdle) {
      this.setTime(this.currentSession);
    }
  }

  /**
   * Re-renders the timer DOM elements and styles
   */
  styleTimerUI() {
    if (this.currentSession === PomodoroSessions.WORK) {
      this.styleTimerForWorkSession();
    } else if (this.currentSession === PomodoroSessions.SHORT_BREAK) {
      this.styleTimerForShortBreak();
    } else {
      this.styleTimerForLongBreak();
    }
  }

  /**
   * Styles the timer for work session
   */
  styleTimerForWorkSession() {
    this.DOM_ELEMENTS.workSession.style.textDecoration = 'underline';
    this.DOM_ELEMENTS.shortBreak.style.textDecoration = 'none';
    this.DOM_ELEMENTS.longBreak.style.textDecoration = 'none';
    this.DOM_ELEMENTS.timer.style.background = TimerStyles.WORK_SESSION_BACKGROUND;
  }

  /**
   * Styles the timer for short break session
   */
  styleTimerForShortBreak() {
    this.DOM_ELEMENTS.workSession.style.textDecoration = 'none';
    this.DOM_ELEMENTS.shortBreak.style.textDecoration = 'underline';
    this.DOM_ELEMENTS.longBreak.style.textDecoration = 'none';
    this.DOM_ELEMENTS.timer.style.background = TimerStyles.SHORT_BREAK_BACKGROUND;
  }

  /**
   * Styles the timer for long break session
   */
  styleTimerForLongBreak() {
    this.DOM_ELEMENTS.workSession.style.textDecoration = 'none';
    this.DOM_ELEMENTS.shortBreak.style.textDecoration = 'none';
    this.DOM_ELEMENTS.longBreak.style.textDecoration = 'underline';
    this.DOM_ELEMENTS.timer.style.background = TimerStyles.LONG_BREAK_BACKGROUND;
  }

  /**
   * Links the timer button to the functionality
   */
  async toggleSession() {
    if (this.isIdle) {
      this.stopIdling();
      await this.performPomodoroSession();
    } else if (localStorage.getItem('hideAlerts') === 'false') {
      if (window.confirm('End Session?')) {
        this.resetToWorkSession();
        this.disableDistractionMarker();
      }
    } else {
      this.resetToWorkSession();
      this.disableDistractionMarker();
    }
  }

  /**
   * Performs a pomodoro session based on the current session type. If the session
   * is a work session, it will perform the work session and idle if needed, otherwise
   * performing either the short or long break sessions
   * @returns void
   */
  async performPomodoroSession() {
    this.numDistraction = 0;
    if (this.currentSession === PomodoroSessions.WORK) {
      await this.performWorkSession();
      if (this.isIdle) return;
    }
    if (this.currentSession === PomodoroSessions.SHORT_BREAK) {
      await this.performShortBreakSession();
    } else {
      await this.performLongBreakSession();
    }
  }

  /**
   * Performs a work session. This routine runs the timer until completion,
   * where it then sets the session to either short or long break depending
   * on session count, and idles if requested by the user
   */
  async performWorkSession() {
    await this.runWorkSession();
    if (this.sessionNumber < this.numSessionsBeforeLongBreak) {
      this.setSessionTimeAndTitle(PomodoroSessions.SHORT_BREAK);
    } else {
      this.setSessionTimeAndTitle(PomodoroSessions.LONG_BREAK);
    }
    if (this.pauseBeforeBreak) {
      this.idle();
    }
  }

  /**
   * Performs a short break session. This routine runs the timer until completion,
   * where it then sets the session to work, and idles if requested by the user
   */
  async performShortBreakSession() {
    await this.runShortBreak();
    this.setSessionTimeAndTitle(PomodoroSessions.WORK);
    if (this.pauseAfterBreak) {
      this.idle();
    } else {
      await this.performPomodoroSession();
    }
  }

  /**
   * Performs a long break session. This routine runs the timer until completion,
   * where it then sets the session to work, and idles if requested by the user
   */
  async performLongBreakSession() {
    await this.runLongBreak();
    this.setSessionTimeAndTitle(PomodoroSessions.WORK);
    if (this.pauseAfterBreak) {
      this.idle();
    } else {
      await this.performPomodoroSession();
    }
  }

  /**
   * Runs a work session, incrementing the session count after completion
   */
  async runWorkSession() {
    this.setSessionTimeAndTitle(PomodoroSessions.WORK);
    this.taskList.hasActiveSession = true;
    this.taskList.loadTasks();
    if (!document.body.contains(this.taskList.selectedTask)) {
      this.taskList.selectedTask = null;
    }
    if (this.taskList.selectedTask === null) {
      this.taskList.autoSelectTask();
    }
    this.taskList.showSelectedTask();
    this.enableDistractionMarker();
    await this.timer.run();
    this.sessionNumber += 1;
    this.updateTaskList();
    this.notifications.notifyUser(this.currentSession, this.sessionNumber);
  }

  /**
   * Runs a short break session
   */
  async runShortBreak() {
    this.setSessionTimeAndTitle(PomodoroSessions.SHORT_BREAK);
    this.taskList.hasActiveSession = false;
    this.showFullTaskList();
    await this.timer.run();
    this.notifications.notifyUser(this.currentSession, this.sessionNumber);
  }

  /**
   * Runs a long break session, resetting the session count after completion
   */
  async runLongBreak() {
    this.setSessionTimeAndTitle(PomodoroSessions.LONG_BREAK);
    this.taskList.hasActiveSession = false;
    this.showFullTaskList();
    await this.timer.run();
    this.notifications.notifyUser(this.currentSession, this.sessionNumber);
    this.sessionNumber = 0;
  }

  /**
   * Sets the timer state to idle and changes the button to 'Start'
   */
  idle() {
    this.isIdle = true;
    this.DOM_ELEMENTS.button.setAttribute('value', 'Start');
  }

  /**
   * Sets the timer state to active and changes the button to 'Stop'
   */
  stopIdling() {
    this.isIdle = false;
    this.DOM_ELEMENTS.button.setAttribute('value', 'Stop');
  }

  /**
   * Sets the timer UI style and time based on session type
   * @param {number} sessionType The type of session to set
   */
  setSessionTimeAndTitle(sessionType) {
    this.setSession(sessionType);
    this.setTime(sessionType);
    this.setTitle(sessionType);
  }

  /**
   * Sets the session type of the timer and restyles timer
   * @param {number} sessionType The type of session to set
   */
  setSession(sessionType) {
    this.currentSession = sessionType;
    this.styleTimerUI();
  }

  /**
   * Sets the timer time based on the session type
   * @param {number} sessionType The type of session to set the timer to
   */
  setTime(sessionType) {
    if (sessionType === PomodoroSessions.WORK) {
      this.timer.setTime(this.workSessionDuration);
    } else if (sessionType === PomodoroSessions.SHORT_BREAK) {
      this.timer.setTime(this.shortBreakDuration);
    } else {
      this.timer.setTime(this.longBreakDuration);
    }
  }

  /**
   * Sets the title text based on session type
   * @param {number} sessionType The type of session to be displayed on the title
   */
  setTitle(sessionType) {
    if (sessionType === PomodoroSessions.WORK) {
      this.DOM_ELEMENTS.title.innerHTML = `${' '.repeat(Constants.TIME_PAD_SIZE)}Work Session`;
    } else if (sessionType === PomodoroSessions.SHORT_BREAK) {
      this.DOM_ELEMENTS.title.innerHTML = `${' '.repeat(Constants.TIME_PAD_SIZE)}Short Break`;
    } else {
      this.DOM_ELEMENTS.title.innerHTML = `${' '.repeat(Constants.TIME_PAD_SIZE)}Long Break`;
    }
  }

  /**
   * Shows the full task list by button
   */
  viewAll() {
    if (this.isFullListVisible) {
      this.showFullTaskList();
      this.taskList.DOM_ELEMENTS.viewAll.style.display = 'inline';
      this.isFullListVisible = false;
      this.taskList.DOM_ELEMENTS.viewAll.innerHTML = 'Hide Remaining Tasks';
      this.taskList.DOM_ELEMENTS.addTaskButton.after(this.taskList.DOM_ELEMENTS.viewAll);
    } else {
      this.taskList.loadTasks();
      if (this.taskList.selectedTask === null) {
        this.taskList.autoSelectTask();
      }
      this.taskList.showSelectedTask();
      this.isFullListVisible = true;
      this.taskList.DOM_ELEMENTS.viewAll.innerHTML = 'View All Tasks';
      this.taskList.DOM_ELEMENTS.taskList.after(this.taskList.DOM_ELEMENTS.viewAll);
    }
  }

  /**
   * Displays full taskList
   */
  showFullTaskList() {
    this.DOM_ELEMENTS.taskListTitle.style.marginTop = 'initial';
    this.DOM_ELEMENTS.taskListTitle.innerText = 'Task List';
    this.taskList.DOM_ELEMENTS.addTaskButton.style.display = 'block';
    const TLChildren = Array.from(this.taskList.DOM_ELEMENTS.taskList.children);
    TLChildren.forEach((element) => {
      element.style.display = 'grid';
      element.onclick = () => element.toggleTaskSelection();
      if (this.taskList.selectedTask !== null) {
        this.taskList.selectedTask.shadowRoot.querySelector('.expand-button').style.display = 'block';
        if (this.taskList.selectedTask.isExpanded === true) {
          this.taskList.selectedTask.shadowRoot.querySelector('.expand-button').click();
        }
      }
    });
    const CLChildren = Array.from(this.taskList.DOM_ELEMENTS.completedList.children);
    CLChildren.forEach((element) => {
      element.style.display = 'grid';
    });
    if (this.taskList.selectedTask) {
      this.taskList.selectedTask.styleSelectedTask();
    }
    this.taskList.DOM_ELEMENTS.completedListTitle.style.display = 'inline';
    if (this.taskList.completedIsExpanded) {
      this.taskList.DOM_ELEMENTS.expandCompleted.click();
    }
    this.taskList.DOM_ELEMENTS.viewAll.style.display = 'none';
    this.taskList.hideCompletedIfNoTasksExist();
  }

  /**
   * Resets the timer to the starting work session state
   */
  resetToWorkSession() {
    this.timer.stop();
    this.taskList.hasActiveSession = false;
    this.isFullListVisible = false;
    this.viewAll();
    this.showFullTaskList();
    this.idleAtWorkSession();
  }

  /**
   * Sets the session state to idle. The session type will be on work session and
   * the timer will be idle at the starting time
   */
  idleAtWorkSession() {
    this.idle();
    this.setSessionTimeAndTitle(PomodoroSessions.WORK);
  }

  /**
   * Update the task-list if not empty
   */
  updateTaskList() {
    if (this.taskList.selectedTask) {
      this.taskList.updateSelectedTaskSessionCount();
      this.taskList.updateStorage();
    }
  }

  /**
   * Disable the distraction marker to log distractions
   */
  disableDistractionMarker() {
    this.DOM_ELEMENTS.distraction.onclick = () => null;
    this.DOM_ELEMENTS.distraction.className = 'disabled';
  }

  /**
   * Enable the distraction marker to log distractions
   */
  enableDistractionMarker() {
    this.DOM_ELEMENTS.distraction.onclick = () => this.incrementDistraction();
    this.DOM_ELEMENTS.distraction.className = 'enabled';
  }

  /**
   * Increment distractions for the session and selected task
   */
  incrementDistraction() {
    this.numDistraction += 1;
    console.log('hi');
    if (this.taskList.selectedTask) {
      this.taskList.selectedTask.incrementTaskDistraction();
    }
  }
}
