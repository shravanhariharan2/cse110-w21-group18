import PomodoroSessionStates from '../constants/Enums.js';

const NUM_SESSIONS_BEFORE_LONG_BREAK = 4;

const DisplayMessages = {
     NOTIFICATION_HEADER: "Pomodoro Timer - ",

     WORK_SESSION_COMPLETE: "Work session complete.",
     SHORT_BREAK_COMPLETE: "Short break complete.",
     LONG_BREAK_COMPLETE: "Long break complete.",

     WORK_NEXT_NOTIFY: "Start your next work session!",
     SHORT_BREAK_NEXT_NOTIFY: "Time for a short break!",
     LONG_BREAK_NEXT_NOTIFY: "Time for a long break!"
};

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
    let notificationBody;
    if (sessionState === PomodoroSessionStates.WORK_SESSION) {
        if (sessionNumber !== NUM_SESSIONS_BEFORE_LONG_BREAK) {
            notificationBody = {body: DisplayMessages.SHORT_BREAK_NEXT_NOTIFY};
        } else {
            notificationBody = {body: DisplayMessages.LONG_BREAK_NEXT_NOTIFY};
        }
    } else {
        notificationBody = {body: DisplayMessages.WORK_NEXT_NOTIFY};
    }
    return notificationBody;
}

export { createNotificationTitle, createNotificationBody };