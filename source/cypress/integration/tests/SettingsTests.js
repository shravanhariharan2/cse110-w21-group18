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
