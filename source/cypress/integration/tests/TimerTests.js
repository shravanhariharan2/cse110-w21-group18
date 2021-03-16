describe('Timer Tests', () => {
  const MS_IN_WORK_SESSION = 25 * 60 * 1000;
  const MS_IN_SHORT_BREAK = 5 * 60 * 1000;
  const MS_IN_LONG_BREAK = 30 * 60 * 1000;

  const workSessionBackgroundStyle = 'rgb(255, 255, 255)';
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
