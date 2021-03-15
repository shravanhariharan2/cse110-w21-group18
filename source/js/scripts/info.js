import Controllers from '../index.js';

const info = Controllers.info();

document.getElementById('info-button').addEventListener('click', info.openInfo);
document.getElementById('close-info').addEventListener('click', info.closeInfo);
