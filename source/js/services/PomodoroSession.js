import Timer from './Timer.js';
import PomodoroSessions from '../constants/Enums.js';
import NotificationService from './NotificationService.js';
import Settings from './Settings.js';
import TaskList from './TaskList.js';

const TICK_SPEED = 1;

let instance = null;

/**
 * Implements the PomodoroSession class. This singleton class is a controller for the timer
 * object which keeps track of pomodoro session durations
 */
class PomodoroSession {
  constructor() {
    if (instance) return instance;
    instance = this;

    this.timer = new Timer(TICK_SPEED);
    this.taskList = new TaskList();
    this.notifications = new NotificationService();
    this.settings = new Settings();
    this.sessionNumber = 0;
    this.fullListVisible = true;

    this.currentSession = PomodoroSessions.WORK;
    this.isIdle = true;

    this.DOM_ELEMENTS = {
      timer: document.getElementById('timer-box'),
      shortBreak: document.getElementById('short-break'),
      longBreak: document.getElementById('long-break'),
      workSession: document.getElementById('pomo'),
      button: document.getElementById('start'),
      taskListTitle: document.getElementById('list-title'),
    };

    this.DOM_ELEMENTS.button.addEventListener('click', this.toggleSession);
    if (this.taskList.DOM_ELEMENTS.viewAll !== null) {
      this.taskList.DOM_ELEMENTS.viewAll.onclick = () => this.viewAll();
    }
    this.setSessionAndTime(PomodoroSessions.WORK);

    instance = this;
    return instance;
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
    this.DOM_ELEMENTS.timer.style.background = '#9FEDD7';
  }

  /**
   * Styles the timer for short break session
   */
  styleTimerForShortBreak() {
    this.DOM_ELEMENTS.workSession.style.textDecoration = 'none';
    this.DOM_ELEMENTS.shortBreak.style.textDecoration = 'underline';
    this.DOM_ELEMENTS.longBreak.style.textDecoration = 'none';
    this.DOM_ELEMENTS.timer.style.background = '#FEF9C7';
  }

  /**
   * Styles the timer for long break session
   */
  styleTimerForLongBreak() {
    this.DOM_ELEMENTS.workSession.style.textDecoration = 'none';
    this.DOM_ELEMENTS.shortBreak.style.textDecoration = 'none';
    this.DOM_ELEMENTS.longBreak.style.textDecoration = 'underline';
    this.DOM_ELEMENTS.timer.style.background = '#FCE181';
  }

  /**
   * Links the timer button to the functionality
   */
  async toggleSession() {
    if (this.isIdle) {
      this.stopIdling();
      await this.performPomodoroSession();
    } else {
      try{
        this.resetToWorkSession();
      }
      catch{}
    }
  }

  /**
   * Performs a pomodoro session based on the current session type. If the session
   * is a work session, it will perform the work session and idle if needed, otherwise
   * performing either the short or long break sessions
   * @returns void
   */
  async performPomodoroSession() {
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
      this.setSessionAndTime(PomodoroSessions.SHORT_BREAK);
    } else {
      this.setSessionAndTime(PomodoroSessions.LONG_BREAK);
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
    this.setSessionAndTime(PomodoroSessions.WORK);
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
    this.setSessionAndTime(PomodoroSessions.WORK);
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
    this.setSessionAndTime(PomodoroSessions.WORK);
    this.taskList.hasActiveSession = true;
    this.taskList.loadTasks();
    if(!document.body.contains(this.taskList.selectedTask)){
      this.taskList.selectedTask = null;
    }
    if (this.taskList.selectedTask === null) {
      this.taskList.autoSelectTask();
    }
    this.taskList.showSelectedTask();
    await this.timer.run();
    this.sessionNumber += 1;
    this.updateTaskList();
    this.notifications.notifyUser(this.currentSession, this.sessionNumber);
  }

  /**
   * Runs a short break session
   */
  async runShortBreak() {
    this.setSessionAndTime(PomodoroSessions.SHORT_BREAK);
    this.taskList.hasActiveSession = false;
    this.showFullTaskList();
    await this.timer.run();
    this.notifications.notifyUser(this.currentSession, this.sessionNumber);
  }

  /**
   * Runs a long break session, resetting the session count after completion
   */
  async runLongBreak() {
    this.setSessionAndTime(PomodoroSessions.LONG_BREAK);
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
  setSessionAndTime(sessionType) {
    this.setSession(sessionType);
    this.setTime(sessionType);
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
   * Shows the full task list by button
   */
  viewAll() {
    if (this.fullListVisible) {
      this.showFullTaskList();
      this.taskList.DOM_ELEMENTS.viewAll.style.display = 'inline';
      this.fullListVisible = false;
      this.taskList.DOM_ELEMENTS.viewAll.innerHTML = `&#10134 Minimize Task List`;
      this.taskList.DOM_ELEMENTS.addTaskButton.after(this.taskList.DOM_ELEMENTS.viewAll);
    } else {
      this.taskList.loadTasks();
      if(!document.body.contains(this.taskList.selectedTask)){
        this.taskList.selectedTask = null;
      }
      if (this.taskList.selectedTask === null) {
        this.taskList.autoSelectTask();
      }
      this.taskList.showSelectedTask();
      this.fullListVisible = true;
      this.taskList.DOM_ELEMENTS.viewAll.innerHTML = `&#10133 Expand Task List`;
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
        if(this.taskList.selectedTask !== null){
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
    this.taskList.selectedTask = null;
    this.taskList.DOM_ELEMENTS.completedListTitle.style.display = 'inline';
    if (this.taskList.completedIsExpanded){
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
    this.fullListVisible = false;
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
    this.setSessionAndTime(PomodoroSessions.WORK);
  }

  updateTaskList() {
    if (this.taskList.selectedTask) {
      this.taskList.updateSelectedTaskSessionCount();
    }
  }
}

export default PomodoroSession;
