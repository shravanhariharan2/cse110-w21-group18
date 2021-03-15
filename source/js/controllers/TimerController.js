import Constants from '../constants/Constants.js';

/**
 * Implements a basic timer with start and end capabilities
 */
export default class TimerController {
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
    this.updateTimeUI();
  }

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

  updateTitleTime() {
    this.DOM_ELEMENTS.title.innerHTML = this.getTitleTimeString();
  }

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

  getTitleTimeString() {
    const paddedMinuteString = this.minutes.toString().padStart(2, '0');
    const paddedSecondString = this.seconds.toString().padStart(2, '0');
    let timeString;
    if (this.hideSeconds && this.minutes > 0) {
      timeString = `${paddedMinuteString}m`;
    } else {
      timeString = `${paddedMinuteString}:${paddedSecondString}`;
    }
    const currentTitleString = this.DOM_ELEMENTS.title.innerHTML;
    const titleTimeString = `${timeString} - ${currentTitleString.slice(Constants.TIME_PAD_SIZE)}`;
    return titleTimeString;
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
