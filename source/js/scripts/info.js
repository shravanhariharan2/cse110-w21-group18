import Controllers from '../index.js';

const Info = Controllers.info();

document.getElementById('info-button').addEventListener('click', Info.openInfo);
document.getElementById('close-info').addEventListener('click', Info.closeInfo);
