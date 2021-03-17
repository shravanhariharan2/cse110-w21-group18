import Controllers from '../index.js';

document.getElementById('start').addEventListener('click', async () => {
  await Notification.requestPermission();
  await Controllers.pomodoroSession().toggleSession();
});
