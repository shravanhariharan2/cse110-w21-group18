import PomodoroSession from './PomodoroSession.js';

let instance = null;

class Settings {
  constructor() {
    if (instance) return instance;
    instance = this;

    this.pomodoroSession = new PomodoroSession();

    this.loadSettings();

    this.hasLoadedIntoDOM = true;

    // binding methods to objects
    this.saveSettings = this.saveSettings.bind(this);
    this.cancelInput = this.cancelInput.bind(this);
    this.openSettings = this.openSettings.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
    this.loadSettings = this.loadSettings.bind(this);
    this.updateSettings = this.updateSettings.bind(this);

    this.DOM_ELEMENTS = {
      settingsButton: document.getElementById('settings-button'),
      settingsModal: document.getElementById('settings-modal'),
      cancelButton: document.getElementById('cancel-button'),
      saveButton: document.getElementById('save-button'),
      pomDurationDrop: document.getElementById('pomo-duration-select'),
      shortBreakDrop: document.getElementById('short-duration-select'),
      longBreakDrop: document.getElementById('long-duration-select'),
      pomBeforeBreakDrop: document.getElementById('long-pomo-select'),
      pauseBeforeBox: document.getElementById('pause-before-breaks'),
      pauseAfterBox: document.getElementById('pause-after-breaks'),
      hideSecondsBox: document.getElementById('hide-seconds'),
    };

    this.DOM_ELEMENTS.settingsModal.style.display = 'none';

    return instance;
  }

  /**
   * Opens settings box UI
   */
  openSettings() {
    this.DOM_ELEMENTS.settingsModal.style.display = 'block';
    this.DOM_ELEMENTS.pomDurationDrop.value = this.workSessionDuration;
    this.DOM_ELEMENTS.shortBreakDrop.value = this.shortBreakDuration;
    this.DOM_ELEMENTS.longBreakDrop.value = this.longBreakDuration;
    this.DOM_ELEMENTS.pomBeforeBreakDrop.value = this.numSessionsBeforeLongBreak;
    this.DOM_ELEMENTS.pauseBeforeBox.checked = this.pauseBeforeBreak;
    this.DOM_ELEMENTS.pauseAfterBox.checked = this.pauseAfterBreak;
    this.DOM_ELEMENTS.hideSecondsBox.checked = this.hideSeconds;
  }

  /**
   * Closes settings box UI
   */
  closeSettings() {
    this.DOM_ELEMENTS.settingsModal.style.display = 'none';
  }

  /**
   * Cancel the input box
   */
  cancelInput() {
    this.closeSettings();
  }

  /**
   * Saves settings currently in settings boxes
   */
  saveSettings() {
    if (this.hasLoadedIntoDOM) {
      this.updateSettings();
    }
    this.closeSettings();
  }

  /**
   * Loads settings from localStorage
   */
  loadSettings() {
    this.hasLoadedIntoDOM = false;
    if (!localStorage.getItem('workSessionDuration')) {
      Settings.setDefaultValuesInStorage();
    }
    this.loadStoredInputValues();
    this.hasLoadedIntoDOM = true;
  }

  /**
   * Sets default values to local storage variables
   */
  static setDefaultValuesInStorage() {
    localStorage.setItem('workSessionDuration', 25);
    localStorage.setItem('shortBreakDuration', 5);
    localStorage.setItem('longBreakDuration', 30);
    localStorage.setItem('numSessionsBeforeLongBreak', 4);
    localStorage.setItem('pauseBeforeBreak', false);
    localStorage.setItem('pauseAfterBreak', true);
    localStorage.setItem('hideSeconds', false);
  }

  /**
   * Loads browser stored values to instance variables
   */
  loadStoredInputValues() {
    this.workSessionDuration = localStorage.getItem('workSessionDuration');
    this.shortBreakDuration = localStorage.getItem('shortBreakDuration');
    this.longBreakDuration = localStorage.getItem('longBreakDuration');
    this.numSessionsBeforeLongBreak = localStorage.getItem('numSessionsBeforeLongBreak');
    this.pauseBeforeBreak = localStorage.getItem('pauseBeforeBreak') === 'true';
    this.pauseAfterBreak = localStorage.getItem('pauseAfterBreak') === 'true';
    this.hideSeconds = localStorage.getItem('hideSeconds') === 'true';
    this.pomodoroSession.loadTimerSettings();
  }

  /**
   * Updates settings currently in storage
   */
  updateSettings() {
    localStorage.clear();
    localStorage.setItem('workSessionDuration', this.DOM_ELEMENTS.pomDurationDrop.value);
    localStorage.setItem('shortBreakDuration', this.DOM_ELEMENTS.shortBreakDrop.value);
    localStorage.setItem('longBreakDuration', this.DOM_ELEMENTS.longBreakDrop.value);
    localStorage.setItem('numSessionsBeforeLongBreak', this.DOM_ELEMENTS.pomBeforeBreakDrop.value);
    if (this.DOM_ELEMENTS.pauseBeforeBox.checked) {
      localStorage.setItem('pauseBeforeBreak', true);
      this.pauseBeforeBreak = true;
    } else {
      localStorage.setItem('pauseBeforeBreak', false);
      this.pauseBeforeBreak = false;
    }

    if (this.DOM_ELEMENTS.pauseAfterBox.checked) {
      localStorage.setItem('pauseAfterBreak', true);
      this.pauseAfterBreak = true;
    } else {
      localStorage.setItem('pauseAfterBreak', false);
      this.pauseAfterBreak = false;
    }

    if (this.DOM_ELEMENTS.hideSecondsBox.checked) {
      localStorage.setItem('hideSeconds', true);
      this.hideSeconds = true;
    } else {
      localStorage.setItem('hideSeconds', false);
      this.hideSeconds = false;
    }

    this.loadStoredInputValues();
    this.pomodoroSession.loadTimerSettings();
  }
}

export default Settings;
