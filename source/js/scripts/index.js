import PomodoroSession from '../services/PomodoroSession.js';

const pomodoroSession = new PomodoroSession();

document.getElementById('start').addEventListener('click', () => {
  Notification.requestPermission();
  pomodoroSession.toggleSession;
});
