import React, { useState } from 'react'
import Modal from '@mui/joy/Modal'
import Input from '@mui/joy/Input'
import Button from '@mui/joy/Button'
import DialogTitle from '@mui/joy/DialogTitle'
import DialogContent from '@mui/joy/DialogContent'
import IconButton from '@mui/joy/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { ModalDialog } from '@mui/joy'

const EditModal = ({ open, onClose, onSave, initialTitle }) => {
  const [title, setTitle] = useState('')

  const handleTitleChange = e => {
    setTitle(e.target.value)
  }
  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSave()
    }
  }
  const handleSave = () => {
    onSave(title)
    setTitle('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>
          Edit Presentation Name
          <IconButton
            aria-label='close'
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Input
            sx={{ marginTop: 2 }}
            autoFocus
            margin='dense'
            name='presentationName'
            type='text'
            fullWidth
            variant='outlined'
            value={title || initialTitle}
            onChange={handleTitleChange}
            onKeyPress={handleKeyPress}
          />
        </DialogContent>
        <Button onClick={handleSave} sx={{ margin: 2 }}>
          Save
        </Button>
      </ModalDialog>
    </Modal>
  )
}

export default EditModal
