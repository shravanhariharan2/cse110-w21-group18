import PomodoroSession from '../services/PomodoroSession.js';

const SESSION = new PomodoroSession();

document.getElementById('start').addEventListener('click', function() {
    Notification.requestPermission();
    SESSION.onClick;
});
