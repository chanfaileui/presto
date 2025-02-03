import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import LogoutButton from '../../src/components/LogoutButton'

describe('Logout Component', () => {
  it('logs out without errors when the token is valid', () => {
    // register a new user to get a valid token
    cy.request({
      method: 'POST',
      url: 'http://localhost:5005/admin/auth/register',
      body: {
        email: `test${Date.now()}@example.com`,
        password: 'test',
        name: 'Test'
      }
    }).then(response => {
      const token = response.body.token
      localStorage.setItem('token', token)

      // mock API call to logout function
      cy.intercept('POST', 'http://localhost:5005/admin/auth/logout', req => {
        expect(req.headers.authorization).to.equal(`Bearer ${token}`)
        return { statusCode: 200 }
      }).as('logoutApi')

      cy.mount(
        <Router>
          <LogoutButton
            token={token}
            setTokenFunction={cy.stub().as('setTokenFunction')}
          />
        </Router>
      )

      cy.get('[data-testid="logoutbtn"]').click()

      // calls logout with right token
      cy.wait('@logoutApi').then(interception => {
        expect(interception.request.headers.authorization).to.equal(
          `Bearer ${token}`
        )
        // set app token to nothing
        cy.get('@setTokenFunction').should('have.been.calledWith', '')

        // token should be removed from localStorage as well
        cy.wrap(localStorage.getItem('token')).should('be.null')
      })
    })
  })
})
