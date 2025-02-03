import React from 'react'
import EditModal from '../../src/components/EditModal'

describe('<EditModal />', () => {
  it('renders with initial title', () => {
    const first = 'chocolate'

    cy.mount(
      <EditModal
        open={true}
        onClose={cy.stub()}
        onSave={cy.stub()}
        initialTitle={first}
      />
    )

    // modal should render properly on screen with prefilled title
    cy.get('div[role="dialog"]').should('be.visible')
    cy.get('input[name="presentationName"]').should('have.value', first)
  })

  it('can edit title and submit when click enter', () => {
    cy.mount(
      <EditModal
        open={true}
        onClose={cy.stub().as('onClose')}
        onSave={cy.stub().as('onSave')}
        initialTitle='chocolate'
      />
    )

    // save new title when you press enter
    const newTitle = 'vanilla'
    cy.get('input[name="presentationName"]').invoke('val', '').type(`${newTitle}{enter}`)
    cy.get('@onSave').should('have.been.calledOnceWith', newTitle)
  })

  it('saves the title when save button is clicked', () => {
    cy.mount(
      <EditModal
        open={true}
        onClose={cy.stub().as('onClose')}
        onSave={cy.stub().as('onSave')}
        initialTitle='chocolate'
      />
    )

    // save when you click save button
    const newTitle = 'vanilla'
    cy.get('input[name="presentationName"]').invoke('val', '').type(newTitle)
    cy.contains('button', 'Save').click()
    cy.get('@onSave').should('have.been.calledOnceWith', newTitle)
  })

  it('closes the modal when the close icon is clicked', () => {
    cy.mount(
      <EditModal
        open={true}
        onClose={cy.stub().as('onClose')}
        onSave={cy.stub().as('onSave')}
        initialTitle='chocolate'
      />
    )

    // modal is closed when close icon is closed
    cy.get('[data-testId="CloseIcon"]').click()
    cy.get('@onClose').should('have.been.calledOnce')
  })
})
