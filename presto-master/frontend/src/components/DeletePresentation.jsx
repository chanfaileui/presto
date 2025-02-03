import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import { Transition } from 'react-transition-group'

import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import Modal from '@mui/joy/Modal'
import ModalDialog from '@mui/joy/ModalDialog'
import Typography from '@mui/joy/Typography'

import { deletePresentation } from '../helpers/Api'

export default function DeletePresentation ({ token, presentationId }) {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  const handleDeletePresentation = async () => {
    await deletePresentation(token, presentationId, navigate)
    if (navigate) {
      navigate('/dashboard')
    }
  }

  const nodeRef = React.useRef(null)

  return (
    <React.Fragment>
      <Button variant='outlined' color='neutral' onClick={() => setOpen(true)}>
        Delete presentation
      </Button>
      <Transition in={open} timeout={400} nodeRef={nodeRef}>
        {state => (
          <Modal
            open={['entered', 'entering'].includes(state)}
            onClose={() => setOpen(false)}
            sx={{
              opacity: 0,
              transition: 'opacity 200ms ease-in-out',
              ...(state === 'entering' && {
                opacity: 0
              }),
              ...(state === 'entered' && {
                opacity: 1
              }),
              ...(state === 'exiting' && {
                opacity: 0
              }),
              visibility: state === 'exited' ? 'hidden' : 'visible'
            }}
            ref={nodeRef}
          >
            <ModalDialog
              aria-labelledby='delete-presentation-title'
              aria-describedby='delete-presentation-description'
              sx={theme => ({
                [theme.breakpoints.only('xs')]: {
                  top: 'unset',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  borderRadius: 0,
                  transform: 'none'
                },
                ...(state === 'entered' ? {} : { pointerEvents: 'none' }),
                maxWidth: 'unset'
              })}
            >
              <Typography id='delete-presentation-title' level='h2'>
                Are you sure?
              </Typography>
              <Typography
                id='delete-presentation-description'
                textColor='text.tertiary'
              >
                This action cannot be undone. This will permanently delete your
                presentation :&#40;
              </Typography>
              <Box
                sx={{
                  mt: 1,
                  display: 'flex',
                  gap: 1,
                  flexDirection: { xs: 'column', sm: 'row-reverse' }
                }}
              >
                <Button
                  variant='solid'
                  color='primary'
                  onClick={handleDeletePresentation}
                >
                  Yes
                </Button>
                <Button
                  variant='outlined'
                  color='neutral'
                  onClick={() => setOpen(false)}
                >
                  No
                </Button>
              </Box>
            </ModalDialog>
          </Modal>
        )}
      </Transition>
    </React.Fragment>
  )
}
