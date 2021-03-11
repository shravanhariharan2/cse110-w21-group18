describe('Timer Tests', () => {
  const MS_IN_WORK_SESSION = 25 * 60 * 1000;
  const MS_IN_SHORT_BREAK = 5 * 60 * 1000;
  const MS_IN_LONG_BREAK = 30 * 60 * 1000;

  const workSessionBackgroundStyle = 'rgb(159, 237, 215)';
  const shortBreakBackgroundStyle = 'rgb(254, 249, 199)';
  const longBreakBackgroundStyle = 'rgb(252, 225, 129)';

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/source/index.html');
  });

  it('Timer starts and counts down when start button clicked', () => {
    cy.get('#time').should('have.text', '25 : 00');
    cy.clock();
    cy.get('#start')
      .click();
    // Advance the timer to the end of the work session
    cy.tick(MS_IN_WORK_SESSION - 1);
    cy.get('#time').should('have.text', '00 : 00');
  });

  it('Timer resets when stop is clicked', () => {
    cy.get('#time').should('have.text', '25 : 00');
    cy.clock();
    cy.get('#start')
      .click();
    // Advance the timer to the middle of the work session
    cy.tick(MS_IN_WORK_SESSION / 2);
    // Stop the timer
    cy.get('#start')
      .click();
    cy.get('#time').should('have.text', '25 : 00');
    cy.get('#timer-box').should('have.css', 'background-color', workSessionBackgroundStyle);
  });

  it('Timer style changes correctly between work session and breaks', () => {
    cy.clock();
    for (let i = 0; i < 3; i += 1) {
      cy.get('#start')
        .click();
      cy.tick(MS_IN_WORK_SESSION);
      cy.get('#timer-box').should('have.css', 'background-color', shortBreakBackgroundStyle);
      cy.tick(MS_IN_SHORT_BREAK);
      cy.get('#timer-box').should('have.css', 'background-color', workSessionBackgroundStyle);
    }
    cy.get('#start')
      .click();
    cy.tick(MS_IN_WORK_SESSION);
    // Timer should switch to long break after the fourth work session
    cy.get('#timer-box').should('have.css', 'background-color', longBreakBackgroundStyle);
    cy.tick(MS_IN_LONG_BREAK);
    cy.get('#timer-box').should('have.css', 'background-color', workSessionBackgroundStyle);
  });
});

describe('Task Tests', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/source/index.html', {
      onBeforeLoad: (win) => {
        win.sessionStorage.clear();
      },
    });
  });

  it('Task moves to completed after marked as done', () => {
    cy.get('#add-task')
      .click();
    cy.get('#add-task-name').clear().type('Mock Task');
    cy.get('#pomos').select('2');
    cy.get('#add-notes')
      .click();
    cy.get('#add-task-description').clear().type('Mock Notes');
    cy.get('#save-task')
      .click();
    // No tasks completed yet
    cy.get('#1').then(($el) => {
      expect($el).to.have.attr('isComplete', 'false');
    });
    cy.get('#completed-list').children().should('have.length', 0);
    cy.get('#1').shadow().find('.checkmark')
      .click({ force: true });
    cy.get('#expand-completed')
      .click();
    // Task moved to completed list
    cy.get('#completed-list').children().should('have.length', 1);
    cy.get('#-1').then(($el) => {
      expect($el).to.have.attr('isComplete', 'true');
    });
  });

  it('Task deleted when trash icon clicked', () => {
    cy.get('#add-task')
      .click();
    cy.get('#add-task-name').clear().type('Mock Task');
    cy.get('#pomos').select('2');
    cy.get('#add-notes')
      .click();
    cy.get('#add-task-description').clear().type('Mock Notes');
    cy.get('#save-task')
      .click();
    // Task added to to-do list
    cy.get('#to-do-list').children().should('have.length', 1);
    cy.get('#1').shadow().find('.expand-button')
      .click();
    cy.get('#1').shadow().find('.remove-button')
      .click();
    // Task removed from task list
    cy.get('#to-do-list').children().should('have.length', 0);
  });
});

describe('Settings Tests', () => {
  const MS_IN_WORK_SESSION = 25 * 60 * 1000;
  const MS_IN_SHORT_BREAK = 5 * 60 * 1000;

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/source/index.html');
  });

  it('Changing pomodoro duration changes the timer display', () => {
    cy.get('#settings-button')
      .click({ force: true });
    cy.get('#pomo-duration-select').select('20');
    cy.get('#save-button')
      .click();
    cy.get('#time').should('have.text', '20 : 00');
  });

  it('Changing short break duration changes the short break timer display', () => {
    cy.clock();
    cy.get('#settings-button')
      .click({ force: true });
    cy.get('#short-duration-select').select('3');
    cy.get('#save-button')
      .click();
    cy.get('#start')
      .click();
    cy.tick(MS_IN_WORK_SESSION);
    cy.get('#time').should('have.text', '02 : 59');
  });

  it('Changing long break duration changes the long break timer display', () => {
    cy.clock();
    cy.get('#settings-button')
      .click({ force: true });
    cy.get('#long-duration-select').select('15');
    cy.get('#long-pomo-select').select('1');
    cy.get('#save-button')
      .click();
    cy.get('#start')
      .click();
    cy.tick(MS_IN_WORK_SESSION);
    cy.get('#time').should('have.text', '14 : 59');
  });

  it('Selecting pause timer at start of break pauses the timer', () => {
    cy.clock();
    cy.get('#settings-button')
      .click({ force: true });
    cy.get('#pause-before-breaks')
      .click();
    cy.get('#save-button')
      .click();
    cy.get('#start')
      .click();
    cy.tick(MS_IN_WORK_SESSION);
    // Advance time halfway into short break
    cy.tick(MS_IN_SHORT_BREAK / 2);
    // Assert the timer paused after the work session
    cy.get('#time').should('have.text', '05 : 00');
  });

  it('Unselecting pause timer at start of work session setting loops the timer', () => {
    cy.clock();
    cy.get('#settings-button')
      .click({ force: true });
    // Selected by default, so deselects
    cy.get('#pause-after-breaks')
      .click();
    cy.get('#save-button')
      .click();
    cy.get('#start')
      .click();
    cy.tick(MS_IN_WORK_SESSION);
    cy.get('#time').should('have.text', '04 : 59');
    cy.tick(MS_IN_SHORT_BREAK);
    cy.get('#time').should('have.text', '24 : 59');
    cy.tick(MS_IN_WORK_SESSION / 2);
    cy.get('#time').should('have.text', '12 : 29');
  });

  it('Changing the hide seconds setting changes the timer display', () => {
    cy.clock();
    cy.get('#settings-button')
      .click({ force: true });
    cy.get('#hide-seconds').click();
    cy.get('#save-button')
      .click();
    cy.get('#time').should('have.text', '25 m');
    cy.get('#start')
      .click();
    // Advance timer 1 minute before end of session
    cy.tick(MS_IN_WORK_SESSION - 60000);
    // Assert that the timer includes seconds with less than a minute left
    cy.get('#time').should('have.text', '00 : 59');
  });
});
