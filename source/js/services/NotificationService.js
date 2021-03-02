import PomodoroSessionStates from '../constants/Enums.js';
import DisplayMessages from '../constants/displayMessages.js';

const NUM_SESSIONS_BEFORE_LONG_BREAK = 4;

class NotificationService {
  /**
  * Implements the NotificationService class. This class is a controller for browser
  * and audio notifications
  */
  constructor() {
    this.DOM_ELEMENTS = {
      alarm: document.getElementById('timer-alarm'),
    };
  }

  /**
  * Notifies the user of session end through audio and browser (if allowed)
  * notifications
  * @param {int} currentState [an integer representing the state the user is in]
  * @param {int} sessionNumber [an integer representing the worksessions finished]
  */
  notifyUser(currentState, sessionNumber) {
    this.DOM_ELEMENTS.alarm.play();
    if (Notification.permission === 'granted') {
      NotificationService.browserNotify(currentState, sessionNumber);
    }
  }

  /**
   * Creates a browser notification depending on next session
   * @param {int} currentState [an integer representing the state the user is in]
   * @param {int} sessionNumber [an integer representing the worksessions finished]
   */
  static browserNotify(currentState, sessionNumber) {
    const notificationTitle = NotificationService.createNotificationTitle(currentState);
    const notificationBody = NotificationService.createNotificationBody(currentState, sessionNumber);
    new Notification(notificationTitle, notificationBody);
  }

  /**
   * Creates the title for browser notification
   * @param {int} currentState [an integer representing the state the user is in]
   */
  static createNotificationTitle(currentState) {
    let notificationTitle = DisplayMessages.NOTIFICATION_HEADER;
    if (currentState === PomodoroSessionStates.WORK_SESSION) {
      notificationTitle += DisplayMessages.WORK_SESSION_COMPLETE;
    } else if (currentState === PomodoroSessionStates.SHORT_BREAK) {
      notificationTitle += DisplayMessages.SHORT_BREAK_COMPLETE;
    } else {
      notificationTitle += DisplayMessages.LONG_BREAK_COMPLETE;
    }
    return notificationTitle;
  }

  /**
   * Creates the body for browser notification
   * @param {int} currentState [an integer representing the state the user is in]
   * @param {int} sessionNumber [an integer representing the worksessions finished]
   */
  static createNotificationBody(currentState, sessionNumber) {
    if (currentState === PomodoroSessionStates.WORK_SESSION) {
      if (sessionNumber !== NUM_SESSIONS_BEFORE_LONG_BREAK) {
        return { body: DisplayMessages.SHORT_BREAK_NEXT_NOTIFY };
      }
      return { body: DisplayMessages.LONG_BREAK_NEXT_NOTIFY };
    }
    return { body: DisplayMessages.WORK_NEXT_NOTIFY };
  }
}

export default NotificationService;
