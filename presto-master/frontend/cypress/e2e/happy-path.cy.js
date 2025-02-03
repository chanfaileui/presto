describe('template spec', () => {
  // unique user
  const user = {
    name: 'Fai',
    email: `${new Date().getTime()}@example.com`,
    password: 'faiAwesome',
    confirmPassword: 'faiAwesome'
  }

  const presentation = {
    name: '1st name',
    updatedName: '2nd name',
    thumbnail:
      'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRR2NYcqQgIeku_4Niz7sHO226E7u13Z3e7ym3Fls8ZUdbeM65J'
  }

  before(() => {
    cy.visit('localhost:3000')
    cy.viewport(1920, 1080)
  })

  it('completes the admin happy path', () => {
    // autonavigate to login page
    cy.url().should('include', '/login')

    // navigate to rego page when click
    cy.contains('Sign up!').click()
    cy.url().should('include', '/register')

    // input
    cy.get('input[name="name"]').type(user.name)
    cy.get('input[name="email"]').type(user.email)
    cy.get('input[name="password"]').type(user.password)
    cy.get('input[name="confirmPassword"]').type(user.confirmPassword)
    cy.get('button[type="submit"]').click()

    // registers successfully
    cy.url().should('include', '/dashboard')

    // Create a new presentation
    cy.get('#desktop-dashboard-stack')
      .contains('button', 'New presentation')
      .click()
    cy.get('input[name="presentationName"]').type(presentation.name)
    cy.contains('button', 'Submit').click()

    // Update the presentation's name
    cy.get('.MuiCard-root').contains(presentation.name).click()
    cy.get('[data-testid="edit-title"]').click()
    cy.get('input[name="presentationName"]')
      .invoke('val', '')
      .type(presentation.updatedName)
    cy.contains('button', 'Save').click()

    // Update the presentation's name
    cy.get('[data-testid="BorderColorIcon"]').click()
    cy.get('input[name="thumbnailURL"]').type(presentation.thumbnail)
    cy.contains('button', 'Save').click()
    cy.get('#presentation-stack').contains('button', 'Back').click()

    // check if updated
    cy.get('.MuiCard-root').contains(presentation.updatedName)
    cy.get('[data-testid="presentationThumbnail"]')
      .find('img')
      .should('have.attr', 'src')
      .should('include', presentation.thumbnail)

    // Add 3 slides to the presentation
    cy.get('.MuiCard-root').contains(presentation.updatedName).click()
    cy.get('#presentation-nav').contains('button', 'New slide').click()
    cy.get('[data-testid="NavigateBeforeIcon"]').should('be.hidden')

    cy.get('#presentation-nav').contains('button', 'New slide').click()
    cy.get('#presentation-nav').contains('button', 'New slide').click()

    // can navigate between slides
    cy.get('#presentation-nav').find('[data-testid="NavigateNextIcon"]').click()
    cy.get('#presentation-nav').find('[data-testid="NavigateNextIcon"]').click()
    cy.get('#presentation-nav').find('[data-testid="NavigateNextIcon"]').click()
    cy.get('#presentation-nav')
      .find('[data-testid="NavigateNextIcon"]')
      .should('be.hidden')

    // delete presentation
    cy.get('#presentation-stack')
      .contains('button', 'Delete presentation')
      .click()
    cy.contains('button', 'Yes').click()

    // presentation should not exist
    cy.contains('.MuiCard-root', presentation.updatedName).should('not.exist')

    // Log out
    cy.get('#logout-header').find('[data-testid="logoutbtn"]').click()
    cy.url().should('include', '/login')

    // Log back into the application
    cy.get('input[name="email"]').type(user.email)
    cy.get('input[name="password"]').type(user.password)
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })
})
