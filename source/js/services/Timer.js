/**
 * Implements a basic timer in javascript
 *
 */
class Timer {
  constructor(clockSpeed) {
    this.DEBUG = false;

    this.minutes = 0;
    this.seconds = 0;
    this.timeInterval = null;
    this.isRunning = false;
    this.clockSpeed = clockSpeed;

    this.timeDOMElement = document.getElementById('time');

    // bind functions to instance
    this.DEBUG_PRINT = this.DEBUG_PRINT.bind(this);
    this.step = this.step.bind(this);
    this.stop = this.stop.bind(this);
    this.run = this.run.bind(this);
    this.updateDocument = this.updateDocument.bind(this);
  }

  /**
   * Sets the amount of time left on the timer
   * @param {int} t [the time to set in minutes]
   */
  setTime(timeInMinutes) {
    this.minutes = timeInMinutes;
    this.seconds = 0;
    this.updateDocument();
  }

  /**
   * Re-renders the timer time display
   */
  updateDocument() {
    const paddedMinuteString = this.minutes.toString().padStart(2, '0');
    const paddedSecondString = this.seconds.toString().padStart(2, '0');
    const timeString = `${paddedMinuteString} : ${paddedSecondString}`;
    this.timeDOMElement.innerHTML = timeString;
  }

  /**
   * Performs a single timer counting operation
   */
  step(resolve) {
    if (this.seconds <= 0) {
      this.minutes -= 1;
      this.seconds = 60;
      if (this.minutes < 0) {
        this.stop();
        resolve();
      }
    }
    this.seconds -= 1;
    this.updateDocument();
    this.DEBUG_PRINT(`${this.minutes}:${this.seconds}`);
  }

  /**
   * Runs the timer
   */
  async run() {
    this.prepareTimerForStart();

    const self = this;

    return new Promise((resolve) => {
      this.timeInterval = setInterval(() => {
        self.step(resolve);
      }, self.clockSpeed);
    });
  }

  /**
   * Preps the timer to start by setting initial time and re-rendering DOM
   */
  prepareTimerForStart() {
    this.isRunning = true;
    this.minutes -= 1;
    this.seconds = 59;
    this.updateDocument();
  }

  /**
   * Stops the timer completely
   */
  stop() {
    this.isRunning = false;
    clearInterval(this.timeInterval);
  }

  /**
   * Prints debug statements to console based on global debug flag
   * @param {string} x [The statement to print]
   */
  DEBUG_PRINT(x) {
    if (this.DEBUG) { console.log(x); }
  }
}

export default Timer;
