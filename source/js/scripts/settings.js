import { Settings } from "../index.js";

document.getElementById('settings-button').addEventListener('click', Settings.openSettings);
document.getElementById('save-button').addEventListener('click', Settings.saveSettings);
document.getElementById('cancel-button').addEventListener('click', Settings.cancelInput);
