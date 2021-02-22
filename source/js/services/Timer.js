/**
 * Implements a basic timer in javascript
 *
 * this.resolution = # of parts per second
 * this.clockSpeed = # of ticks per real-world time (s)
 */
class Timer {
  constructor(clockSpeed) {
    this.debug = true;

    this.time = 0;
    this.process = null;
    this.running = false;
    this.resolution = 10;
    this.clockSpeed = clockSpeed;
    this.DOC_TIME = document.getElementById('time');

    // bind functions to instance
    this.DEBUG_PRINT = this.DEBUG_PRINT.bind(this);
    this.step = this.step.bind(this);
    this.run = this.run.bind(this);
    this.stop = this.stop.bind(this);
    this.updateDocument = this.updateDocument.bind(this);
  }

  /**
   * Set the amount of time left on the timer
   * @param {int} t [the time to set in minutes]
   */
  setTime(t) {
    this.time = (t * 60 * this.resolution);
    this.updateDocument();
  }

  updateDocument() {
    const minutes = Math.floor(this.time / this.resolution / 60);
    const seconds = Math.ceil((this.time / this.resolution) % 60);
    this.DOC_TIME.innerHTML = `${minutes.toString().padStart(2, '0')} :
        ${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * perform a single timer counting operation
   * @return {[type]} [description]
   */
  step() {
    this.time -= 1;
    this.updateDocument();
    this.DEBUG_PRINT(this.time);
  }

  /**
   * run the timer
   */
  async run() {
    this.running = true;
    // copy self reference for scope
    const that = this;

    // construct a new promise to return
    return new Promise((resolve, reject) => {
      // construct the timer interval
      const interval = setInterval(async () => {
        // decrement timer
        that.step();

        // if timer finishes then fulfill
        if (that.time === 0) {
          clearInterval(interval);
          that.running = false;
          resolve();
        } else if (that.running === false && that.time > 0) {
          // timer does not finish so reject
          reject();
          clearInterval(interval);
        }
      }, that.clockSpeed);
    });
  }

  /**
   * stop the timer
   */
  stop() {
    // this will automatically stop the timer in run();
    this.running = false;
    // clearInterval(this.process);
  }

  DEBUG_PRINT(x) {
    if (this.debug) { console.log(x); }
  }
}

export default Timer;
