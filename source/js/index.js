import NotificationController from "./controllers/NotificationController.js";
import PomodoroSessionController from "./controllers/PomodoroSessionController.js";
import SettingsController from "./controllers/SettingsController.js";
import TaskListController from "./controllers/TaskListController.js";
import TimerController from "./controllers/TimerController.js";

export const Notifications = new NotificationController();
export const Timer = new TimerController();
export const TaskList = new TaskListController();
export const PomodoroSession = new PomodoroSessionController();
export const Settings = new SettingsController();
