import TaskListController from '../js/controllers/TaskListController.js';
import HTML from './HtmlMocks.js';

beforeEach(() => {
  sessionStorage.clear();
  document.body.innerHTML = HTML;
});

test('Constructor initializes correct instance variables', () => {
  const taskListController = new TaskListController();
  expect(taskListController.numTasks).toBe(0);
  expect(taskListController.completedTasks).toBe(0);
  expect(taskListController.completedIsExpanded).toBe(false);
  expect(taskListController.hasLoadedIntoDOM).toBe(false);
});

test('addTask() adds a new task to session storage and inserts a new <task-item/>', () => {
  const taskListController = new TaskListController();
  jest.spyOn(taskListController.DOM_ELEMENTS.taskList, 'appendChild');

  const taskId = taskListController.numTasks;

  // Mock the form inputs
  taskListController.DOM_ELEMENTS.newTaskName.value = 'Mock Task';
  taskListController.DOM_ELEMENTS.newTaskPomos.value = '4';
  taskListController.DOM_ELEMENTS.newTaskPomos.newTaskNotes = 'Mock Notes';

  const newTask = {
    name: taskListController.DOM_ELEMENTS.newTaskName.value,
    estimate: taskListController.DOM_ELEMENTS.newTaskPomos.value,
    progress: '0',
    distraction: '0',
    notes: taskListController.DOM_ELEMENTS.newTaskNotes.value,
    isComplete: false,
    class: 'dropzone',
    id: taskListController.numTasks.toString(),
    draggable: true,
  };

  const newTaskHTML = document.createElement('task-item');
  newTaskHTML.setAttribute('name', taskListController.DOM_ELEMENTS.newTaskName.value);
  newTaskHTML.setAttribute('estimate', taskListController.DOM_ELEMENTS.newTaskPomos.value);
  newTaskHTML.setAttribute('progress', '0');
  newTaskHTML.setAttribute('distraction', '0');
  newTaskHTML.setAttribute('notes', taskListController.DOM_ELEMENTS.newTaskNotes.value);
  newTaskHTML.setAttribute('isComplete', false);
  newTaskHTML.setAttribute('class', 'dropzone');
  newTaskHTML.setAttribute('id', taskListController.numTasks);

  taskListController.addTask();
  expect(sessionStorage.__STORE__[taskId]).toBe(JSON.stringify(newTask));
  expect(Object.keys(sessionStorage.__STORE__).length).toBe(3);
  expect(taskListController.DOM_ELEMENTS.taskList.appendChild).toBeCalledWith(newTaskHTML);
});
