import PomodoroSessionController from '../js/controllers/PomodoroSessionController.js';
import PomodoroSessionStates from '../js/constants/Enums.js';
import HtmlMocks from './HtmlMocks.js';
import TimerController from '../js/controllers/TimerController.js';
import TaskListController from '../js/controllers/TaskListController.js';
import NotificationController from '../js/controllers/NotificationController.js';

const MS_IN_WORK_SESSION = 25 * 60 * 1000;
const MS_IN_SHORT_BREAK = 5 * 60 * 1000;
const MS_IN_LONG_BREAK = 30 * 60 * 1000;

document.body.innerHTML = HtmlMocks.SETTINGS + HtmlMocks.TIMER + HtmlMocks.TASK_LIST;

const playAudio = jest.fn();
window.HTMLMediaElement.prototype.play = () => playAudio();

const getNewPomodoroInstance = () => {
  const timerController = new TimerController(1000);
  const taskListController = new TaskListController();
  const notificationController = new NotificationController();
  return new PomodoroSessionController(timerController, taskListController, notificationController);
}


test('Constructor initializes correct instance variables', () => {
  const pomoTest = getNewPomodoroInstance();
  expect(pomoTest.sessionNumber).toBe(0);
  pomoTest.currentSession = PomodoroSessionStates.WORK;
  expect(pomoTest.isIdle).toBe(true);
});

test('Session number increases after one pomodoro work session', async () => {
  jest.useFakeTimers();
  const pomoTest = getNewPomodoroInstance();
  pomoTest.notifications.notifyUser = jest.fn();
  const expectedSession = pomoTest.sessionNumber + 1;
  const promise = pomoTest.runWorkSession();
  jest.advanceTimersByTime(MS_IN_WORK_SESSION);
  await promise;
  expect(pomoTest.sessionNumber).toBe(expectedSession);
});

test('Timer resets and idles after a short break', async () => {
  jest.useFakeTimers();
  const pomoTest = getNewPomodoroInstance();
  pomoTest.notifications.notifyUser = jest.fn();
  const promise = pomoTest.performShortBreakSession();
  jest.advanceTimersByTime(MS_IN_SHORT_BREAK);
  await promise;
  expect(pomoTest.timer.minutes).toBe(pomoTest.workSessionDuration);
  expect(pomoTest.isIdle).toBe(true);
});

test('Session resets to zero and timer idles after a long break', async () => {
  jest.useFakeTimers();
  const pomoTest = getNewPomodoroInstance();
  pomoTest.sessionNumber = 4;
  const promise = pomoTest.runLongBreak();
  jest.advanceTimersByTime(MS_IN_LONG_BREAK);
  await promise;
  expect(pomoTest.sessionNumber).toBe(0);
  expect(pomoTest.isIdle).toBe(true);
});

test('Stop resets the timer to the work session', () => {
  jest.useFakeTimers();
  const pomoTest = getNewPomodoroInstance();
  // Start the timer
  pomoTest.toggleSession();
  jest.advanceTimersByTime(MS_IN_WORK_SESSION / 2);
  // Stop the timer
  pomoTest.toggleSession();
  expect(pomoTest.sessionNumber).toBe(0);
  expect(pomoTest.timer.minutes).toBe(25);
  expect(pomoTest.isIdle).toBe(true);
});
