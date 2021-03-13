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
            timerButton : document.getElementById('start'),
            taskList: document.getElementById('to-do-list'),
            addTaskButton: document.getElementById('add-task'),
            confirmTaskButton: document.getElementById('save-task'),
            inputBox: document.getElementById('task-add-input'),
            inputTextField: document.getElementById('add-task-name'),
            notesTextField: document.getElementById('add-task-description'),
            cancelInput: document.getElementById('cancel-input'),
            acceptInput: document.getElementById('save-task'),
        };

        this.focusIdx = 0;
        this.kbMutex = false;
        this.DOM_ELEMENTS.inputBox.focus();

        // bind functions 
        this.onKeyUp = this.onKeyUp.bind(this);
        this.dprint = this.dprint.bind(this);

        // add event listeners
        document.addEventListener("keyup", this.onKeyUp, false);
       
    }

    /**
     * Checks key press ID and handles accordingly
     * @param {*} event the event object passed by an EventListener
     */
    onKeyUp(event) {
        // mutex prevents certain operations from modifying the page when set to true
        this.kbMutex = false;
        if(document.activeElement === this.DOM_ELEMENTS.inputTextField || 
            document.activeElement === this.DOM_ELEMENTS.notesTextField) 
                this.kbMutex = true;
        
        // check for space, tab, or enter
        switch(event.keyCode) {
            case 32: //space key
                this.handleSpace(event, this.kbMutex);
                break;

            case 9: // tab key
                this.handleTab(event, false);          
                break;
            
            case 13: // enter key
                this.handleEnter(event, false);
                break;

            // non-cased keys
            default: 
                if(this.kbMutex)
                    return;
                this.dprint(`key: ${event.keyCode} is not implemented`);
        }
    }

    /**
     * handles the space keypress, is restricted when editing text fields
     * @param {event} event the event object passed by an EventListener
     * @param {*} mutex a boolean used to restrict/negate function flow
     */
    handleSpace(event, mutex) {
        if(mutex)
            return;
        else {
            this.DOM_ELEMENTS.timerButton.click();
            this.dprint("Enter pressed");
        }
    }

    /**
     * handles the tab keypress
     * @param {event} event the event object passed by an EventListener
     * @param {*} mutex a boolean used to restrict/negate function flow
     */

    handleTab(event, mutex) {
        event.preventDefault();
        if(mutex)
            return;

        else {
            // prevent default tab function
            this.incrementIdx();

            // if the current focus is not a task then it must be the add task button
            if(this.focusIdx === 0) {
                this.DOM_ELEMENTS.inputBox.focus();
                // unclick the last task (so it's not highlighted)
                try {
                    this.DOM_ELEMENTS.taskList.children[
                        this.DOM_ELEMENTS.taskList.children.length - 1
                    ].click();
                }
                catch {
                    this.dprint("No children to unclick");
                }
            }
            else {
                // collapse add task form if possible
                this.DOM_ELEMENTS.cancelInput.click();

                // focus on the current task and highlight it
                this.DOM_ELEMENTS.taskList.children[this.focusIdx - 1].focus();
                document.activeElement.click();
            }
        }
    }

    /**
     * handles the enter keypress
     * @param {event} event the event object passed by an EventListener
     * @param {*} mutex a boolean used to restrict/negate function flow
     */
    handleEnter(event, mutex) {
        this.dprint(`focused idx: ${this.focusIdx}\n` + 
            `event key: ${event.keyCode}`
        );
        if(mutex)
            return;

        event.stopImmediatePropagation();
        // handle enter on <add-task-button>
        if(this.focusIdx === 0) {
            this.dprint(`form display value: ${this.DOM_ELEMENTS.inputBox.style.display}`);
            if(this.DOM_ELEMENTS.inputBox.style.display == 'none' || 
                this.DOM_ELEMENTS.inputBox.style.display === undefined) {
               this.DOM_ELEMENTS.addTaskButton.click();
               this.DOM_ELEMENTS.inputTextField.focus();
            }
            else {
                // if task text box is non-empty then add task
                if(this.DOM_ELEMENTS.inputTextField.value.length === 0)
                    this.DOM_ELEMENTS.cancelInput.click();
                else
                    this.DOM_ELEMENTS.acceptInput.click();
            }
        }
        // handle enter on <task>
        else {
            let shadow = this.DOM_ELEMENTS.taskList.children[this.focusIdx - 1].shadowRoot;
            let childNodes = Array.from(shadow.childNodes);
            // expand button is the 4th child 
            childNodes[4].click();
        }
    }

    /**
     * updates the index (in case of mouse selection) then increments the index 
     * idx = 0 is mapped to adding a task 
     * idx > 0 is mapped to tasks in order
     */
    incrementIdx() {
        // TODO: update idx from mouse click (BLOCKAGE!!! No good way to track tasks)
        // increment if there are tasks
        if(this.DOM_ELEMENTS.taskList.children.length > 0) 
            this.focusIdx = ((this.focusIdx+1)%(this.DOM_ELEMENTS.taskList.children.length + 1));
        else 
            this.focusIdx = 0;
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