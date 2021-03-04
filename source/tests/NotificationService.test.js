import NotificationService from '../js/services/NotificationService';
import PomodoroSessionStates from '../js/constants/Enums';
import DisplayMessages from '../js/constants/displayMessages.js';

// Set up the HTML
document.body.innerHTML = '<audio id="timer-alarm" src="media/audio/timer-alarm.mp3"></audio>';

test('notifyUser() plays an audio notification', () => {
  const playAudio = jest.fn();
  window.HTMLMediaElement.prototype.play = () => playAudio();
  window.Notification = { permission: 'granted' };
  const NotificationTest = new NotificationService();
  NotificationTest.browserNotify = jest.fn();
  NotificationTest.notifyUser();
  expect(playAudio).toHaveBeenCalled();
});

test('createNotificationTitle() creates the correct title based on the current session type', () => {
  const notificationHeader = DisplayMessages.NOTIFICATION_HEADER;
  const workTitle = NotificationService.createNotificationTitle(PomodoroSessionStates.WORK_SESSION);
  const shortBreakTitle = NotificationService.createNotificationTitle(PomodoroSessionStates.SHORT_BREAK);
  const longBreakTitle = NotificationService.createNotificationTitle(PomodoroSessionStates.LONG_BREAK);
  expect(workTitle).toBe(notificationHeader + DisplayMessages.WORK_SESSION_COMPLETE);
  expect(shortBreakTitle).toBe(notificationHeader + DisplayMessages.SHORT_BREAK_COMPLETE);
  expect(longBreakTitle).toBe(notificationHeader + DisplayMessages.LONG_BREAK_COMPLETE);
});

test('createNotificationBody() creates the correct body based on the current session type and number', () => {
  const NotificationTest = new NotificationService();
  const totalSessions = NotificationTest.NUM_SESSIONS_BEFORE_LONG_BREAK;
  const shortBreakToWork = NotificationTest.createNotificationBody(PomodoroSessionStates.SHORT_BREAK, 1);
  const longBreakToWork = NotificationTest.createNotificationBody(PomodoroSessionStates.LONG_BREAK, 1);
  const workToShortBreak = NotificationTest.createNotificationBody(PomodoroSessionStates.WORK_SESSION, 1);
  const workToLongBreak = NotificationTest.createNotificationBody(PomodoroSessionStates.WORK_SESSION, totalSessions);
  expect(shortBreakToWork.body).toBe(DisplayMessages.WORK_NEXT_NOTIFY);
  expect(longBreakToWork.body).toBe(DisplayMessages.WORK_NEXT_NOTIFY);
  expect(workToShortBreak.body).toBe(DisplayMessages.SHORT_BREAK_NEXT_NOTIFY);
  expect(workToLongBreak.body).toBe(DisplayMessages.LONG_BREAK_NEXT_NOTIFY);
});
