import Timer from './Timer.js';
import PomodoroSessionStates from '../constants/Enums.js';
import NotificationService from './NotificationService.js';
import Settings from './Settings.js';
import TaskList from './TaskList.js';

const TICK_SPEED = 1000;

let instance = null;

/**
 * Implements the PomodoroSession class. This singleton class is a controller for the timer
 * object which keeps track of pomodoro session durations
 */
class PomodoroSession {
  constructor() {
    if(instance) return instance;
    instance = this;

    this.timer = new Timer(TICK_SPEED);
    this.taskList = new TaskList();
    this.notifications = new NotificationService();
    this.settings = new Settings();
    
    this.currentState = PomodoroSessionStates.IDLE;
    this.sessionNumber = 0;


    this.timer.setTime(this.workSessionDuration);

    this.toggleSession = this.toggleSession.bind(this);
    this.run = this.run.bind(this);
    this.stop = this.stop.bind(this);
    this.updateDocument = this.updateDocument.bind(this);

    this.DOM_ELEMENTS = {
      timer: document.getElementById('timer-box'),
      shortBreak: document.getElementById('short-break'),
      longBreak: document.getElementById('long-break'),
      workSession: document.getElementById('pomo'),
      button: document.getElementById('start'),
    };

    this.DOM_ELEMENTS.button.addEventListener('click', this.toggleSession);

    instance = this;
    return instance;
  }

  /**
   * Loads a session config from browser storage
   */
  loadDurations() {
    this.workSessionDuration = parseInt(localStorage.getItem('workSessionDuration'), 10);
    this.shortBreakDuration = parseInt(localStorage.getItem('shortBreakDuration'), 10);
    this.longBreakDuration = parseInt(localStorage.getItem('longBreakDuration'), 10);
    this.numSessionsBeforeLongBreak = parseInt(localStorage.getItem('numSessionsBeforeLongBreak'), 10);
    this.pauseBeforeBreak = localStorage.getItem('pauseBeforeBreak') === 'true';
    this.pauseAfterBreak = localStorage.getItem('pauseAfterBreak') === 'true';
    console.log(this.workSessionDuration)
  }

  /**
   * Get debugging indicators
   * @return {array} an array of parameters
   */
  info() {
    const stateArray = [
      this.currentState,
      this.session,
      this.timer.getTime(),
      this.timer.running,
    ];

    return stateArray;
  }

  /**
   * Runs the timer for t-minutes, throws an error timer is stopped midway
   * @param  {type}  t [the number of minutes to run the timer]
   * @return {Promise}   [non-deterministic state, indicating timer completion]
   */
  async run(t) {
    this.timer.setTime(t);
    await this.timer.run();
  }

  /**
   * Stops the timer, resetting its time to the initial work session
   * duration
   */
  stop() {
    this.timer.stop();
    this.timer.setTime(this.workSessionDuration);
  }

  /**
   * Re-renders the timer DOM elements and styles
   */
  updateDocument() {
    if (this.currentState === PomodoroSessionStates.IDLE || this.currentState === PomodoroSessionStates.WORK_SESSION) {
      this.styleTimerForWorkSession();
    } else if (this.currentState === PomodoroSessionStates.SHORT_BREAK) {
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
   * @return {Promise} [description]
   */
  async toggleSession() {
    if (this.currentState === PomodoroSessionStates.IDLE) {
      await this.runWorkSession();
      if (this.sessionNumber !== this.numSessionsBeforeLongBreak) {
        await this.runShortBreak();
      } else {
        await this.runLongBreak();
      }
    } else {
      this.resetWorkSession();
    }
  }

  /**
   * Runs a work session, incrementing the session count after completion
   */
  async runWorkSession() {
    this.currentState = PomodoroSessionStates.WORK_SESSION;
    this.DOM_ELEMENTS.button.setAttribute('value', 'Stop');
    this.updateDocument();
    this.showCurrentTask();
    await this.run(this.workSessionDuration);
    this.sessionNumber += 1;
    this.notifications.notifyUser(this.currentState, this.sessionNumber);
  }

  /**
   * Runs a short break session
   */
  async runShortBreak() {
    this.currentState = PomodoroSessionStates.SHORT_BREAK;
    this.updateDocument();
    await this.run(this.shortBreakDuration);
    this.notifications.notifyUser(this.currentState, this.sessionNumber);
    this.idle();
  }

  /**
   * Runs a long break session, resetting the session count after completion
   */
  async runLongBreak() {
    this.currentState = PomodoroSessionStates.LONG_BREAK;
    this.updateDocument();
    await this.run(this.longBreakDuration);
    this.notifications.notifyUser(this.currentState, this.sessionNumber);
    this.sessionNumber = 0;
    this.idle();
  }

  /**
   * Resets the timer to the starting work session state
   */
  resetWorkSession() {
    this.stop();
    this.idle();
  }

  /**
   * Sets the session state to idle. The session type will be on work session and
   * the timer will be idle at the starting time
   */
  idle() {
    this.currentState = PomodoroSessionStates.IDLE;
    this.timer.setTime(this.workSessionDuration);
    this.DOM_ELEMENTS.button.setAttribute('value', 'Start');
    this.updateDocument();
  }

  showCurrentTask() {
    this.autoSelectTask();
  }

  /**
   * Selects the first task in the list if no task selected
   */
  autoSelectTask() {
    if (this.taskList.numTasks !== 0) {
      if (this.taskList.selectedTask === null) {
        const defaultTask = this.taskList.DOM_ELEMENTS.taskList.children[0];
        defaultTask.toggleTaskSelection();
        this.taskList.selectedTask = defaultTask;
      }
    }
  }
}

export default PomodoroSession;
