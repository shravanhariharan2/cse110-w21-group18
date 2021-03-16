/**
* This class initializes EventListeners that handles specific key presses.
* Keys Currently Bound:
*  - enter: interact with tasks or addTask button
*  - tab: loop through the list of tasks and the add task button
*  - space: start/end the timer (restricted when editing text fields)
*/
export default class KeyboardController {
  constructor() {
    this.DEBUG = true;
    this.DOM_ELEMENTS = {
      timerButton: document.getElementById('start'),
      taskList: document.getElementById('to-do-list'),
      addTaskButton: document.getElementById('add-task'),
      confirmTaskButton: document.getElementById('save-task'),
      expansionLabel: document.getElementById('view-all'),
      inputBox: document.getElementById('task-add-input'),
      inputTextField: document.getElementById('add-task-name'),
      inputMultiField: document.getElementById('pomos'),
      notesButton: document.getElementById('add-notes'),
      notesTextField: document.getElementById('add-task-description'),
      cancelInput: document.getElementById('cancel-input'),
      acceptInput: document.getElementById('save-task'),
    };

    // All keys in this have their default keyup behaviour prevented
    this.KEYS = {
      spacebar: ' ',
      tab: 'Tab',
      enter: 'Enter',
      equals: 'Equals',
      expand1: '=',
      expand2: '+',
      right_arrow: 'ArrowRight',
      shift: 'Shift',
    };

    this.modStatus = false;

    this.focusIdx = 0;
    this.kbMutex = false;
    this.DOM_ELEMENTS.inputBox.focus();

    // bind functions
    this.onKeyDown = this.onKeyDown.bind(this);
    this.dprint = this.dprint.bind(this);
    this.incrementIdx = this.incrementIdx.bind(this);

    // add key listener
    document.addEventListener('keydown', this.onKeyDown, false);

    // remove keyup actions on input elements
    document.querySelector('input').addEventListener('keyup', function (e) {
      // generate a blacklist from the values of keycodes
      if (e.key !== this.KEYS.shift && Object.values(this.KEYS).includes(e.key)) {
        e.preventDefault();
      }
    });

    // add keyup listener
    document.addEventListener('keyup', (e) => { if (e.key === this.KEYS.shift) this.modUp(); }, false);

    this.DOM_ELEMENTS.inputBox.focus();
  }

  /**
  * Checks key press ID and handles accordingly
  * @param {*} event the event object passed by an EventListener
  */
  onKeyDown(event) {
    const taskInputElements = this.getInputElements();
    const isInputActive = taskInputElements.includes(document.activeElement);
    // mutex prevents certain operations from modifying the page when set to true
    // disable space when typing in text boxes
    let spaceMutex = false;
    if (isInputActive) {
      spaceMutex = true;
    }
    // disable tab when viewing single task during work session
    let tabMutex = false;

    if (this.isTimerInSession()) {
      tabMutex = true;
    }
    // check for space, tab, or enter
    switch (event.key) {
      case this.KEYS.spacebar:
        this.handleSpace(event, spaceMutex);
        break;
      case this.KEYS.tab:
        this.handleTab(event, tabMutex);
        break;
      case this.KEYS.enter:
        this.handleEnter(event, false);
        break;
      case this.KEYS.right_arrow:
        this.handleRightArrow(event, false);
        break;
      case this.KEYS.expand1:
        this.handleExpand(event, false);
        break;
      case this.KEYS.expand2:
        this.handleExpand(event, false);
        break;
      case this.KEYS.shift:
        this.modDown();
        break;
      default:
    }
  }

  /**
  * handles the space keypress, is restricted when editing text fields
  * @param {event} event the event object passed by an EventListener
  * @param {*} mutex a boolean used to restrict/negate function flow
  */
  handleSpace(event, mutex) {
    if (mutex) {
      return;
    }
    this.DOM_ELEMENTS.timerButton.click();
  }

  /**
  * handles the tab keypress
  * @param {event} event the event object passed by an EventListener
  * @param {*} mutex a boolean used to restrict/negate function flow
  */

  handleTab(event, mutex) {
    // prevent default tab function
    event.preventDefault();
    event.stopImmediatePropagation();

    if (mutex) {
      return;
    }

    // increment if not focused on text fields
    const isFocusedOnInput = this.DOM_ELEMENTS.inputBox.style.display
      && this.DOM_ELEMENTS.inputBox.style.display !== 'none';
    if (!isFocusedOnInput) {
      // if shift is not held down then increment, else decrement
      if (this.modStatus) {
        this.decrementIdx();
      } else {
        this.incrementIdx();
      }
    }

    // if the current focus is not a task then it must be the add task button
    if (this.focusIdx === 0) {
      const isInputActive = this.getInputElements().includes(document.activeElement);
      if (!isInputActive) {
        try {
          this.unclickItems();
        } catch (e) {
          this.dprint('No children to unclick');
        }
        this.DOM_ELEMENTS.inputBox.focus();
      } else {
        switch (document.activeElement) {
          case this.DOM_ELEMENTS.inputTextField:
            this.DOM_ELEMENTS.inputMultiField.focus();
            break;
          case this.DOM_ELEMENTS.inputMultiField:
            const isNotesInputDisplayed = this.DOM_ELEMENTS.notesTextField.style.display
              && this.DOM_ELEMENTS.notesTextField.style.display !== 'none';
            if (isNotesInputDisplayed) {
              this.DOM_ELEMENTS.notesTextField.focus();
            } else {
              this.DOM_ELEMENTS.notesButton.focus();
            }
            break;
          case this.DOM_ELEMENTS.notesButton:
            this.DOM_ELEMENTS.cancelInput.focus();
            break;
          case this.DOM_ELEMENTS.notesTextField:
            this.DOM_ELEMENTS.notesButton.focus();
            break;
          case this.DOM_ELEMENTS.cancelInput:
            this.DOM_ELEMENTS.acceptInput.focus();
            break;
          case this.DOM_ELEMENTS.acceptInput:
            this.DOM_ELEMENTS.inputTextField.focus();
            break;
          default:
        }
      }
    } else {
      // collapse add task form if possible
      this.DOM_ELEMENTS.cancelInput.click();

      // focus on the current task and highlight it
      this.DOM_ELEMENTS.taskList.children[this.focusIdx - 1].focus();
      document.activeElement.click();
    }
  }

  /**
  * handles the enter keypress
  * @param {event} event the event object passed by an EventListener
  * @param {*} mutex a boolean used to restrict/negate function flow
  */
  handleEnter(event, mutex) {
    if (mutex) return;

    event.preventDefault();
    // handle enter on <add-task-button>
    if (this.focusIdx === 0) {
      // If the form is not open then open it
      if (this.isTimerInSession()) return;
      const isAddTaskFormHidden = !this.DOM_ELEMENTS.inputBox.style.display
        || this.DOM_ELEMENTS.inputBox.style.display === 'none';
      if (isAddTaskFormHidden) {
        this.DOM_ELEMENTS.addTaskButton.click();
        this.DOM_ELEMENTS.inputTextField.focus();
      } else if (document.activeElement === this.DOM_ELEMENTS.notesButton) {
        // the form is open and we are focused on adding notes, so open the notes text form
        this.DOM_ELEMENTS.notesButton.click();
        this.DOM_ELEMENTS.notesTextField.focus();
      } else if (this.DOM_ELEMENTS.inputTextField.value.length === 0) {
        // form is open and we're not trying to add notes: if nothing is written, then cancel
        this.DOM_ELEMENTS.cancelInput.click();
      } else {
        // add if content exists
        this.DOM_ELEMENTS.acceptInput.click();
      }
    } else {
      // handle enter on <task>
      const shadow = this.DOM_ELEMENTS.taskList.children[this.focusIdx - 1].shadowRoot;
      const childNodes = Array.from(shadow.children);
      // expand button is the 6th child
      childNodes[5].click();
    }
  }

  handleRightArrow(event, mutex) {
    if (mutex) return;
    if (this.focusIdx !== 0 || (this.focusIdx === 0 && this.isTimerInSession())) {
      event.preventDefault();

      let shadow;
      if (this.focusIdx === 0) {
        shadow = this.DOM_ELEMENTS.taskList.children[0].shadowRoot;
      } else {
        shadow = this.DOM_ELEMENTS.taskList.children[this.focusIdx - 1].shadowRoot;
      }

      const childNodes = Array.from(shadow.children);
      this.dprint(`shadowChildren: ${childNodes}`);
      // checkbox is the 3rd child
      childNodes[2].click();
      if (this.DOM_ELEMENTS.taskList.children.length === 0 || this.DOM_ELEMENTS.taskList.children.length === 1) {
        this.focusIdx = this.DOM_ELEMENTS.taskList.children.length;
      }
    }
  }

  handleExpand(event, mutex) {
    if (mutex) return;
    // click the expansion label if shown
    if (this.DOM_ELEMENTS.expansionLabel.style.display && this.DOM_ELEMENTS.expansionLabel.style.display !== 'none') {
      event.preventDefault();
      this.DOM_ELEMENTS.expansionLabel.click();
    }
  }

  modDown() {
    this.modStatus = true;
  }

  modUp() {
    this.modStatus = false;
  }

  /**
   * Unclick the elements (assumes that at least one task is clicked)
   * No click tracking implemented so the unclicking function is bad
   */
  unclickItems() {
    if (this.DOM_ELEMENTS.taskList.children.length > 1) {
      this.DOM_ELEMENTS.taskList.children[
        this.DOM_ELEMENTS.taskList.children.length - 2
      ].click();
      this.DOM_ELEMENTS.taskList.children[
        this.DOM_ELEMENTS.taskList.children.length - 1
      ].click();
    }
    this.DOM_ELEMENTS.taskList.children[
      this.DOM_ELEMENTS.taskList.children.length - 1
    ].click();
  }

  /**
  * updates the index (in case of mouse selection) then increments the index
  * idx = 0 is mapped to adding a task
  * idx > 0 is mapped to tasks in order
  */
  incrementIdx() {
    // TODO: update idx from mouse click (BLOCKAGE!!! No good way to track tasks)
    // increment if there are tasks
    if (this.DOM_ELEMENTS.taskList.children.length > 0) {
      this.focusIdx = ((this.focusIdx + 1)
      % (this.DOM_ELEMENTS.taskList.children.length + 1));
    } else {
      this.focusIdx = 0;
    }
  }

  decrementIdx() {
    // javascript does not implement circular modulo
    if (this.DOM_ELEMENTS.taskList.children.length > 0) {
      this.focusIdx = ((this.focusIdx - 1)
            % (this.DOM_ELEMENTS.taskList.children.length + 1)
            + (this.DOM_ELEMENTS.taskList.children.length + 1))
        % (this.DOM_ELEMENTS.taskList.children.length + 1);
    } else {
      this.focusIdx = 0;
    }
  }

  getInputElements() {
    return [
      this.DOM_ELEMENTS.inputBox,
      this.DOM_ELEMENTS.inputMultiField,
      this.DOM_ELEMENTS.inputTextField,
      this.DOM_ELEMENTS.cancelInput,
      this.DOM_ELEMENTS.acceptInput,
      this.DOM_ELEMENTS.notesButton,
      this.DOM_ELEMENTS.notesTextField,
    ];
  }

  isTimerInSession() {
    return this.DOM_ELEMENTS.expansionLabel.style.display
      && this.DOM_ELEMENTS.expansionLabel.style.display !== 'none'
      && this.DOM_ELEMENTS.expansionLabel.innerHTML === 'View All Tasks';
  }

  /**
  * Prints Iff. debug flag is set true
  * @param {*} x the string to print
  */
  dprint(x) {
    if (this.DEBUG) {
      console.log(x);
    }
  }
}
