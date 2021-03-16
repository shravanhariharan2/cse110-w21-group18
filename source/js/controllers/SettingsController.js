export default class SettingsController {
  constructor(pomodoroSession) {
    this.pomodoroSession = pomodoroSession;

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
      muteAudioBox: document.getElementById('mute-audio'),
      hideAlertsBox: document.getElementById('hide-alerts'),
      expectedPomo: document.getElementById('pomos'),
    };

    this.DOM_ELEMENTS.settingsModal.style.display = 'none';
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
    this.DOM_ELEMENTS.muteAudioBox.checked = this.muteAudio;
    this.DOM_ELEMENTS.hideAlertsBox.checked = this.hideAlerts;
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
      SettingsController.setDefaultValuesInStorage();
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
    localStorage.setItem('muteAudio', false);
    localStorage.setItem('hideAlerts', false);
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
    this.muteAudio = localStorage.getItem('muteAudio') === 'true';
    this.hideAlerts = localStorage.getItem('hideAlerts') === 'true';
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

    if (this.DOM_ELEMENTS.muteAudioBox.checked) {
      localStorage.setItem('muteAudio', true);
      this.muteAudio = true;
    } else {
      localStorage.setItem('muteAudio', false);
      this.muteAudio = false;
    }

    if (this.DOM_ELEMENTS.hideAlertsBox.checked) {
      localStorage.setItem('hideAlerts', true);
      this.hideAlerts = true;
    } else {
      localStorage.setItem('hideAlerts', false);
      this.hideAlerts = false;
    }

    this.loadStoredInputValues();
    this.pomodoroSession.loadTimerSettings();
    this.updateInputTaskValues();
  }

  /**
   * Change the increment values of time in the expected pomodoros
   * in the input box
   */
  updateInputTaskValues() {
    if (localStorage.getItem('workSessionDuration')) {
      const workSessionTime = parseInt(localStorage.getItem('workSessionDuration'), 10);
      const { options } = this.DOM_ELEMENTS.expectedPomo;
      for (let i = 1; i <= 8; i += 1) {
        const opt = options[i - 1];
        let hrs = Math.trunc((i * workSessionTime) / 60);
        if (hrs !== 0) {
          hrs = `${Math.trunc((i * workSessionTime) / 60)} hr`;
        } else {
          hrs = '';
        }
        let mins = (i * workSessionTime) % 60;
        if (mins > 0) {
          mins = `${(i * workSessionTime) % 60} mins`;
          opt.text = ` ${i}  (${hrs} ${mins})`;
          if (hrs === '') {
            opt.text = ` ${i}  (${mins})`;
          }
        } else {
          opt.text = ` ${i}  (${hrs})`;
        }

        opt.value = `${i}`;
      }
    }
  }
}
