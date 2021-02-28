import PomodoroSession from '../js/services/PomodoroSession';
import PomodoroSessionStates from '../js/constants/Enums';

const MS_IN_WORK_SESSION = 25 * 60 * 1000;
const MS_IN_SHORT_BREAK = 5 * 60 * 1000;
const MS_IN_LONG_BREAK = 30 * 60 * 1000;

// Set up the HTML
document.body.innerHTML = `
  <div id="timer-box">
    <div id ="which-container">
      <div id="pomo">Pomodoro</div>
      <div id="short-break">Short Break</div>
      <div id="long-break">Long Break</div>
    </div>
    <div id="time"></div>
    <div>
      <input type="button" id="start" value="Start">
    </div>
  </div>
`;

test('Constructor initializes correct instance variables', () => {
  const PomoTest = new PomodoroSession();
  expect(PomoTest.sessionNumber).toBe(0);
  expect(PomoTest.currentState).toBe(PomodoroSessionStates.IDLE);
});

test('Session increases after one pomodoro work session', async () => {
  jest.useFakeTimers();
  const PomoTest = new PomodoroSession();
  PomoTest.timer.DEBUG = false;
  PomoTest.DEBUG = false;
  const promise = PomoTest.runWorkSession();
  jest.advanceTimersByTime(MS_IN_WORK_SESSION);
  await promise;
  expect(PomoTest.sessionNumber).toBe(1);
});

test('Short break runs for correct duration', async () => {
  jest.useFakeTimers();
  const PomoTest = new PomodoroSession();
  PomoTest.timer.DEBUG = false;
  PomoTest.DEBUG = false;
  const promise = PomoTest.runShortBreak();
  jest.advanceTimersByTime(MS_IN_SHORT_BREAK);
  await promise;
  expect(PomoTest.timer.isRunning).toBe(false);
});

test('Session resets to zero after long break', async () => {
  jest.useFakeTimers();
  const PomoTest = new PomodoroSession();
  PomoTest.timer.DEBUG = false;
  PomoTest.DEBUG = false;
  PomoTest.sessionNumber = 4
  const promise = PomoTest.runLongBreak();
  jest.advanceTimersByTime(MS_IN_LONG_BREAK);
  await promise;
  expect(PomoTest.sessionNumber).toBe(0);
});

test('Stop resets the timer to the work session', () => {
  jest.useFakeTimers();
  const PomoTest = new PomodoroSession();
  PomoTest.timer.DEBUG = false;
  PomoTest.DEBUG = false;
  PomoTest.onClick();
  jest.advanceTimersByTime(MS_IN_WORK_SESSION/2);
  PomoTest.onClick();
  expect(PomoTest.sessionNumber).toBe(0);
  expect(PomoTest.timer.minutes).toBe(25);
  expect(PomoTest.currentState).toBe(PomodoroSessionStates.IDLE);
});

/*
describe('Session number and states change correctly as the timer runs', () => {
  for(let sessionNumber = 1; sessionNumber <= PomoTest.NUM_SESSIONS_BEFORE_LONG_BREAK; sessionNumber++) {
    test('Session Idle to start and after breaks', () => {
      expect(PomoTest.currentState).toBe(PomodoroSessionStates.IDLE);
      PomoTest.onClick();
      jest.advanceTimersByTime(MS_IN_WORK_SESSION);
    });

    test('Session number increments when work session is finished', () => {
      expect(PomoTest.sessionNumber).toBe(sessionNumber);
    });

    test('Session state updates to the appropriate break', () => {
      if(sessionNumber == PomoTest.NUM_SESSIONS_BEFORE_LONG_BREAK) {
        expect(PomoTest.currentState).toBe(PomodoroSessionStates.LONG_BREAK);
        jest.advanceTimersByTime(MS_IN_LONG_BREAK);
      }
      else {
        expect(PomoTest.currentState).toBe(PomodoroSessionStates.SHORT_BREAK);
        jest.advanceTimersByTime(MS_IN_SHORT_BREAK);
      }
    });
  }

  test('Session and state restarts after long break', () => {
    expect(PomoTest.sessionNumber).toBe(0);
    expect(PomoTest.currentState).toBe(PomodoroSessionStates.IDLE);
  });
});
*/
