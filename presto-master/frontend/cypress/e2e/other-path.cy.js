describe('template spec', () => {
  const user = {
    name: 'Fai',
    email: `${new Date().getTime()}@example.com`,
    password: 'faiAwesome',
    confirmPassword: 'faiAwesome'
  }

  before(() => {
    cy.visit('localhost:3000')
    cy.viewport(400, 700)
    cy.contains('Sign up!').click()
    cy.url().should('include', '/register')

    cy.get('input[name="name"]').type(user.name)
    cy.get('input[name="email"]').type(user.email)
    cy.get('input[name="password"]').type(user.password)
    cy.get('input[name="confirmPassword"]').type(user.confirmPassword)
    cy.get('button[type="submit"]').click()
  })

  it('other testing path', () => {
    // Create multiple presentations
    for (let i = 1; i <= 3; i++) {
      cy.get('#tab-bar').contains('button', 'New presentation').click()
      cy.get('input[name="presentationName"]').type(`Presentation ${i}`)
      cy.contains('button', 'Submit').click()
    }

    // Verify all presentations are created
    cy.get('.MuiCard-root').should('have.length', 3)

    cy.get('.MuiCard-root').contains('Presentation 2').click()

    // Add slides
    cy.get('[data-testid="MenuRoundedIcon"]').click()
    cy.get('.MuiDrawer-content').within(() => {
      cy.contains('button', 'New slide').click()
      cy.contains('button', 'New slide').click()
      cy.contains('button', 'New slide').click()
    })

    // Delete slides
    cy.get('[data-testid="CloseIcon"]').click()
    cy.get('[data-testid="deleteSlide').click()

    // Verify slide deletion
    cy.get('[data-testid="MenuRoundedIcon"]').click()
    cy.get('.MuiDrawer-content').within(() => {
      cy.get('[data-testid="singleSlideDeck"]').should('have.length', 3)
    })

    // Add elements to the remaining slide

    // Verify elements are added

    // Delete all slides and presentation
    cy.get('[data-testid="CloseIcon"]').click()
    cy.get('[data-testid="deleteSlide').click()
    cy.get('[data-testid="deleteSlide').click()
    cy.get('[data-testid="deleteSlide').click()
    cy.contains('button', 'Yes').click()

    cy.get('.MuiCard-root').should('have.length', 2)
  })
})
