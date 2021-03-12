import Controllers from '../index.js';

const Settings = Controllers.settings();

document.getElementById('settings-button').addEventListener('click', Settings.openSettings);
document.getElementById('save-button').addEventListener('click', Settings.saveSettings);
document.getElementById('cancel-button').addEventListener('click', Settings.cancelInput);
