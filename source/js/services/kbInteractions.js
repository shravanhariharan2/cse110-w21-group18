// this file implements the keyboard interactions handler

class keyboardInteractions {
    constructor() {
        this.DEBUG = true;
        this.DOM_ELEMENTS = {
            timerButton : document.getElementById('start'),
            taskList: document.getElementById('to-do-list'),
            addTaskButton: document.getElementById('add-task'),
            confirmTaskButton: document.getElementById('save-task'),
            inputBox: document.getElementById('task-add-input'),
        };

        this.focusIdx = -1;

        // bind functions 
        this.onKeyUp = this.onKeyUp.bind(this);
        this.dprint = this.dprint.bind(this);

        // add event listeners
        document.addEventListener("keyup", this.onKeyUp);
       
    }

    /**
     * Checks key press ID and handles accordingly
     * @param {*} event the event object passed by an EventListener
     */
    onKeyUp(event) {
        switch(event.keyCode) {
            // space key
            case 32: 
                this.DOM_ELEMENTS.timerButton.click();
                this.dprint("Enter pressed");
                break;

            // tab key
            case 9:
                event.preventDefault();
                this.incrementIdx();
                if(this.focusIdx === 0) {
                    this.DOM_ELEMENTS.addTaskButton.focus();
                    this.DOM_ELEMENTS.taskList.children[
                        this.DOM_ELEMENTS.taskList.children.length - 1
                    ].click();
                }
                else {
                    this.DOM_ELEMENTS.taskList.children[this.focusIdx - 1].focus();
                    document.activeElement.click();
                }
                break;
            
            // enter key 
            case 13: 
                event.preventDefault();
                // if(this.focusIdx === 0) {
                //     if(this.DOM_ELEMENTS.inputBox.style.display == 'none')
                //         this.DOM_ELEMENTS.addTaskButton.click();
                //     else {
                //         this.DOM_ELEMENTS.
                //     }
                // }
                break;

            // non-cased keys
            default: 
                this.dprint("key binding is not implemented");
        }
    }

    incrementIdx() {
        // increment if there are tasks
        if(this.DOM_ELEMENTS.taskList.children.length > 0) {
            // increment on virtual array [add task button, (rest of task list)]
            // idx 0 = add task button, other idx is task list idx
            this.focusIdx = ((this.focusIdx + 1) % (this.DOM_ELEMENTS.taskList.children.length + 1));
        }
        else {
            this.focusIdx = 0;
        }

        this.dprint(this.focusIdx);
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