import React, { useEffect, useState } from 'react'
import Button from '@mui/joy/Button'
import Modal from '@mui/joy/Modal'
import Input from '@mui/joy/Input'
import IconButton from '@mui/joy/IconButton'
import DialogTitle from '@mui/joy/DialogTitle'
import DialogContent from '@mui/joy/DialogContent'
import CloseIcon from '@mui/icons-material/Close'
import ModalDialog from '@mui/joy/ModalDialog'
import { Typography } from '@mui/joy'

const EditThumbnailModal = ({ open, onClose, onSave, initialThumbnail }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  useEffect(() => {
    setThumbnailUrl('')
    if (initialThumbnail) {
      setThumbnailUrl(initialThumbnail)
    }
  }, [initialThumbnail])

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSave()
    }
  }
  const handleSave = () => {
    onSave(thumbnailUrl)
    onClose()
  }
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>
          {initialThumbnail ? 'Edit Thumbnail' : 'Add Thumbnail'}
          <IconButton
            aria-label='close'
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>Please insert an online URL.</Typography>
          <Input
            sx={{ marginTop: 2 }}
            autoFocus
            margin='dense'
            name='thumbnailURL'
            type='text'
            fullWidth
            variant='outlined'
            value={thumbnailUrl}
            onKeyPress={handleKeyPress}
            onChange={e => setThumbnailUrl(e.target.value)}
          />
        </DialogContent>
        <Button onClick={handleSave} sx={{ margin: 2 }}>
          Save
        </Button>
      </ModalDialog>
    </Modal>
  )
}

export default EditThumbnailModal
