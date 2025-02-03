import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/joy/Button'

export default function Logout ({ token, setTokenFunction }) {
  const navigate = useNavigate()

  const logout = async () => {
    try {
      // invalidate the token
      await axios.post(
        'http://localhost:5005/admin/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      // set global token variable to empty
      setTokenFunction('')

      // also remove localstorage token
      localStorage.removeItem('token')

      navigate('/login')
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error)
      } else {
        console.error('Logout error:', err)
        alert('An error occurred during logout')
      }
      // navigate('/login')
      // alert(err.response.data.error)
    }
  }
  return (
    <Button
      data-testid='logoutbtn'
      variant='plain'
      color='neutral'
      aria-pressed='true'
      component='a'
      onClick={logout}
      sx={{ alignSelf: 'center' }}
    >
      Logout
    </Button>
  )
}
