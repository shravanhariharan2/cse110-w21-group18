/**
 * Implements a basic timer in javascript
 *
 * this.resolution = # of parts per second
 * this.clock_speed = # of ticks per real-world time (s)
 */
class Timer {
  // TODO: pass in resolution
  constructor(clock_speed) {
    //

    this.time = 0;
    this.process = null;
    this.running = false;
    this.resolution = 10;
    this.clock_speed = clock_speed;

    // bind functions to instance
    this.step = this.step.bind(this);
    this.run = this.run.bind(this);
    this.stop = this.stop.bind(this);



  }

  /**
   * Set the amount of time left on the timer
   * @param {int} t [the time to set in minutes]
   */
  setTime(t) {
    this.time = (t*60*this.resolution);
  }

  /**
   * Returns the amount of time remaining in seconds
   * @return {[type]} [description]
   */
  getTime() {
    return this.time / this.resolution;
  }

  /**
   * perform a single timer counting operation
   * @return {[type]} [description]
   */
  step() {
    this.time--;
  }

  /**
   * run the timer
   */
  run() {
    this.running = true;
    this.process = setInterval(this.step, this.clock_speed / this.resolution);
    // set an autostop for the end
    // setTimeout(this.stop, this.time*this.resolution*this.clock_speed + 10);
  }

  /**
   * stop the timer
   */
  stop() {
    this.running = false;
    clearInterval(this.process);
  }
}

module.exports = Timer;
