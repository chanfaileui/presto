import React from 'react'
import AlertPopup from '../../src/helpers/AlertPopup'

describe('AlertPopup Component', () => {
  it('right message', () => {
    const message = 'Supercalifragilisticexpialidocious!'
    cy.mount(
      <AlertPopup
        message={message}
        errorPopup={true}
        setErrorPopup={() => {}}
      />
    )
    // alert popup should show correct error message passed in
    cy.get('body').find('.MuiSnackbar-root').should('be.visible')
    cy.contains(message).should('be.visible')
  })

  it('displays correct icons', () => {
    cy.mount(
      <AlertPopup
        message='Error occurred!'
        errorPopup={true}
        setErrorPopup={() => {}}
      />
    )
    // should have the right icons
    cy.get('[data-testid="ReportIcon"]').should('exist')
    cy.get('[data-testId="CloseRoundedIcon"]').should('exist')
  })

  it('does not display when errorPopup is false', () => {
    cy.mount(
      <AlertPopup
        message='Error occurred!'
        errorPopup={false}
        setErrorPopup={() => {}}
      />
    )

    cy.get('body').find('.MuiSnackbar-root').should('not.exist')
  })

  // when close button is clicked, the visibility of the error popup should be set to false
  it('closes the alert when the close icon is clicked', () => {
    const setErrorPopup = cy.stub()
    cy.mount(
      <AlertPopup
        message={'hehehehehehehehehehehe'}
        errorPopup={true}
        setErrorPopup={setErrorPopup}
      />
    )
    cy.wrap(setErrorPopup).as('setErrorPopup')

    cy.get('body').find('.MuiSnackbar-root').should('be.visible')
    cy.get('[data-testId="CloseRoundedIcon"]').click()
    cy.get('@setErrorPopup').should('have.been.calledOnceWith', false)
  })
})
