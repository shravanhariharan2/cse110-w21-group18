import TimerController from '../js/controllers/TimerController.js';

// Set up the HTML
document.body.innerHTML = '<div id="time"></div>';

test('Constructor initializes the correct instance variables', () => {
  const timerController = new TimerController(1);
  expect(timerController.seconds).toBe(0);
  expect(timerController.minutes).toBe(0);
  expect(timerController.timeInterval).toBe(null);
  expect(timerController.isRunning).toBe(false);
  expect(timerController.clockSpeed).toBe(1);
});

test('setTime(time) sets the specified time', () => {
  const timerController = new TimerController(1);
  timerController.setTime(25);
  expect(timerController.minutes).toBe(25);
  expect(timerController.seconds).toBe(0);
});

test('step() decreases the timer by one second', () => {
  const timerController = new TimerController(1);
  const mockPromise = jest.fn();
  timerController.setTime(25);
  timerController.step(mockPromise);
  expect(timerController.seconds).toBe(59);
  expect(timerController.minutes).toBe(24);
});

test('run() properly runs the timer for the correct duration', () => {
  const timerController = new TimerController(1);
  jest.useFakeTimers();
  timerController.setTime(1);
  timerController.run();
  for (let i = 0; i < 60; i += 1) {
    expect(timerController.isRunning).toBe(true);
    jest.advanceTimersByTime(1);
  }
  expect(timerController.isRunning).toBe(false);
});
