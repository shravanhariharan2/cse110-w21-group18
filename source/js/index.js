import NotificationController from './controllers/NotificationController.js';
import PomodoroSessionController from './controllers/PomodoroSessionController.js';
import SettingsController from './controllers/SettingsController.js';
import TaskListController from './controllers/TaskListController.js';
import TimerController from './controllers/TimerController.js';
import InfoController from './controllers/InfoController.js';
import KeyboardController from './controllers/KeyboardController.js';
import Constants from './constants/Constants.js';

const Controllers = (() => {
  let notificationController;
  let pomodoroSessionController;
  let settingsController;
  let taskListController;
  let timerController;
  let infoController;
  let keyboardController;

  return {
    timer() {
      if (!timerController) timerController = new TimerController(Constants.TIMER_CLOCK_SPEED);
      return timerController;
    },
    notification() {
      if (!notificationController) notificationController = new NotificationController();
      return notificationController;
    },
    pomodoroSession() {
      if (!pomodoroSessionController) {
        pomodoroSessionController = new PomodoroSessionController(this.timer(), this.taskList(), this.notification());
      }
      return pomodoroSessionController;
    },
    settings() {
      if (!settingsController) settingsController = new SettingsController(this.pomodoroSession());
      return settingsController;
    },
    taskList() {
      if (!taskListController) taskListController = new TaskListController();
      return taskListController;
    },
    info() {
      if (!infoController) infoController = new InfoController();
      return infoController;
    },
    keyboard() {
      if (!keyboardController) keyboardController = new KeyboardController();
      return keyboardController;
    },
  };
})();

export default Controllers;
