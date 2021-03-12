/**
 * Implements a basic timer with start and end capabilities
 */
const CLOCK_SPEED = 1000;

class TimerController {
  constructor() {
    this.minutes = 0;
    this.seconds = 0;
    this.timeInterval = null;
    this.isRunning = false;
    this.clockSpeed = CLOCK_SPEED;
    this.loadHideSecondsBoolean();

    this.DOM_ELEMENTS = {
      time: document.getElementById('time'),
    }

    // bind functions to instance
    this.step = this.step.bind(this);
    this.stop = this.stop.bind(this);
    this.run = this.run.bind(this);
    this.updateDocument = this.updateDocument.bind(this);
  }

  loadHideSecondsBoolean() {
    this.hideSeconds = localStorage.getItem('hideSeconds') === 'true';
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
    let timeString;
    if (this.hideSeconds && this.minutes > 0) {
      timeString = `${paddedMinuteString} m`;
    } else {
      timeString = `${paddedMinuteString} : ${paddedSecondString}`;
    }
    this.DOM_ELEMENTS.time.innerHTML = timeString;
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
    // this.DEBUG_PRINT(`${this.minutes}:${this.seconds}`);
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
}

export default TimerController;
