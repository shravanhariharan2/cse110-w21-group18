import TaskList from '../js/services/TaskList';

beforeEach(() => {
  sessionStorage.clear();

  // Set up the HTML
  document.body.innerHTML = `
    <header id="to-do-list-header">
      <p id="list-title">Task List</p>
    </header>
    <hr id = "task-line-break">
    <input type="button" id="add-task" value="Add Task" title="Add Tasks"></input>
    <form id="task-add-input">
      <input type="text" id="add-task-name" placeholder="Task Name">
      <p id="expected">Expected Pomodoros:</p>
      <select name="pomos" id="pomos">
        <option value="0">...</option>
        <option value="1">1 (25 min)</option>
        <option value="2">2 (50 min)</option>
        <option value="3">3 (1hr 15min)</option>
        <option value="4">4 (1hr 40min)</option>
        <option value="5">5 (2hr 05min)</option>
        <option value="6">6 (2hr 30min)</option>
        <option value="7">7 (2hr 55min)</option>
        <option value="8">8 (3hr 20min)</option>
      </select>
      <input type="button" id="cancel-input" value="Cancel" title="Cancel Input"></input>
      <input type="button" id="add-notes" value="Add Notes">
      <textarea id="add-task-description" placeholder="Add Notes"></textarea>
      <input type="button" id="save-task" value="Save">
    </form>
    <div id="to-do-list"></div>
    <header id="completed-list-header">
      <p id="completed-list-title">Completed Tasks</p>
      <input id="expand-completed" type="image" title="Expand View" src="./media/expand-icon.png">
    </header>
    <div id="completed-list"></div>
    `;
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

test('incrementPomodoroCount() increments the progress of the top task', () => {
  const ListTest = new TaskList();
  ListTest.hasLoadedIntoDOM = true;
  ListTest.addTask();
  ListTest.addTask();
  const topTaskId = 1;
  ListTest.incrementPomodoroCount();
  expect(JSON.parse(sessionStorage.__STORE__[topTaskId]).progress).toBe('1');
});
