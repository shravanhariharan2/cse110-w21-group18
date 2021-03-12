import PomodoroSessionStates from '../js/constants/Enums.js';
import DisplayMessages from '../js/constants/DisplayMessages.js';
import HtmlMocks from './HtmlMocks.js';
import NotificationController from '../js/controllers/NotificationController.js';

// Set up the HTML
document.body.innerHTML = HtmlMocks.AUDIO;

test('notifyUser() plays an audio notification', () => {
  const notificationTest = new NotificationController();
  const playAudio = jest.fn();
  window.HTMLMediaElement.prototype.play = () => playAudio();
  window.Notification = { permission: 'granted' };
  notificationTest.browserNotify = jest.fn();
  notificationTest.notifyUser();
  expect(playAudio).toHaveBeenCalled();
});

test('createNotificationTitle() creates the correct title based on the current session type', () => {
  const notificationHeader = DisplayMessages.NOTIFICATION_HEADER;
  const workTitle = NotificationController.createNotificationTitle(PomodoroSessionStates.WORK_SESSION);
  const shortBreakTitle = NotificationController.createNotificationTitle(PomodoroSessionStates.SHORT_BREAK);
  const longBreakTitle = NotificationController.createNotificationTitle(PomodoroSessionStates.LONG_BREAK);
  expect(workTitle).toBe(notificationHeader + DisplayMessages.WORK_SESSION_COMPLETE);
  expect(shortBreakTitle).toBe(notificationHeader + DisplayMessages.SHORT_BREAK_COMPLETE);
  expect(longBreakTitle).toBe(notificationHeader + DisplayMessages.LONG_BREAK_COMPLETE);
});

test('createNotificationBody() creates the correct body based on the current session type and number', () => {
  const notificationTest = new NotificationController();
  const totalSessions = notificationTest.NUM_SESSIONS_BEFORE_LONG_BREAK;
  const shortBreakToWork = notificationTest.createNotificationBody(PomodoroSessionStates.SHORT_BREAK, 1);
  const longBreakToWork = notificationTest.createNotificationBody(PomodoroSessionStates.LONG_BREAK, 1);
  const workToShortBreak = notificationTest.createNotificationBody(PomodoroSessionStates.WORK_SESSION, 1);
  const workToLongBreak = notificationTest.createNotificationBody(PomodoroSessionStates.WORK_SESSION, totalSessions);
  expect(shortBreakToWork.body).toBe(DisplayMessages.WORK_NEXT_NOTIFY);
  expect(longBreakToWork.body).toBe(DisplayMessages.WORK_NEXT_NOTIFY);
  expect(workToShortBreak.body).toBe(DisplayMessages.SHORT_BREAK_NEXT_NOTIFY);
  expect(workToLongBreak.body).toBe(DisplayMessages.LONG_BREAK_NEXT_NOTIFY);
});
