import PomodoroSessionStates from '../constants/Enums.js';
import DisplayMessages from '../constants/displayMessages.js';

const NUM_SESSIONS_BEFORE_LONG_BREAK = 4;

class NotificationService {
  /**
  * Notifies the user of session end through audio and browser (if allowed)
  * notifications
  * @param {DOM object} alarm [DOM element reference for timer-alarm]
  * @param {int} sessionState [an integer representing the state the user is in]
  * @param {int} sessionNumber [an integer representing the worksessions finished]
  */
  notifyUser(alarm, sessionState, sessionNumber) {
    alarm.play();
    if (Notification.permission === 'granted') {
      this.browserNotify(sessionState, sessionNumber);
    }
  }

  /**
   * Creates a browser notification depending on next session
   * @param {int} sessionState [an integer representing the state the user is in]
   * @param {int} sessionNumber [an integer representing the worksessions finished]
   */
  browserNotify(sessionState, sessionNumber) {
    const notificationTitle = this.createNotificationTitle(sessionState);
    const notificationBody = this.createNotificationBody(sessionState, sessionNumber);
    new Notification(notificationTitle, notificationBody);
  }

  /**
   * Creates the title for browser notification
   * @param {int} sessionState [an integer representing the state the user is in]
   */
  static createNotificationTitle(sessionState) {
    let notificationTitle = DisplayMessages.NOTIFICATION_HEADER;
    if (sessionState === PomodoroSessionStates.WORK_SESSION) {
      notificationTitle += DisplayMessages.WORK_SESSION_COMPLETE;
    } else {
      if (sessionState === PomodoroSessionStates.SHORT_BREAK) {
        notificationTitle += DisplayMessages.SHORT_BREAK_COMPLETE;
      }
      notificationTitle += DisplayMessages.LONG_BREAK_COMPLETE;
    }
    return notificationTitle;
  }

  /**
   * Creates the body for browser notification
   * @param {int} sessionState [an integer representing the state the user is in]
   * @param {int} sessionNumber [an integer representing the worksessions finished]
   */
  static createNotificationBody(sessionState, sessionNumber) {
    if (sessionState === PomodoroSessionStates.WORK_SESSION) {
      if (sessionNumber !== NUM_SESSIONS_BEFORE_LONG_BREAK) {
        return { body: DisplayMessages.SHORT_BREAK_NEXT_NOTIFY };
      }
      return { body: DisplayMessages.LONG_BREAK_NEXT_NOTIFY };
    }
    return { body: DisplayMessages.WORK_NEXT_NOTIFY };
  }
}

export default NotificationService;
