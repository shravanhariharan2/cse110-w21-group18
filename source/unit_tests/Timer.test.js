import Timer from '../js/services/Timer.js';

// Set up the HTML
document.body.innerHTML = `
  <div id="time"></div>
`;

test('Constructor initializes the correct instance variables', () => {
  const timerTest = new Timer(1);
  expect(timerTest.seconds).toBe(0);
  expect(timerTest.minutes).toBe(0);
  expect(timerTest.timeInterval).toBe(null);
  expect(timerTest.isRunning).toBe(false);
  expect(timerTest.clockSpeed).toBe(1);
});

test('setTime(time) sets the specified time', () => {
  const timerTest = new Timer(1);
  timerTest.setTime(25);
  expect(timerTest.minutes).toBe(25);
  expect(timerTest.seconds).toBe(0);
});

test('step() decreases the timer by one second', () => {
  const timerTest = new Timer(1);
  const mockPromise = jest.fn();
  timerTest.setTime(25);
  timerTest.step(mockPromise);
  expect(timerTest.seconds).toBe(59);
  expect(timerTest.minutes).toBe(24);
});

test('run() properly runs the timer for the correct duration', () => {
  const timerTest = new Timer(1);
  jest.useFakeTimers();
  timerTest.setTime(1);
  timerTest.run();
  for (let i = 0; i < 60; i += 1) {
    expect(timerTest.isRunning).toBe(true);
    jest.advanceTimersByTime(1);
  }
  expect(timerTest.isRunning).toBe(false);
});
