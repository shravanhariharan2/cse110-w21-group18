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

async function sleep(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

test('Constructor initializes correct instance variables', () => {
  const PomoTest = new PomodoroSession();
  expect(PomoTest.sessionNumber).toBe(0);
  expect(PomoTest.currentState).toBe(PomodoroSessionStates.IDLE);
});

test('Session number increases after one pomodoro work session', async () => {
  jest.useFakeTimers();
  const PomoTest = new PomodoroSession();
  const expectedSession = PomoTest.sessionNumber + 1;
  PomoTest.timer.DEBUG = false;
  PomoTest.DEBUG = false;
  const promise = PomoTest.runWorkSession();
  jest.advanceTimersByTime(MS_IN_WORK_SESSION);
  await promise;
  expect(PomoTest.sessionNumber).toBe(expectedSession);
});

test('Timer resets and idles after a short break', async () => {
  jest.useFakeTimers();
  const PomoTest = new PomodoroSession();
  PomoTest.timer.DEBUG = false;
  PomoTest.DEBUG = false;
  const promise = PomoTest.runShortBreak();
  jest.advanceTimersByTime(MS_IN_SHORT_BREAK);
  await promise;
  expect(PomoTest.timer.minutes).toBe(PomoTest.WORK_SESSION_DURATION);
  expect(PomoTest.currentState).toBe(PomodoroSessionStates.IDLE);
});

test('Session resets to zero and timer idles after a long break', async () => {
  jest.useFakeTimers();
  const PomoTest = new PomodoroSession();
  PomoTest.timer.DEBUG = false;
  PomoTest.DEBUG = false;
  PomoTest.sessionNumber = 4
  const promise = PomoTest.runLongBreak();
  jest.advanceTimersByTime(MS_IN_LONG_BREAK);
  await promise;
  expect(PomoTest.sessionNumber).toBe(0);
  expect(PomoTest.currentState).toBe(PomodoroSessionStates.IDLE);
});

test('Stop resets the timer to the work session', () => {
  jest.useFakeTimers();
  const PomoTest = new PomodoroSession();
  PomoTest.timer.DEBUG = false;
  PomoTest.DEBUG = false;
  // Start the timer
  PomoTest.onClick();
  jest.advanceTimersByTime(MS_IN_WORK_SESSION/2);
  // Stop the timer
  PomoTest.onClick();
  expect(PomoTest.sessionNumber).toBe(0);
  expect(PomoTest.timer.minutes).toBe(25);
  expect(PomoTest.currentState).toBe(PomodoroSessionStates.IDLE);
});
<<<<<<< HEAD
=======

// create session object -> call onClick, advance timer by durations and check to see if idle at end and session
// number has been incremented
test('test onClick', () => {
  jest.useFakeTimers();
  const PomoTest = new PomodoroSession();
  // define relative test variables
  const expectedSessionNumber = PomoTest.sessionNumber + 1;
  const expectedState = 0;

  // disable console logging
  PomoTest.Timer.DEBUG = false;

  // run test
  PomoTest.onClick();
  jest.advanceTimersByTime(MS_IN_WORK_SESSION);
  jest.advanceTimersByTime(MS_IN_SHORT_BREAK);

  // sleep for 100 ms for async
  sleep(100);

  // check
  expect(PomoTest.sessionNumber).toBe(expectedSessionNumber);
  expect(PomoTest.currentState).toBe(expectedState);
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
>>>>>>> 6b28a346e5d64c5b964e30fb935d4d56f4692758
