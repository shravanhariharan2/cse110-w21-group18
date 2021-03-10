import TaskList from '../js/services/TaskList.js';
import HtmlMocks from './HtmlMocks.js';

beforeEach(() => {
  sessionStorage.clear();
  document.body.innerHTML = HtmlMocks.TASK_LIST;
});

test('Constructor initializes correct instance variables', () => {
  const ListTest = new TaskList();
  expect(ListTest.numTasks).toBe(0);
  expect(ListTest.completedTasks).toBe(0);
  expect(ListTest.completedIsExpanded).toBe(false);
  expect(ListTest.hasLoadedIntoDOM).toBe(false);
});

test('addTask() adds a new task to session storage and inserts a new <task-item/>', () => {
  const ListTest = new TaskList();
  jest.spyOn(ListTest.DOM_ELEMENTS.taskList, 'appendChild');
  const taskId = ListTest.numTasks;
  const expectedNumTasks = ListTest.numTasks + 1;

  // Mock the form inputs
  ListTest.DOM_ELEMENTS.newTaskName.value = 'Mock Task';
  ListTest.DOM_ELEMENTS.newTaskPomos.value = '4';
  ListTest.DOM_ELEMENTS.newTaskPomos.newTaskNotes = 'Mock Notes';

  const newTask = {
    name: ListTest.DOM_ELEMENTS.newTaskName.value,
    estimate: ListTest.DOM_ELEMENTS.newTaskPomos.value,
    progress: 0,
    notes: ListTest.DOM_ELEMENTS.newTaskNotes.value,
    isComplete: false,
    className: 'dropzone',
    id: ListTest.numTasks,
    isDraggable: true,
  };

  const newTaskHTML = document.createElement('task-item');
  newTaskHTML.setAttribute('name', ListTest.DOM_ELEMENTS.newTaskName.value);
  newTaskHTML.setAttribute('estimate', ListTest.DOM_ELEMENTS.newTaskPomos.value);
  newTaskHTML.setAttribute('progress', '0');
  newTaskHTML.setAttribute('notes', ListTest.DOM_ELEMENTS.newTaskNotes.value);
  newTaskHTML.setAttribute('isComplete', false);
  newTaskHTML.setAttribute('class', 'dropzone');
  newTaskHTML.setAttribute('id', ListTest.numTasks);

  ListTest.addTask();
  expect(sessionStorage.__STORE__[taskId]).toBe(JSON.stringify(newTask));
  expect(Object.keys(sessionStorage.__STORE__).length).toBe(expectedNumTasks);
  expect(ListTest.DOM_ELEMENTS.taskList.appendChild).toBeCalledWith(newTaskHTML);
});

// test('incrementPomodoroCount() increments the progress of the top task', () => {
//   const ListTest = new TaskList();
//   ListTest.hasLoadedIntoDOM = true;
//   ListTest.addTask();
//   ListTest.addTask();
//   const topTaskId = 1;
//   ListTest.incrementPomodoroCount();
//   expect(JSON.parse(sessionStorage.__STORE__[topTaskId]).progress).toBe('1');
// });
