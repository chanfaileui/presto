/* eslint-disable multiline-ternary */
import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate, useParams } from 'react-router-dom'
import { usePresentation } from '../context/PresentationContext'
import axios from 'axios'

import { useColorScheme } from '@mui/joy/styles'
import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import IconButton from '@mui/joy/IconButton'
import Stack from '@mui/joy/Stack'
import Tooltip from '@mui/joy/Tooltip'
import Drawer from '@mui/joy/Drawer'
import ModalClose from '@mui/joy/ModalClose'
import DialogTitle from '@mui/joy/DialogTitle'

import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'

import myLogo from '../assets/uwu.jpeg'
import LogoutButton from './LogoutButton'
import DeletePresentation from '../components/DeletePresentation'
import { getPresentation } from '../helpers/Api'

import NavigationPresentation from './NavigationPresentation'
import { Typography } from '@mui/joy'

import BorderColorIcon from '@mui/icons-material/BorderColor'
import EditThumbnailModal from './EditThumbnailModal'
import EditModal from './EditModal'

/**
 * Light/dark mode
 * @returns
 */
const ColorSchemeToggle = () => {
  const { mode, setMode } = useColorScheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) {
    return <IconButton size='sm' variant='outlined' color='primary' />
  }
  return (
    <Tooltip title='Change theme' variant='outlined'>
      <IconButton
        id='toggle-mode'
        size='sm'
        variant='plain'
        color='neutral'
        sx={{ alignSelf: 'center' }}
        onClick={() => {
          if (mode === 'light') {
            setMode('dark')
          } else {
            setMode('light')
          }
        }}
      >
        {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  )
}

const StyledLogo = styled.img`
  width: 30px;
  height: auto;
`

export default function HeaderPresentation ({
  token,
  setTokenFunction,
  fetchSlideDeck,
  NewSlide
}) {
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false)
  const { id } = useParams()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showEditTitleModal, setShowEditTitleModal] = useState(false)
  const { presentation, setPresentation, setThumbnail, setPresentationId } =
    usePresentation()

  const handleEditTitle = () => {
    setShowEditTitleModal(true)
  }
  const handleSaveTitle = async newTitle => {
    setShowEditModal(false)
    setPresentation(prevPresentation => ({
      ...prevPresentation,
      name: newTitle
    }))
    try {
      const response = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const currentStore = { ...response.data.store }

      const presentationIndex = currentStore.presentations.findIndex(
        p => p.id === presentation.id
      )

      if (presentationIndex !== -1) {
        currentStore.presentations[presentationIndex].name = newTitle

        const payload = { store: currentStore }

        await axios.put(
          'http://localhost:5005/store',
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      } else {
        console.error('Presentation not found.')
      }
    } catch (error) {
      console.error('Error saving title:', error)
    }
  }

  const handleSaveThumbnail = async newThumbnail => {
    setShowEditModal(false)
    try {
      const response = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const currentStore = { ...response.data.store }

      const presentationIndex = currentStore.presentations.findIndex(
        p => p.id === presentation.id
      )
      console.log('presentationIndex', presentationIndex)
      if (presentationIndex !== -1) {
        currentStore.presentations[presentationIndex].thumbnail = newThumbnail

        const payload = { store: currentStore }

        await axios.put(
          'http://localhost:5005/store',
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        console.log('Updated Store:', currentStore)
      } else {
        console.error('Presentation not found.')
      }
    } catch (error) {
      console.error('Error saving thumbnail:', error)
    }
  }

  React.useEffect(() => {
    if (token) {
      const fetchPresentation = async () => {
        try {
          const data = await getPresentation(token, id)
          setThumbnail(data)
        } catch (err) {
          console.error('Failed to fetch presentation', err)
        }
      }
      fetchPresentation()
    }
  }, [id, token])

  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'space-between'
      }}
    >
      {/* MENU BAR */}
      <Stack
        id='presentation-stack'
        direction='row'
        justifyContent='center'
        alignItems='center'
        spacing={1}
        sx={{ display: { xs: 'none', sm: 'flex' } }}
      >
        {/* ICON */}
        <IconButton
          size='md'
          variant='plain'
          color='neutral'
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            width: 2,
            height: 'auto'
          }}
          onClick={() => navigate('/dashboard')}
        >
          <StyledLogo src={myLogo} alt='My Logo' />
        </IconButton>

        <Button
          color='neutral'
          variant='plain'
          onClick={() => {
            navigate('/dashboard')
            setPresentationId('')
          }}
        >
          ← Back
        </Button>
        <DeletePresentation
          token={token}
          presentationId={id}
        ></DeletePresentation>
      </Stack>

      {/* MOBILE MENU ICON */}
      <Box sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
        <IconButton
          variant='plain'
          color='neutral'
          onClick={() => setOpen(true)}
        >
          <MenuRoundedIcon />
        </IconButton>
        <Drawer
          sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
          open={open}
          onClose={() => setOpen(false)}
        >
          <ModalClose />
          <DialogTitle>I&apos;M JUST A GIRL TT</DialogTitle>
          <Box sx={{ px: 1 }}>
            <NavigationPresentation
              token={token}
              fetchSlideDeck={fetchSlideDeck}
              NewSlide={NewSlide}
            />
          </Box>
        </Drawer>
      </Box>

      <Stack
        direction='row'
        justifyContent='center'
        alignItems='center'
        spacing={1}
      >
        <Typography
          level='h2'
          sx={{
            border: '1px solid grey',
            padding: '5px',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
          onClick={handleEditTitle}
          data-testid='edit-title'
        >
          {presentation.name}
        </Typography>
        <IconButton onClick={() => setShowEditModal(true)}>
          <BorderColorIcon />
        </IconButton>
      </Stack>

      <Stack
        direction='row'
        justifyContent='center'
        alignItems='center'
        spacing={1}
        sx={{ display: { xs: 'none', sm: 'flex' } }}
      >
        <LogoutButton token={token} setTokenFunction={setTokenFunction} />
        {/* DARK MODE */}
        <ColorSchemeToggle />
      </Stack>
      <EditThumbnailModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveThumbnail}
        initialThumbnail={presentation.thumbnail}
      />
      <EditModal
        open={showEditTitleModal}
        onClose={() => setShowEditTitleModal(false)}
        onSave={handleSaveTitle}
        initialTitle={presentation.name}
      />
    </Box>
  )
}
