import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '@mui/joy/Button'
import DeleteIcon from '@mui/icons-material/Delete'

import { Transition } from 'react-transition-group'
import Box from '@mui/joy/Box'
import Modal from '@mui/joy/Modal'
import ModalDialog from '@mui/joy/ModalDialog'
import Typography from '@mui/joy/Typography'

import {
  getStore,
  putStore,
  deletePresentation
} from '../helpers/Api'

export default function DeleteSlide ({
  token,
  presentationId,
  slideId,
  onSlideDeleted
}) {
  const [open, setOpen] = React.useState(false)
  const nodeRef = React.useRef(null)
  const navigate = useNavigate()

  /**
   * Add new presentation to database
   * @param {*} e
   */
  const storeSlide = async e => {
    e.preventDefault()

    try {
      const response = await getStore(token)
      console.log('store get res', response)
      const currentStore = { ...response }
      console.log('currentstore', currentStore)
      const found = currentStore.presentations.find(
        p => String(p.id) === String(presentationId)
      )
      console.log('fonud?', found)

      if (found.slides.length === 1) {
        setOpen(true)
        // Show error message asking to delete the presentation instead
        console.log(
          'Error: Cannot delete the only slide. Delete the presentation instead?'
        )
        return
      }

      const removed = found.slides.splice(slideId, 1)
      console.log('removed', removed)
      //   const newStore = found.slides.filter(
      //     s => String(s.id) !== String(sresentationId)
      //   )
      const payload = { store: currentStore }
      await putStore(token, payload)
      // notify dashboard to fetch
      onSlideDeleted()
    } catch (err) {
      alert(`Error creating slide: ${err.message}`)
    }
  }

  const handleDeletePresentation = async () => {
    await deletePresentation(token, presentationId)
    setOpen(false)
    if (navigate) {
      navigate('/dashboard')
    }
  }

  return (
    <React.Fragment>
      <Button
        data-testid='deleteSlide'
        variant='outlined'
        color='neutral'
        startDecorator={<DeleteIcon />}
        onClick={storeSlide}
      >
        Delete slide
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
            {/* <Modal open={open} onClose={() => setOpen(false)}> */}
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
                Error:
              </Typography>
              <Typography
                id='delete-presentation-description'
                textColor='text.tertiary'
              >
                Cannot delete the only slide. Delete the presentation instead?
                :&#40;
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
