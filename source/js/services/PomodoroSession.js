const TICK_SPEED = 100;

/**
 * Implements the PomodoroSession class. This class is a controller for the
 */
class PomodoroSession {
  constructor() {
    // initialize constants
    this.DEBUG = true;
    // const timerButton = document.getElementById('start');

    // initialize document parameters
    this.DOC_ELEMENTS = {
      short_break: document.getElementById('short-break'),
      long_break: document.getElementById('long-break'),
      pomo: document.getElementById('pomo'),
      button: document.getElementById('start'),
    };

    // initialize core objects
    this.timeit = new Timer(TICK_SPEED);
    this.state = 0;
    this.session = 0;

    // initialize placeholders
    this.watchdog = null;

    // load configs
    this.loadConfig('dummy_path');
    this.timeit.setTime(this.CONFIG_WORK_TIME);

    // bind functions to object
    this.DEBUG_PRINT = this.DEBUG_PRINT.bind(this);
    this.onClick = this.onClick.bind(this);
    this.run = this.run.bind(this);
    this.stop = this.stop.bind(this);
    this.updateDocument = this.updateDocument.bind(this);

    this.DOC_ELEMENTS.button.addEventListener('click', this.onClick);

    this.DEBUG_PRINT('init finished');
  }

  /**
   * Loads a session config
   * @param  {[string]} path the path to the config
   */
  loadConfig(path) {
    this.CONFIG_WORK_TIME = 0.1;
    this.CONFIG_REST_TIME = 0.1;
    this.CONFIG_BREAK_TIME = 30;
    this.CONFIG_SESSION_COUNT = 4;
    this.CONFIG_DISPLAY_DIGITS = 2;
  }

  /**
   * Get debugging indicators
   * @return {[array]} an array of parameters
   */
  info() {
    const stateArray = [
      this.state,
      this.session,
      this.timeit.getTime(),
      this.timeit.running,
    ];

    return stateArray;
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

  updateDocument() {
    switch (this.state) {
      case 2:
        this.DOC_ELEMENTS.pomo.style.textDecoration = 'none';
        this.DOC_ELEMENTS.short_break.style.textDecoration = 'underline';
        this.DOC_ELEMENTS.long_break.style.textDecoration = 'none';
        break;
      case 3:
        this.DOC_ELEMENTS.pomo.style.textDecoration = 'none';
        this.DOC_ELEMENTS.short_break.style.textDecoration = 'none';
        this.DOC_ELEMENTS.long_break.style.textDecoration = 'underline';
        break;
      default:
        this.DOC_ELEMENTS.pomo.style.textDecoration = 'underline';
        this.DOC_ELEMENTS.short_break.style.textDecoration = 'none';
        this.DOC_ELEMENTS.long_break.style.textDecoration = 'none';
    }
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
          // run pomo sequence
          this.state = 1;
          this.DOC_ELEMENTS.button.setAttribute('value', 'Stop');
          this.updateDocument();
          await this.run(this.CONFIG_WORK_TIME);
          this.DEBUG_PRINT('Work finished');

          // run rest sequence
          this.state = 2;
          this.updateDocument();
          await this.run(this.CONFIG_REST_TIME);
          this.DEBUG_PRINT('Rest finished');

          // reset to idle state after sequence
          // TODO: session state change
          this.state = 0;
          this.DOC_ELEMENTS.button.setAttribute('value', 'Start');
          this.updateDocument();
        } catch (e) {
          this.state = 0;
          this.stop();
          this.DOC_ELEMENTS.button.setAttribute('value', 'Start');
          this.DEBUG_PRINT('timer stopped midway');
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
    if (this.DEBUG) {
      console.log(x);
    }
  }
}

// module.exports = PomodoroSession;
