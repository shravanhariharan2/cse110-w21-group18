/**
 * Implements a basic timer in javascript
 *
 * this.resolution = # of parts per second
 * this.clock_speed = # of ticks per real-world time (s)
 */
const DEBUG_TIMER = true;
const DOC_TIME = document.getElementById("time");
class Timer {
  // TODO: link clock and document

  // constants


  constructor(clock_speed) {

    this.time = 0;
    this.process = null;
    this.running = false;
    this.resolution = 10;
    this.clock_speed = clock_speed;

    // bind functions to instance
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
    // TODO: update doc
    this.time = (t*60*this.resolution);
    this.updateDocument();
  }

  /**
   * Returns the amount of time remaining in seconds
   * @return {[type]} [description]
   */
  getTime() {
    return this.time / this.resolution;
  }

  updateDocument() {
    let minutes = Math.floor(this.time/this.resolution/60);
    let seconds = Math.floor((this.time/this.resolution)%60);
    DOC_TIME.innerHTML = `${minutes.toString().padStart(2, "0")} :
        ${seconds.toString().padStart(2, "0")}`;
  }

  /**
   * perform a single timer counting operation
   * @return {[type]} [description]
   */
  step() {
    // TODO: update time
    this.time--;
    this.updateDocument();
    this.DEBUG_PRINT(this.time);
  }

  /**
   * run the timer
   */
  async run() {
    this.running = true;
    // copy self reference for scope
    let that = this;

    // construct a new promise to return
    return new Promise((resolve, reject) => {
      // construct the timer interval
      const interval = setInterval(async() => {
        // decrement timer
        that.step();

        // if timer finishes then fulfill
        if(that.time == 0) {
          clearInterval(interval);
          that.running = false;
          resolve();
        }
        // if timer does not finish then reject
        else if(that.running == false && that.time > 0) {
          reject();
          clearInterval(interval);
        }
      }, that.clock_speed);
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
    if(DEBUG_TIMER){console.log(x);}
  }
}

// module.exports = Timer;
