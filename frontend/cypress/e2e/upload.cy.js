describe('Test for uploading a pic', () => {
  it('passes if we can upload a picture', () => {
    // launch the web app
    cy.visit('http://localhost:3000');
    // check that the button with caption 'login' is displayed
    cy.get('button').contains('Log In');

    // test that the 'Create Student' button is visible
    cy.get('button').contains('Register');

    // Type into the email field
    cy.get('#emailBox').type('yzlsps@qq.com');

    // Type into the password field
    cy.get('#passwordBox').type('123');

    // Test that a user can log in
    cy.get('#logInBtn').click();

    cy.url().should('include', '/home');

    cy.get('#maintTextInput').type('cypress test post');
    cy.get('input[type="file"]').attachFile('cypress_test_pic.jpg');
    cy.get('.shareButton').click();

    cy.contains('cypress test post').should('be.visible');
    cy.contains('Post created').should('be.visible');
  });
});
