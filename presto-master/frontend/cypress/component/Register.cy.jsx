import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Register from '../../src/pages/Register'

const mountWithRouter = component => {
  return cy.mount(<Router>{component}</Router>)
}

describe('Register Component', () => {
  const unique = Date.now()

  it('renders the registration form', () => {
    mountWithRouter(<Register setTokenFunction={() => {}} />)
    cy.get('form').should('exist')
    cy.get('input[name="name"]').should('be.visible')
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('input[name="confirmPassword"]').should('be.visible')
  })

  // if passwords don't match, the appropriate error message should appear
  it('passwords do not match error', () => {
    mountWithRouter(<Register setTokenFunction={() => {}} />)
    cy.get('input[name="name"]').type('Fai')
    cy.get('input[name="email"]').type(`faifai${unique}@example.com`)
    cy.get('input[name="password"]').type('iamsecret123')
    cy.get('input[name="confirmPassword"]').type('im')
    cy.get('button[type="submit"]').click()
    cy.contains('Passwords do not match!').should('be.visible')
  })

  // register 2 accounts with different details but same email
  // the appropriate error message should appear
  it('email already exists', () => {
    const regoemail = `hehehe${unique}@example.com`

    mountWithRouter(<Register setTokenFunction={() => {}} />)
    cy.get('input[name="name"]').type('Baa')
    cy.get('input[name="email"]').type(regoemail)
    cy.get('input[name="password"]').type('heyo')
    cy.get('input[name="confirmPassword"]').type('heyo')
    cy.get('button[type="submit"]').click()

    cy.get('input[name="name"]').invoke('val', '').type('Boo')
    cy.get('input[name="email"]').invoke('val', '').type(regoemail)
    cy.get('input[name="password"]').invoke('val', '').type('hi')
    cy.get('input[name="confirmPassword"]').invoke('val', '').type('hi')
    cy.get('button[type="submit"]').click()
    cy.contains('Email address already registered').should('be.visible')
  })

  it('valid registration', () => {
    const regoemail2 = `example${unique}@example.com`

    // intercept register api call
    cy.intercept('POST', 'http://localhost:5005/admin/auth/register', {
      statusCode: 200,
      body: { token: 'fake_token' }
    }).as('registerRequest')

    mountWithRouter(<Register setTokenFunction={() => {}} />)
    cy.get('input[name="name"]').type('Hehe')
    cy.get('input[name="email"]').type(regoemail2)
    cy.get('input[name="password"]').type('123')
    cy.get('input[name="confirmPassword"]').type('123')
    cy.get('button[type="submit"]').click()

    // Check if correct request was made on submission
    cy.wait('@registerRequest').its('request.body').should('deep.equal', {
      name: 'Hehe',
      email: regoemail2,
      password: '123'
    })
  })
})
