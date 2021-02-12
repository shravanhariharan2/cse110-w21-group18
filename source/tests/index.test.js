// import {setTime, startTimer } from '../scripts/index';
const { setTime, startTimer } = require('../scripts/index');

// Clear the count of mock function calls after each test
afterEach(() => {
  jest.clearAllMocks();
});

jest.useFakeTimers();

// Mock function to test the timer decrementing
const mockSetTime = jest.fn();

test('timer ticks 1500 times when set to 25 minutes', () => {
  // Start the timer from 25 minutes
  startTimer(25, mockSetTime);
  // Increase the time by 25 minutes (1500 seconds)
  jest.advanceTimersByTime(1500000);
  // Expect the timer to have decremented 1500 times
  expect(mockSetTime).toHaveBeenCalledTimes(1500);
});

test('timer ticks 300 times when set to 5 minutes', () => {
  // Start the timer from 5 minutes
  startTimer(5, mockSetTime);
  // Increase the time by 5 minutes (300 seconds)
  jest.advanceTimersByTime(300000);
  // Expect the timer to have decremented 300 times
  expect(mockSetTime).toHaveBeenCalledTimes(300);
});

test('timer ticks 900 times when set to 15 minutes', () => {
  // Start the timer from 15 minutes
  startTimer(15, mockSetTime);
  // Increase the time by 15 minutes (900 seconds)
  jest.advanceTimersByTime(900000);
  // Expect the timer to have decremented 900 times
  expect(mockSetTime).toHaveBeenCalledTimes(900);
});

test('mock test for now for setTime', () => {
  document.body.innerHTML = `
    <div id="timer-box">
      <div id ="which-container">
          <div id="pomo">Pomodoro</div>
          <div id="short-break">Short Break</div>
          <div id="long-break">Long Break</div>
      </div>
      <div id="time">25 : 00</div>
      <div>
        <input type="button" id="start" value="Start">
      </div>
    </div>`
  setTime(25, 0)
  expect(true).toBe(true);
});
