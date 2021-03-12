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
