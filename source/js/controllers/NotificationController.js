import PomodoroSessionStates from '../constants/Enums.js';
import DisplayMessages from '../constants/DisplayMessages.js';

/**
* Implements the NotificationService class. This class is a controller for browser
* and audio notifications
*/
export default class NotificationController {
  constructor() {
    this.DOM_ELEMENTS = {
      alarm: document.getElementById('timer-alarm'),
    };
  }

  /**
  * Notifies the user of session end through audio and browser (if allowed)
  * notifications
  * @param {int} currentState an integer representing the state the user is in
  * @param {int} sessionNumber an integer representing the worksessions finished
  */
  notifyUser(currentState, sessionNumber, numSessionsBeforeLongBreak) {
    if (!NotificationController.hasAudioMuted()) {
      this.audioNotify();
    }
    if (Notification.permission === 'granted') {
      NotificationController.browserNotify(currentState, sessionNumber, numSessionsBeforeLongBreak);
    }
  }

  static hasAudioMuted() {
    return localStorage.getItem('muteAudio') === 'true';
  }

  audioNotify() {
    this.DOM_ELEMENTS.alarm.play();
  }

  /**
   * Creates a browser notification depending on next session
   * @param {int} currentState [an integer representing the state the user is in]
   * @param {int} sessionNumber [an integer representing the worksessions finished]
   */
  static browserNotify(currentState, sessionNumber, numSessionsBeforeLongBreak) {
    const notificationTitle = NotificationController.createNotificationTitle(currentState);
    const notificationBody = NotificationController.createNotificationBody(currentState, sessionNumber, numSessionsBeforeLongBreak);
    new Notification(notificationTitle, notificationBody);
  }

  /**
   * Creates the title for browser notification
   * @param {int} currentState [an integer representing the state the user is in]
   */
  static createNotificationTitle(currentState) {
    let notificationTitle = DisplayMessages.NOTIFICATION_HEADER;
    if (currentState === PomodoroSessionStates.WORK) {
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
  static createNotificationBody(currentState, sessionNumber, numSessionsBeforeLongBreak) {
    if (currentState === PomodoroSessionStates.WORK) {
      if (sessionNumber !== numSessionsBeforeLongBreak) {
        return { body: DisplayMessages.SHORT_BREAK_NEXT_NOTIFY };
      }
      return { body: DisplayMessages.LONG_BREAK_NEXT_NOTIFY };
    }
    return { body: DisplayMessages.WORK_NEXT_NOTIFY };
  }
}
