/**
* this class initializes an EventListener that handles specific key presses.
* Keys Currently Bound:
*  - enter: interact with tasks or addTask button
*  - tab: loop through the list of tasks and the add task button
*  - space: start/end the timer (restricted when editing text fields)
*/
class keyboardInteractions {
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
      spacebar: 'Spacebar', 
      tab: 'Tab',
      enter: 'Enter',
      equals: 'Equals',
      minus: 'Subtract',
      right_arrow: 'ArrowRight',
    };

    this.MODKEY = 16;
    this.modStatus = false;

    this.focusIdx = 0;
    this.kbMutex = false;
    this.DOM_ELEMENTS.inputBox.focus();
    // if(this.DOM_ELEMENTS.taskList.children.length !== 0) {
    //     // focus on fist task 
    //     this.DOM_ELEMENTS.taskList.children[0].focus();
    // }

    // bind functions
    this.onKeyDown = this.onKeyDown.bind(this);
    this.dprint = this.dprint.bind(this);
    this.incrementIdx = this.incrementIdx.bind(this);

    // add key listener
    document.addEventListener('keydown', this.onKeyDown, false);

    // remove keyup actions on input elements
    document.querySelector('input').addEventListener('keyup', function (e) {
        // generate a blacklist from the values of keycodes
        if(e.which !== this.MODKEY && Object.values(this.KEYS).includes(e.which)) {
            e.preventDefault();
        }
    });

    // add keyup listener
    document.addEventListener('keyup', (e) => {if(e.keyCode === this.MODKEY) this.modUp();}, false);
  }

  /**
  * Checks key press ID and handles accordingly
  * @param {*} event the event object passed by an EventListener
  */
  onKeyDown(event) {
    const taskInputElements = this.getInputElements();
    const isInputActive = taskInputElements.includes(document.activeElement);
    const isViewAllActive = this.DOM_ELEMENTS.expansionLabel.style.display
      && this.DOM_ELEMENTS.expansionLabel.style.display !== 'none';
    // mutex prevents certain operations from modifying the page when set to true
    // disable space when typing in text boxes
    let spaceMutex = false;
    if (isInputActive) {
      spaceMutex = true;
      this.dprint('space mutex on')
    }
    // disable tab when working on tasks
    let tabMutex = false;
     
    if(isViewAllActive) {
      tabMutex = true;
      this.dprint('tab mutex on');
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
      case this.KEYS.minus:
        this.handleMinus(event, false);
        break;
      case this.MODKEY:
        this.modDown();
        break;
      default:
        if (this.kbMutex) return;
        this.dprint(`key: ${event.keyCode} is not implemented`);
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
    this.dprint('Enter pressed');
  }

  /**
  * handles the tab keypress
  * @param {event} event the event object passed by an EventListener
  * @param {*} mutex a boolean used to restrict/negate function flow
  */

  handleTab(event, mutex) {
    if (mutex) {
      return;
    }
    // prevent default tab function
    event.preventDefault();
    event.stopImmediatePropagation();
    

    // increment if not focused on text fields
    if(this.DOM_ELEMENTS.inputBox.style.display === 'none') {
      this.dprint("input box is none");
      // if shift is not held down then increment, else decrement 
      if(this.modStatus) {
          this.decrementIdx();
      } else {
          this.incrementIdx();
      }
    }

    // if the current focus is not a task then it must be the add task button
    if (this.focusIdx === 0) {
      // unclick the last task (so it's not highlighted)
      try {
        this.unclickItems();
      } catch (e) {
        this.dprint('No children to unclick');
      }
      // cycle between inputs while form is active 
      const isInputActive = this.getInputElements().includes(document.activeElement);
      if(isInputActive) {
        switch (document.activeElement) {
          case this.DOM_ELEMENTS.inputTextField:
            this.DOM_ELEMENTS.inputMultiField.focus();
            break;
          case this.DOM_ELEMENTS.inputMultiField:
            const isNotesInputDisplayed = this.DOM_ELEMENTS.notesTextField.style.display
              && this.DOM_ELEMENTS.notesTextField.style.display !== 'none' 
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
      } else {
          this.DOM_ELEMENTS.inputBox.focus();
      }
    } else {
      // collapse add task form if possible
      this.DOM_ELEMENTS.cancelInput.click();

      // focus on the current task and highlight it
      console.log(this.modStatus);
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
    this.dprint(`focused idx: ${this.focusIdx}\n`
      + `event key: ${event.keyCode}`);
    if (mutex) return;

    event.preventDefault();
    // handle enter on <add-task-button>
    if (this.focusIdx === 0) {
      this.dprint(`form display value: ${this.DOM_ELEMENTS.inputBox.style.display}`);
      // If the form is not open then open it
      if (this.DOM_ELEMENTS.inputBox.style.display === 'none'
      || this.DOM_ELEMENTS.inputBox.style.display === undefined) {
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
      const childNodes = Array.from(shadow.childNodes);
      this.dprint(`shadowChildren: ${childNodes}`);
      // expand button is the 5th child
      childNodes[4].click();
    }
  }

  handleRightArrow(event, mutex) {
      if(mutex) {
          return;
      }      
      if(this.focusIdx !== 0) {
          event.preventDefault();
          const shadow = this.DOM_ELEMENTS.taskList.children[this.focusIdx - 1].shadowRoot;
          const childNodes = Array.from(shadow.childNodes);
          this.dprint(`shadowChildren: ${childNodes}`);
          // checkbox is the 2nd child 
          childNodes[1].click();
      }
  }

  handleMinus(event, mutex) {
    if(mutex) {
        return;
    }
    // click the expansion label if shown 
    if(this.DOM_ELEMENTS.expansionLabel.style.display !== 'none' && 
        this.DOM_ELEMENTS.expansionLabel.style.display !== undefined) {
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
    if(this.DOM_ELEMENTS.taskList.children.length > 1) {
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
        %(this.DOM_ELEMENTS.taskList.children.length + 1);
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

export default keyboardInteractions;
