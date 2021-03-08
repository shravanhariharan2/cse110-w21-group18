import PomodoroSession from '../js/services/PomodoroSession.js';
import PomodoroSessionStates from '../js/constants/Enums.js';
import HtmlMocks from './HtmlMocks.js';

const MS_IN_WORK_SESSION = 25 * 60 * 1000;
const MS_IN_SHORT_BREAK = 5 * 60 * 1000;
const MS_IN_LONG_BREAK = 30 * 60 * 1000;

// Set up the HTML
document.body.innerHTML = HtmlMocks.TIMER + HtmlMocks.TASK_LIST;

const playAudio = jest.fn();
window.HTMLMediaElement.prototype.play = () => playAudio();

test('Constructor initializes correct instance variables', () => {
  const PomoTest = new PomodoroSession();
  expect(PomoTest.sessionNumber).toBe(0);
  expect(PomoTest.currentState).toBe(PomodoroSessionStates.IDLE);
});

test('Session number increases after one pomodoro work session', async () => {
  jest.useFakeTimers();
  const PomoTest = new PomodoroSession();
  PomoTest.notifications.notifyUser = jest.fn();
  const expectedSession = PomoTest.sessionNumber + 1;
  const promise = PomoTest.runWorkSession();
  jest.advanceTimersByTime(MS_IN_WORK_SESSION);
  await promise;
  expect(PomoTest.sessionNumber).toBe(expectedSession);
});

test('Timer resets and idles after a short break', async () => {
  jest.useFakeTimers();
  const PomoTest = new PomodoroSession();
  PomoTest.notifications.notifyUser = jest.fn();
  const promise = PomoTest.runShortBreak();
  jest.advanceTimersByTime(MS_IN_SHORT_BREAK);
  await promise;
  expect(PomoTest.timer.minutes).toBe(PomoTest.WORK_SESSION_DURATION);
  expect(PomoTest.currentState).toBe(PomodoroSessionStates.IDLE);
});

test('Session resets to zero and timer idles after a long break', async () => {
  jest.useFakeTimers();
  const PomoTest = new PomodoroSession();
  PomoTest.notifications.notifyUser = jest.fn();
  PomoTest.sessionNumber = 4;
  const promise = PomoTest.runLongBreak();
  jest.advanceTimersByTime(MS_IN_LONG_BREAK);
  await promise;
  expect(PomoTest.sessionNumber).toBe(0);
  expect(PomoTest.currentState).toBe(PomodoroSessionStates.IDLE);
});

test('Stop resets the timer to the work session', () => {
  jest.useFakeTimers();
  const PomoTest = new PomodoroSession();
  // Start the timer
  PomoTest.toggleSession();
  jest.advanceTimersByTime(MS_IN_WORK_SESSION / 2);
  // Stop the timer
  PomoTest.toggleSession();
  expect(PomoTest.sessionNumber).toBe(0);
  expect(PomoTest.timer.minutes).toBe(25);
  expect(PomoTest.currentState).toBe(PomodoroSessionStates.IDLE);
});