const DEBUG_POM_SESSION = true;
const TICK_SPEED = 100;
const DOC_TIMER_BUTTON = document.getElementById("start");

/**
 * Implements the PomodoroSession class. This class is a controller for the
 */
class PomodoroSession {
  constructor() {
    // initialize constants
    // const timerButton = document.getElementById('start');

    // initialize parameters
    this.CONFIG_WORK_TIME;
    this.CONFIG_REST_TIME;
    this.CONFIG_BREAK_TIME;
    this.CONFIG_SESSION_COUNT;
    this.CONFIG_DISPLAY_DIGITS;

    // initialize core objects
    this.timeit = new Timer(TICK_SPEED);
    this.state = 0;
    this.session = 0;

    // initialize placeholders
    this.watchdog = null;

    // load configs
    this.placeholder_load_config();
    this.timeit.setTime(this.CONFIG_WORK_TIME);


    // bind functions to object
    this.onClick = this.onClick.bind(this);
    this.run = this.run.bind(this);
    this.stop = this.stop.bind(this);

    DOC_TIMER_BUTTON.addEventListener('click', this.onClick);

    this.DEBUG_PRINT("init finished");
  }

  // TODO: constructor(config)

  /**
   * Loads a session config
   * @param  {[string]} path the path to the config
   */
  // TODO: this
  load_config(path) {

  }

  /**
   * Loads a placeholder config
   */
  placeholder_load_config() {
    this.CONFIG_WORK_TIME = .1;
    this.CONFIG_REST_TIME = .1;
    this.CONFIG_BREAK_TIME = 30;
    this.CONFIG_SESSION_COUNT = 4;
    this.CONFIG_DISPLAY_DIGITS = 2;
  }

  /**
   * Get debugging indicators
   * @return {[array]} an array of parameters
   */
  info() {
    let state_array = [
      this.state,
      this.session,
      this.timeit.getTime(),
      this.timeit.running
    ];

    return state_array;
  }

  /**
   * Run the timer for t-minutes, throws an error timer is stopped midway
   * @param  {[type]}  t [the number of minutes to run the timer]
   * @return {Promise}   [non-deterministic state, indicating timer completion]
   */
  async run(t) {
    this.timeit.setTime(t);
    await this.timeit.run();
  }

  /**
   * stops the timer
   */
  stop() { // i dunno if we need this? maybe for consistency?
    this.timeit.stop();
  }

  /**
   * this function links the document and the
   * @return {Promise} [description]
   */
  async onClick() {
    switch (this.state) {
      case 0:
        // start and try to finish work-rest sequence;
        try {
          DOC_TIMER_BUTTON.setAttribute('value', 'Stop');
          this.state = 1;
          await this.run(this.CONFIG_WORK_TIME);
          this.DEBUG_PRINT("Work finished");
          this.state = 2;
          await this.run(this.CONFIG_REST_TIME);
          this.DEBUG_PRINT("Rest finished");

          // reset to idle state after sequence
          this.state = 0;
          DOC_TIMER_BUTTON.setAttribute('value', 'Start');
        }
        // if timer is stopped midway, transition to idle state
        catch(e) {
          this.state = 0;
          this.stop();
          DOC_TIMER_BUTTON.setAttribute('value', 'Start');
          this.DEBUG_PRINT("timer stopped midway")
          this.DEBUG_PRINT(e);
        }
        break;

      // move to idle state whenever timer is running
      default:
        this.state = 0;
        this.stop();
    }
  }




  /**
   * Print debug statements to console based on global debug flag
   * @param {[string]} x [The statement to print]
   */
  DEBUG_PRINT(x) {
    if(DEBUG_POM_SESSION){ console.log(x); }
  }

}

// module.exports = PomodoroSession;
