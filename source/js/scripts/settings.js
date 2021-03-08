import Settings from '../services/Settings.js';

const settings = new Settings();

document.getElementById('settings-button').addEventListener('click', settings.openSettings);
document.getElementById('save-button').addEventListener('click', settings.saveSettings);
document.getElementById('cancel-button').addEventListener('click', settings.cancelInput);
