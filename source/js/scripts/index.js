import PomodoroSession from '../services/PomodoroSession.js';

const pomodoroSession = new PomodoroSession();

document.getElementById('start').addEventListener('click', function() {
    Notification.requestPermission();
    pomodoroSession.toggleSession;
});
