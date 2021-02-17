const DEBUG_POM_SESSION = true;
const TICK_SPEED = 1000;

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
    this.onEnd = this.onEnd.bind(this);

    console.log("init finished")
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
    this.CONFIG_WORK_TIME = .083333;
    this.CONFIG_REST_TIME = .083333;
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
   * change the state and button label depending on current state
   */
  onClick() {
    switch(this.state) {
      // start the timer and instantiate an ending transition
      case 0:
        this.state = 1;
        this.watchdog = setTimeout(this.onEnd,
            this.CONFIG_WORK_TIME*60*TICK_SPEED + 50);
        this.timeit.run();
        break;

      // User stops the work session early. Reset to idle state and don't
      // increment session number
      case 1:
        this.state = 0;
        this.timeit.stop();
        clearTimeout(this.watchdog);
        this.timeit.setTime(this.CONFIG_WORK_TIME);
        break;

      // User stops resting timer early, immediatly move to idle state
      case 2:
        this.state = 0;
        this.timeit.stop();
        clearTimeout(this.watchdog);
        this.timeit.setTime(this.CONFIG_WORK_TIME);
        break;
    }
    this.Dprint(`onClick to -> ${this.info()}`);
  }

  /**
   * This function is called on successful completion of a session. Change
   * state and timer parameters based on current state.
   * @return {[type]} [description]
   */
  onEnd() {
    switch(this.state) {
      // user sucessfully completes work session. Transition to rest state and
      // set timer to CONFIG_REST_TIME. Automatically start the timer
      case 1:
        this.state = 2;
        this.sesssion++;
        this.timeit.stop();
        this.timeit.setTime(this.CONFIG_REST_TIME);
        // watchdog automatically re-calls this function after session
        // completes
        this.watchdog = setTimeout(this.onEnd,
            this.CONFIG_REST_TIME*60*TICK_SPEED + 50);
        this.timeit.run();
        break;

      // user sucessfully completes rest session. Transition to idle state and
      // set timer to CONFIG_WORK_TIME. User chooses when to start next cycle.
      default:
        this.state = 0;
        this.timeit.stop();
        this.timeit.setTime(this.CONFIG_WORK_TIME);
    }
    this.Dprint(`On End to -> ${this.info()}`);
  }


  /**
   * Print debug statements to console based on global debug flag
   * @param {[string]} x [The statement to print]
   */
  Dprint(x) {
    if(DEBUG_POM_SESSION){ console.log(x); }
  }

}

module.exports = PomodoroSession;
