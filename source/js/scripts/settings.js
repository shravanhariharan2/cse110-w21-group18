import Settings from '../services/Settings.js';

const settings = new Settings();

document.getElementById('settings-button').addEventListener('click', settings.openSettings);
