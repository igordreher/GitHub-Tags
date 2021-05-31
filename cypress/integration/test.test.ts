describe('Login page', () => {
    before(() => {
        cy.log(`Visiting ${Cypress.env('SITE_NAME')}`);
        cy.visit('/');
        cy.login();
    });
});
