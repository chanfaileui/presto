import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Presentation from './pages/Presentation'
import { usePresentation } from './context/PresentationContext'

export default function App () {
  // console.log('APP: im in app rn!')
  const { token, setToken } = usePresentation()
  // const [token, setToken] = React.useState(null)

  React.useEffect(() => {
    const lsToken = localStorage.getItem('token')
    if (lsToken) {
      // console.log('APP: local storage token is ', lsToken)
      setToken(lsToken)
    }
  }, [])

  const setTokenAbstract = token => {
    // console.log('APP: passsed in token to set system token is', token)
    setToken(token)
    localStorage.setItem('token', token)
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to='/login' replace />} />
          <Route
            path='/login'
            element={
              <Login token={token} setTokenFunction={setTokenAbstract} />
            }
          />
          <Route
            path='/register'
            element={
              <Register token={token} setTokenFunction={setTokenAbstract} />
            }
          />
          <Route
            path='/dashboard'
            element={
              <Dashboard token={token} setTokenFunction={setTokenAbstract} />
            }
          />
          <Route
            path='/presentations/:id'
            element={<Presentation token={token} setTokenFunction={setTokenAbstract}/>}
          />
        </Routes>
      </Router>
    </>
  )
}
