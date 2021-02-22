/**
 * setTimeOnUI(minutes, seconds)
 * startTimer(durationInMinutes) - done
 * startTimerSession()
 * endTimerSession()
 * updateUIForSessionEnd()
 *
 * Notes:
 * - Lots of coupling happening within these functions that make it harder to test
 * certain assertions
 * - UI changes are happening inside JS. Can we move them outside?
 *  - answer: use dynamic classes in JS that are defined in the CSS
 * - Move constants to config/index.js
 *  Timer:
 *  - properties:
 *    - minutes
 *    - seconds
 *    - secondsPassed
 *  - functions:
 *    - start(durationInMinutes)
 *    - end()
 *
 *  PomodoroSession:
 *  - PomodoroSession()
 *  - start()
 *  - end()
 *  - getSessionType() - 0 - working, 1 - short break, 2 - long break
 *  - increment()
 *  - getSessionNumber()
 */

// times that we will want to count down from

const POMO_TIME = 25;

const SHORT_BREAK = 5;

const LONG_BREAK = 30;

const NUM_OF_SESSIONS_IN_POMO = 4;

const DEFAULT_LOCALE = 'en-US';

const TIMER_DISPLAY_SETTINGS = { minimumIntegerDigits: 2, useGrouping: false };

let sessionNumber = 0;
let isBreak = false;
let timer;

// listens to start initial pomo session
const startButton = document.getElementById('start');
startButton.addEventListener('click', startTimerSession);

function setTimeOnUI(minutes, seconds) {
  // two digits nums for mins and secs
  document.getElementById('time').innerHTML = `${minutes.toLocaleString(DEFAULT_LOCALE, TIMER_DISPLAY_SETTINGS)
  } : ${seconds.toLocaleString(DEFAULT_LOCALE, TIMER_DISPLAY_SETTINGS)}`;
}

// function to actually run the timer with input length
function startTimer(durationInMinutes) {
  // starting time
  let minutes = durationInMinutes - 1;
  let seconds = 59;
  let isfinished = false;

  // runs every second
  timer = setInterval(() => {
    setTimeOnUI(minutes, seconds);

    // end timer
    if (isfinished === true) {
      clearInterval(timer);

      // update session indicators
      if (isBreak) {
        isBreak = false;
        startButton.removeEventListener('click', endTimerSession);
        startButton.addEventListener('click', startTimerSession);

        updateUIForSessionEnd();
      } else {
        sessionNumber += 1;
        isBreak = true;

        updateUIForSessionEnd();
        // will also update UI button
        startTimerSession();
      }
      return;
    }

    if (seconds <= 0) {
      minutes -= 1;
      seconds = 60;
      if (minutes < 0) {
        isfinished = true;
      }
    }
    seconds -= 1;
  }, 10);
  startButton.disabled = false;
}

function startTimerSession() {
  // update button text for session start
  startButton.value = 'End';

  startButton.removeEventListener('click', startTimerSession);
  startButton.addEventListener('click', endTimerSession);

  if (!isBreak) {
    startTimer(POMO_TIME);
  } else {
    const isShortBreak = sessionNumber !== NUM_OF_SESSIONS_IN_POMO;
    if (isShortBreak) {
      startTimer(SHORT_BREAK);
    } else {
      startTimer(LONG_BREAK);
      sessionNumber = 0;
    }
  }
}

function endTimerSession() {
  clearInterval(timer);

  // go to next pomo session if break and ended break early
  if (isBreak) {
    isBreak = false;
  }

  updateUIForSessionEnd();

  startButton.removeEventListener('click', endTimerSession);
  startButton.addEventListener('click', startTimerSession);
}

function updateUIForSessionEnd() {
  startButton.value = 'Start';

  document.getElementById('pomo').style.textDecoration = 'none';
  document.getElementById('short-break').style.textDecoration = 'none';
  document.getElementById('long-break').style.textDecoration = 'none';

  // is pomo session
  if (!isBreak) {
    document.getElementById('timer-box').style.background = '#9FEDD7';
    document.getElementById('pomo').style.textDecoration = 'underline';
    setTimeOnUI(POMO_TIME, 0);
  } else {
    const isShortBreak = sessionNumber !== NUM_OF_SESSIONS_IN_POMO;
    if (isShortBreak) {
      document.getElementById('timer-box').style.background = '#FEF9C7';
      document.getElementById('short-break').style.textDecoration = 'underline';
      setTimeOnUI(SHORT_BREAK, 0);
    } else {
      document.getElementById('timer-box').style.background = '#FCE181';
      document.getElementById('long-break').style.textDecoration = 'underline';
      setTimeOnUI(LONG_BREAK, 0);
    }
  }
}
