import PomodoroSession from '../services/PomodoroSession.js';

const SESSION = new PomodoroSession();

window.addEventListener('load', Notification.requestPermission());

document.getElementById('start').addEventListener('click', SESSION.onClick);
