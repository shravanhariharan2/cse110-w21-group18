/**
 * Implements a basic timer with start and end capabilities
 */
class TimerController {
  constructor(clockSpeed) {
    this.minutes = 0;
    this.seconds = 0;
    this.timeInterval = null;
    this.isRunning = false;
    this.clockSpeed = clockSpeed;
    this.loadHideSecondsBoolean();

    this.DOM_ELEMENTS = {
      time: document.getElementById('time'),
      title: document.getElementById('title'),
    };

    // bind functions to instance
    this.step = this.step.bind(this);
    this.stop = this.stop.bind(this);
    this.run = this.run.bind(this);
    this.updateTimeUI = this.updateTimeUI.bind(this);
  }

  /**
   * Loads the hideSeconds boolean from storage into instance
   */
  loadHideSecondsBoolean() {
    this.hideSeconds = localStorage.getItem('hideSeconds') === 'true';
  }

  /**
   * Sets the amount of time left on the timer
   * @param {number} t [the time to set in minutes]
   */
  setTime(timeInMinutes) {
    this.minutes = timeInMinutes;
    this.seconds = 0;
    this.updateTimeUI();
  }

  /**
   * Updates the timer time in all locations where the time is displayed
   */
  updateTimeUI() {
    this.updateTimerTime();
    this.updateTitleTime();
  }

  /**
   * Re-renders the timer time display
   */
  updateTimerTime() {
    this.DOM_ELEMENTS.time.innerHTML = this.getTimerTimeString();
  }

  /**
   * Re-renders the title time display
   */
  updateTitleTime() {
    this.DOM_ELEMENTS.title.innerHTML = this.getTitleTimeString();
  }

  /**
   * Gets a padded string representing the current time and the settings the user has specified
   * @returns {string} the padded time
   */
  getTimerTimeString() {
    const paddedMinuteString = this.minutes.toString().padStart(2, '0');
    const paddedSecondString = this.seconds.toString().padStart(2, '0');
    let timeString;
    if (this.hideSeconds && this.minutes > 0) {
      timeString = `${paddedMinuteString} m`;
    } else {
      timeString = `${paddedMinuteString} : ${paddedSecondString}`;
    }
    return timeString;
  }

  /**
   * Gets a padded string representing the current time to be displayed on the title
   * based on the settings the user has specified
   * @returns {string} the padded time
   */
  getTitleTimeString() {
    const paddedMinuteString = this.minutes.toString().padStart(2, '0');
    const paddedSecondString = this.seconds.toString().padStart(2, '0');
    let timeString;
    const isShorthandTime = this.hideSeconds && this.minutes > 0;
    if (isShorthandTime) {
      timeString = `${paddedMinuteString}m`;
    } else {
      timeString = `${paddedMinuteString}:${paddedSecondString}`;
    }
    const currentTitleArr = this.DOM_ELEMENTS.title.innerHTML.split(' ');
    const titleWords = currentTitleArr.slice(currentTitleArr.length - 2);
    const titleTimeString = `${timeString} - ${titleWords[0]} ${titleWords[1]}`;
    return titleTimeString;
  }

  /**
   * Performs a single timer counting operation
   * @param {Promise} resolve the promise to be resolved when the timer finishes
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
    this.updateTimeUI();
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
    this.updateTimeUI();
  }

  /**
   * Stops the timer completely
   */
  stop() {
    this.isRunning = false;
    clearInterval(this.timeInterval);
    this.updateTimeUI();
  }
}

export default TimerController;
