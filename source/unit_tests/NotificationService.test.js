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
  NotificationController.browserNotify = jest.fn();
  notificationTest.notifyUser();
  expect(playAudio).toHaveBeenCalled();
});

test('createNotificationTitle() creates the correct title based on the current session type', () => {
  const notificationHeader = DisplayMessages.NOTIFICATION_HEADER;
  const workTitle = NotificationController.createNotificationTitle(PomodoroSessionStates.WORK);
  const shortBreakTitle = NotificationController.createNotificationTitle(PomodoroSessionStates.SHORT_BREAK);
  const longBreakTitle = NotificationController.createNotificationTitle(PomodoroSessionStates.LONG_BREAK);
  expect(workTitle).toBe(notificationHeader + DisplayMessages.WORK_SESSION_COMPLETE);
  expect(shortBreakTitle).toBe(notificationHeader + DisplayMessages.SHORT_BREAK_COMPLETE);
  expect(longBreakTitle).toBe(notificationHeader + DisplayMessages.LONG_BREAK_COMPLETE);
});

test('createNotificationBody() creates the correct body based on the current session type and number', () => {
  const shortBreakToWork = NotificationController.createNotificationBody(PomodoroSessionStates.SHORT_BREAK, 1, 4);
  const longBreakToWork = NotificationController.createNotificationBody(PomodoroSessionStates.LONG_BREAK, 1, 4);
  const workToShortBreak = NotificationController.createNotificationBody(PomodoroSessionStates.WORK, 1, 4);
  const workToLongBreak = NotificationController.createNotificationBody(PomodoroSessionStates.WORK, 4, 4);
  expect(shortBreakToWork.body).toBe(DisplayMessages.WORK_NEXT_NOTIFY);
  expect(longBreakToWork.body).toBe(DisplayMessages.WORK_NEXT_NOTIFY);
  expect(workToShortBreak.body).toBe(DisplayMessages.SHORT_BREAK_NEXT_NOTIFY);
  expect(workToLongBreak.body).toBe(DisplayMessages.LONG_BREAK_NEXT_NOTIFY);
});
