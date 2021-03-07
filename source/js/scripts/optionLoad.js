import Options from '../services/Options.js';

const OPTIONS = new Options();

document.getElementById('settings-button').addEventListener('click', OPTIONS.openSettings);

document.addEventListener('DOMContentLoaded', OPTIONS.loadSettings);