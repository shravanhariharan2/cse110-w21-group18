import Info from '../services/Info.js';

const info = new Info();

document.getElementById('info-button').addEventListener('click', info.openInfo);
document.getElementById('close-info').addEventListener('click', info.closeInfo);
