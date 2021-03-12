import { PomodoroSession } from "../index.js";

document.getElementById('start').addEventListener('click', async () => {
  await Notification.requestPermission();
  await PomodoroSession.toggleSession();
});
