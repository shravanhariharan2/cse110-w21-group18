import Timer from './../js/services/Timer';

const timerTest = new Timer(1);

// Mock the DOM changes 
timerTest.updateDocument = jest.fn();
timerTest.DEBUG = false;

jest.useFakeTimers();

test('Constructor initializes correct instance variables', () => {
  expect(timerTest.seconds).toBe(0);
  expect(timerTest.minutes).toBe(0);
  expect(timerTest.timeInterval).toBe(null);
  expect(timerTest.isRunning).toBe(false);
  expect(timerTest.clockSpeed).toBe(1);
});

test('setTime sets the proper time', () => {
  timerTest.setTime(25); 
  expect(timerTest.minutes).toBe(25);
  expect(timerTest.seconds).toBe(0);
});

test('step decreases the timer by one second', () => {
  const mockPromise = jest.fn();
  timerTest.setTime(25); 
  timerTest.step(mockPromise);
  expect(timerTest.seconds).toBe(59);
  expect(timerTest.minutes).toBe(24);
});

test('run properly runs the timer for the correct duration', () => {
  timerTest.setTime(1);
  timerTest.run();
  for(let i = 0; i < 60; i++) {
    expect(timerTest.isRunning).toBe(true);
    jest.advanceTimersByTime(1);
  }
  expect(timerTest.isRunning).toBe(false);
});
