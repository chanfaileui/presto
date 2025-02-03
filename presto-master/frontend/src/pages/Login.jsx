/* eslint-disable */

import React from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

import styled from 'styled-components'
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles'
import GlobalStyles from '@mui/joy/GlobalStyles'
import CssBaseline from '@mui/joy/CssBaseline'
import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import Divider from '@mui/joy/Divider'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import IconButton from '@mui/joy/IconButton'

import Input from '@mui/joy/Input'
import Typography from '@mui/joy/Typography'
import Stack from '@mui/joy/Stack'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'

import myLogo from '../assets/uwu.jpeg'
import AlertPopup from '../helpers/AlertPopup'

/**
 * Dark mode
 * @param {*} props
 * @returns
 */
function ColorSchemeToggle(props) {
  const { onClick, ...other } = props
  const { mode, setMode } = useColorScheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  return (
    <IconButton
      aria-label='toggle light/dark mode'
      size='sm'
      variant='outlined'
      disabled={!mounted}
      onClick={event => {
        setMode(mode === 'light' ? 'dark' : 'light')
        onClick?.(event)
      }}
      {...other}
    >
      {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  )
}

const StyledLogo = styled.img`
  width: 30px;
  height: auto;
`

export default function Login({ token, setTokenFunction }) {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = React.useState('')
  const [errorPopup, setErrorPopup] = React.useState(false);

  React.useEffect(() => {
    // console.log('LOGIN: token', token)
    if (token) {
      console.log('LOGIN: already have token, navigate or not??')
      // return <Navigate to='/dashboard' />
    }
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        'http://localhost:5005/admin/auth/login',
        {
          email,
          password
        }
      )
      // console.log('APP:', response.data)
      setTokenFunction(response.data.token)
      navigate('/dashboard')
    } catch (err) {
      setErrorMessage(err.response.data.error);
      setErrorPopup(true);
      // alert(err.response.data.error)
    }
  }

  return (
    <CssVarsProvider defaultMode='dark' disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--Form-maxWidth': '800px',
            // '--Transition-duration': 'none', // set to `none` to disable transition
            '--Transition-duration': '0.4s' // set to `none` to disable transition
          }
        }}
      />
      <AlertPopup message={errorMessage} errorPopup={errorPopup} setErrorPopup={setErrorPopup} />
      <Box
        sx={theme => ({
          width: '100%',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(255 255 255 / 0.2)',
          [theme.getColorSchemeSelector('dark')]: {
            backgroundColor: 'rgba(19 19 24 / 0.4)'
          }
        })}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100dvh',
            width: '100%',
            px: 2
          }}
        >
          {/* HEADER */}
          <Box
            component='header'
            sx={{
              py: 3,
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
              <IconButton
                size='md'
                variant='plain'
                color='neutral'
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  width: 2,
                  height: 'auto'
                }}
              >
                <StyledLogo src={myLogo} alt='My Logo' />
              </IconButton>
              <Typography level='title-lg'>I&apos;m just a girl</Typography>
            </Box>
            <ColorSchemeToggle />
          </Box>

          <Box
            component='main'
            sx={{
              my: 'auto',
              py: 2,
              pb: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: 400,
              maxWidth: '100%',
              mx: 'auto',
              borderRadius: 'sm',
              '& form': {
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }
            }}
          >
            <Stack gap={4} sx={{ mb: 2 }}>
              <Stack gap={1}>
                <Typography component='h1' level='h3'>
                  Sign in
                </Typography>
                <Typography level='body-sm'>
                  New here?{' '}
                  <Link to='../register' level='title-sm'>
                    Sign up!
                  </Link>
                </Typography>
              </Stack>
            </Stack>
            <Divider
              sx={theme => ({
                [theme.getColorSchemeSelector('light')]: {
                  color: { xs: '#FFF', md: 'text.tertiary' }
                }
              })}
            >
              or
            </Divider>
            <Stack gap={4} sx={{ mt: 2 }}>
              <form
                onSubmit={event => {
                  event.preventDefault()
                  const formElements = event.currentTarget.elements
                  const data = {
                    email: formElements.email.value,
                    password: formElements.password.value
                  }
                  login(data.email, data.password)
                }}
              >
                <FormControl required>
                  <FormLabel>Email</FormLabel>
                  <Input type='text' name='email' />
                </FormControl>
                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input type='password' name='password' />
                </FormControl>
                <Stack gap={3} sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  ></Box>
                  <Button type='submit' fullWidth>
                    Sign in
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
          <Box component='footer' sx={{ py: 3 }}>
            <Typography level='body-xs' textAlign='center'>
              © I&apos;m just a girl {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  )
}
