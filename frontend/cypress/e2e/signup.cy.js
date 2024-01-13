describe('Registration', () => {
  it('Test that we can register and log in a new user', () => {
    // Visit the login page
    cy.visit('http://localhost:3000');

    // Click on the 'Register' button to navigate to the signup page
    cy.get('#registrationBtn').click();

    // Now we should be on the signup page, so let's fill out the form
    // Type in the username
    cy.get('#username').type('cypressUser');

    // Type in the email
    cy.get('#emailBox').type('cypressUser@gmail.com');

    // Type in the password
    cy.get('#passwordBox').type('cypress1234');

    // Click on the 'Sign Up' button
    cy.get('#signUp').click();

    // Verify successful registration (assuming you have a success message upon registration)
    cy.contains('Registration succeed.').should('be.visible');

    // Now the new user tries to sign in
    cy.get('#emailBox').type('cypressUser@gmail.com');

    // Type in the password
    cy.get('#passwordBox').type('cypress1234');

    // Click on the 'Log In' button
    cy.get('#logInBtn').click();

    // Verify successful login
    cy.contains('login success').should('be.visible');
  });
});
