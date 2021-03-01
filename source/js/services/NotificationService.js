import PomodoroSessionStates from '../constants/Enums.js';
import DisplayMessages from '../constants/displayMessages.js';

const NUM_SESSIONS_BEFORE_LONG_BREAK = 4;

/**
 * Notifies the user of session end through audio and browser (if allowed)
 * notifications
 */
function notifyUser() {
  this.DOM_ELEMENTS.alarm.play();
  if (Notification.permission === "granted") {
    browserNotify();
  }
}

/**
 * Creates a browser notification depending on next session
 */
function browserNotify() {
  const notificationTitle = createNotificationTitle(this.currentState);
  const notificationBody = createNotificationBody(this.currentState, this.sessionNumber);
  new Notification(notificationTitle, notificationBody);
}

/**
 * Creates the title for browser notification
 */
function createNotificationTitle(sessionState) {
  let notificationTitle = DisplayMessages.NOTIFICATION_HEADER;
  if (sessionState === PomodoroSessionStates.WORK_SESSION) {
    notificationTitle += DisplayMessages.WORK_SESSION_COMPLETE;
  } else {
    if (sessionState === PomodoroSessionStates.SHORT_BREAK) {
      notificationTitle += DisplayMessages.SHORT_BREAK_COMPLETE;
    } else {
      notificationTitle += DisplayMessages.LONG_BREAK_COMPLETE;
    }
  }
  return notificationTitle;
}

/**
 * Creates the body for browser notification
 */
function createNotificationBody(sessionState, sessionNumber) {
  if (sessionState === PomodoroSessionStates.WORK_SESSION) {
    if (sessionNumber !== NUM_SESSIONS_BEFORE_LONG_BREAK) {
      return {body: DisplayMessages.SHORT_BREAK_NEXT_NOTIFY};
    } else {
      return {body: DisplayMessages.LONG_BREAK_NEXT_NOTIFY};
    }
  } else {
    return {body: DisplayMessages.WORK_NEXT_NOTIFY};
  }
}

export { notifyUser };
