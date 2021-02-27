import Timer from './Timer.js';
import PomodoroSessionStates from '../constants/Enums.js';
import { createNotificationTitle, createNotificationBody } from '../constants/displayMessages.js';

const TICK_SPEED = 1000;

/**
 * Implements the PomodoroSession class. This class is a controller for the timer
 * object which keeps track of pomodoro session durations
 */
class PomodoroSession {
  constructor() {
    this.DEBUG = true;

    this.timer = new Timer(TICK_SPEED);
    this.currentState = PomodoroSessionStates.IDLE;
    this.sessionNumber = 0;

    this.loadConfig();
    this.timer.setTime(this.WORK_SESSION_DURATION);

    this.DEBUG_PRINT = this.DEBUG_PRINT.bind(this);
    this.onClick = this.onClick.bind(this);
    this.run = this.run.bind(this);
    this.stop = this.stop.bind(this);
    this.updateDocument = this.updateDocument.bind(this);

    this.DOM_ELEMENTS = {
      timer: document.getElementById('timer-box'),
      shortBreak: document.getElementById('short-break'),
      longBreak: document.getElementById('long-break'),
      workSession: document.getElementById('pomo'),
      button: document.getElementById('start'),
      alarm: document.getElementById("timer-alarm")
    };

    this.DOM_ELEMENTS.button.addEventListener('click', this.onClick);
  }

  /**
   * Loads a session config. Currently loads default configs, but will
   * take as input a path to config later on
   */
  loadConfig() {
    this.WORK_SESSION_DURATION = 25;
    this.SHORT_BREAK_DURATION = 5;
    this.LONG_BREAK_DURATION = 30;
    this.NUM_SESSIONS_BEFORE_LONG_BREAK = 4;
  }

  /**
   * Get debugging indicators
   * @return {[array]} an array of parameters
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
   * @param  {[type]}  t [the number of minutes to run the timer]
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
    this.timer.setTime(this.WORK_SESSION_DURATION);
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
  async onClick() {
    if (this.currentState === PomodoroSessionStates.IDLE) {
      await this.runWorkSession();
      if (this.sessionNumber !== this.NUM_SESSIONS_BEFORE_LONG_BREAK) {
        await this.runShortBreak();
      } else {
        await this.runLongBreak();
      }
      this.idle();
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
    await this.run(this.WORK_SESSION_DURATION);
    this.sessionNumber += 1;
    this.notifyUser();
    this.DEBUG_PRINT('Work finished');
  }

  /**
   * Runs a short break session
   */
  async runShortBreak() {
    this.currentState = PomodoroSessionStates.SHORT_BREAK;
    this.updateDocument();
    await this.run(this.SHORT_BREAK_DURATION);
    this.notifyUser();
    this.DEBUG_PRINT('Short break finished');
  }

  /**
   * Runs a long break session, resetting the session count after completion
   */
  async runLongBreak() {
    this.currentState = PomodoroSessionStates.LONG_BREAK;
    this.updateDocument();
    await this.run(this.LONG_BREAK_DURATION);
    this.notifyUser();
    this.sessionNumber = 0;
    this.DEBUG_PRINT('Long break finished');
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
    this.timer.setTime(this.WORK_SESSION_DURATION);
    this.DOM_ELEMENTS.button.setAttribute('value', 'Start');
    this.updateDocument();
  }

  /**
   * Notifies the user of session end through audio and browser (if allowed)
   * notifications
   */
  notifyUser() {
    this.DOM_ELEMENTS.alarm.play();
    if (Notification.permission === "granted") {
      this.browserNotify();
    }
  }

  /**
   * Creates a browser notification depending on next session
   */
  browserNotify() {
    const notificationTitle = createNotificationTitle(this.currentState);
    const notificationBody = createNotificationBody(this.currentState, this.sessionNumber);
    new Notification(notificationTitle, notificationBody);
  }

  /**
   * Prints debug statements to console based on global debug flag
   * @param {[string]} x [The statement to print]
   */
  DEBUG_PRINT(x) {
    if (this.DEBUG) {
      console.log(x);
    }
  }
}

export default PomodoroSession;
