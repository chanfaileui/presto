/* eslint-disable multiline-ternary */
// adapted from MUI/JoyUI template at https://mui.com/joy-ui/getting-started/templates/
import * as React from 'react'
import axios from 'axios'
import { CssVarsProvider } from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import AspectRatio from '@mui/joy/AspectRatio'
import Box from '@mui/joy/Box'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Chip from '@mui/joy/Chip'
import Typography from '@mui/joy/Typography'
import Link from '@mui/joy/Link'
import Stack from '@mui/joy/Stack'

import Layout from '../components/Layout'
import Header from '../components/Header'
import LogoutButton from '../components/LogoutButton'
import NewPresentation from '../components/NewPresentation'

import { Navigate, useNavigate } from 'react-router-dom'
import { usePresentation } from '../context/PresentationContext'

export default function Dashboard ({ token, setTokenFunction }) {
  // console.log('im in dashboard rn! and dashboard token is', token)
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [presentations, setPresentations] = React.useState([])
  const { setPresentation } = usePresentation()
  React.useEffect(() => {
    if (token) {
      fetchPresentations()
    } else {
      return <Navigate to='/login' />
    }
  }, [token])

  const fetchPresentations = async () => {
    try {
      const response = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.data.store && response.data.store.presentations) {
        setPresentations(response.data.store.presentations)
      }
    } catch (error) {
      console.error('Failed to fetch presentations', error)
    }
  }

  const clickPresentation = (e, presentation) => {
    e.preventDefault()
    setPresentation(presentation)
    navigate(`/presentations/${presentation.id}`)
  }
  return (
    <CssVarsProvider disableTransitionOnChange>
      {/* reset CSS across browsers */}
      <CssBaseline />

      {/* SIDEBAR TOGGLE */}
      {drawerOpen && (
        <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
          {/* <Navigation /> */}
        </Layout.SideDrawer>
      )}

      {/* BOTTOM MOBILE STACK */}
      <Stack
        id='tab-bar'
        direction='row'
        justifyContent='space-around'
        spacing={1}
        sx={{
          display: { xs: 'flex', sm: 'none' },
          justifyContent: 'space-between',
          padding: '20px',
          zIndex: '999',
          bottom: 0,
          position: 'fixed',
          width: '100dvw',
          py: 2,
          backgroundColor: 'background.body',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <NewPresentation
          token={token}
          onPresentationAdded={fetchPresentations}
        />
        <LogoutButton token={token} setTokenFunction={setTokenFunction} />
      </Stack>

      <Layout.Root
        sx={{
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'minmax(64px, 200px) minmax(450px, 1fr)',
            md: 'minmax(160px, 300px) minmax(600px, 1fr)'
          },
          ...(drawerOpen && {
            height: '100vh',
            overflow: 'hidden'
          })
        }}
      >
        <Layout.Header>
          <Header
            token={token}
            setTokenFunction={setTokenFunction}
            headerContent='dashboard'
            onPresentationAdded={fetchPresentations}
          />
        </Layout.Header>

        <Layout.SideNav>{/* <Navigation /> */}</Layout.SideNav>

        <Layout.Main>
          <Box
            sx={{
              display: 'grid',
              justifyContent: 'start',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 2
            }}
          >
            {presentations.map(presentation => (
              <Card
                key={presentation.id}
                variant='outlined'
                size='sm'
                orientation='horizontal'
                sx={{
                  maxWidth: '400px',
                  aspectRatio: '2/1',
                  '&:hover': {
                    boxShadow: 'md',
                    borderColor: 'neutral.outlinedHoverBorder'
                  },
                  alignItems: 'center'
                }}
              >
                {presentation.thumbnail ? (
                  <AspectRatio
                    data-testid='presentationThumbnail'
                    ratio='4/3'
                    sx={{
                      width: '40%',
                      ml: '3px',
                      mr: '3px'
                    }}
                  >
                    <img
                      src={presentation.thumbnail}
                      loading='lazy'
                      alt='presentaion thumbail'
                    />
                  </AspectRatio>
                ) : (
                  <AspectRatio
                    ratio='4/3'
                    color='neutral'
                    sx={{
                      width: '40%'
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    ></Box>
                  </AspectRatio>
                )}

                <CardContent sx={{ display: 'flex' }}>
                  <Typography level='title-md'>
                    <Link
                      overlay
                      underline='none'
                      onClick={e => clickPresentation(e, presentation)}
                      sx={{ color: 'text.tertiary' }}
                    >
                      {presentation.name}
                    </Link>
                  </Typography>

                  <Typography
                    level='body-sm'
                    aria-describedby='card-description'
                    mb={1}
                  >
                    {presentation.description}
                  </Typography>

                  <Chip
                    variant='outlined'
                    color='primary'
                    size='sm'
                    sx={{ pointerEvents: 'none' }}
                  >
                    Slides: {presentation.slides.length}
                  </Chip>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Layout.Main>
      </Layout.Root>
    </CssVarsProvider>
  )
}
