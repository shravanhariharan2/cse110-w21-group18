class Options {
  constructor() {
    this.pomodoroDuration = '25';
    this.shortBreakDuration = '5';
    this.longBreakDuration = '30';
    this.pomodorosBeforeBreak = '4';
    this.pauseBeforeBreak = 'false';
    this.pauseAfterBreak = 'false';
    this.hasLoadedIntoDOM = true;

    // binding methods to objects
    this.saveSettings = this.saveSettings.bind(this);
    this.cancelInput = this.cancelInput.bind(this);
    this.openSettings = this.openSettings.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
    this.loadSettings = this.loadSettings.bind(this);
    this.updateSettings = this.updateSettings.bind(this);

    this.DOM_ELEMENTS = {
      settingsButton: document.getElementById("settings-button"),
      settingsModal: document.getElementById("settings-modal"),
      cancelButton: document.getElementById("cancel-button"),
      saveButton: document.getElementById("save-button"),
      pomDurationDrop: document.getElementById("pomo-duration-select"),
      shortBreakDrop: document.getElementById("short-duration-select"),
      longBreakDrop: document.getElementById("long-duration-select"),
      pomBeforeBreakDrop: document.getElementById("long-pomo-select"),
      pauseBeforeBox: document.getElementById("pause-before-breaks"),
      pauseAfterBox: document.getElementById("pause-after-breaks"),
    };

    this.DOM_ELEMENTS.saveButton.addEventListener('click', this.saveSettings);
    this.DOM_ELEMENTS.cancelButton.addEventListener('click', this.cancelInput);
    this.DOM_ELEMENTS.settingsButton.addEventListener('click', this.openSettings);
    this.DOM_ELEMENTS.settingsModal.style.display = 'none';
  }

  /**
   * Opens settings box
   */
  openSettings() {
    this.DOM_ELEMENTS.settingsModal.style.display = 'block';
    this.DOM_ELEMENTS.pomDurationDrop.value = this.pomodoroDuration;
    this.DOM_ELEMENTS.shortBreakDrop.value = this.shortBreakDuration;
    this.DOM_ELEMENTS.longBreakDrop.value = this.longBreakDuration;
    this.DOM_ELEMENTS.pomBeforeBreakDrop.value = this.pomodorosBeforeBreak;
    if(this.pauseAfterBreak == 'true') {
      this.DOM_ELEMENTS.pauseAfterBox.checked = true;
    } else {
      this.DOM_ELEMENTS.pauseAfterBox.checked = false;
    }

    if(this.pauseBeforeBreak == 'true') {
      this.DOM_ELEMENTS.pauseBeforeBox.checked = true;
    } else {
      this.DOM_ELEMENTS.pauseBeforeBox.checked = false;
    }

  }

  /**
   * Closes settings box
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
    if(localStorage.getItem('pomodoroDuration') == null) {
      this.pomodoroDuration = '25';
      this.shortBreakDuration = '5';
      this.longBreakDuration = '30';
      this.pomodorosBeforeBreak = '4';
      this.pauseBeforeBreak = false;
      this.pauseAfterBreak = false;
    } else {
      this.pomodoroDuration = localStorage.getItem('pomodoroDuration');
      this.shortBreakDuration = localStorage.getItem('shortBreakDuration');
      this.longBreakDuration = localStorage.getItem('longBreakDuration');
      this.pomodorosBeforeBreak = localStorage.getItem('pomodorosBeforeBreak');
      this.pauseBeforeBreak = localStorage.getItem('pauseBeforeBreak');
      this.pauseAfterBreak = localStorage.getItem('pauseAfterBreak');
    }
    this.hasLoadedIntoDOM = true;
  }

  /**
   * Updates settings currently in localStorage
   */
  updateSettings() {
    localStorage.clear();
    localStorage.setItem('pomodoroDuration', this.DOM_ELEMENTS.pomDurationDrop.value);
    localStorage.setItem('shortBreakDuration', this.DOM_ELEMENTS.shortBreakDrop.value);
    localStorage.setItem('longBreakDuration', this.DOM_ELEMENTS.longBreakDrop.value);
    localStorage.setItem('pomodorosBeforeBreak', this.DOM_ELEMENTS.pomBeforeBreakDrop.value);
    if(this.DOM_ELEMENTS.pauseBeforeBox.checked == true) {
      localStorage.setItem('pauseBeforeBreak', 'true');
      this.pauseBeforeBreak = 'true';
    } else {
      localStorage.setItem('pauseBeforeBreak', 'false');
      this.pauseBeforeBreak = 'false';
    }

    if(this.DOM_ELEMENTS.pauseAfterBox.checked == true) {
      localStorage.setItem('pauseAfterBreak', 'true');
      this.pauseAfterBreak = 'true';
    } else {
      localStorage.setItem('pauseAfterBreak', 'false');
      this.pauseAfterBreak = 'false';
    }
    this.pomodoroDuration = localStorage.getItem('pomodoroDuration');
    this.shortBreakDuration = localStorage.getItem('shortBreakDuration');
    this.longBreakDuration = localStorage.getItem('longBreakDuration');
    this.pomodorosBeforeBreak = localStorage.getItem('pomodorosBeforeBreak');
  }

}

export default Options;