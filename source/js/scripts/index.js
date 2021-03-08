import PomodoroSession from '../services/PomodoroSession.js';

const pomodoroSession = new PomodoroSession();

document.getElementById('start').addEventListener('click', async () => {
  await Notification.requestPermission();
  await pomodoroSession.toggleSession();
});
