// import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import ButtonGroup from '@mui/joy/ButtonGroup'
import React, { useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import AddTextModal from './AddTextModal'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import CodeIcon from '@mui/icons-material/Code';
import UploadImageModal from './uploadImageModal'
import AddVideoModal from './AddVideoModal'
import AddCodeModal from './AddCodeModal'
function AddSlideContent () {
  const [showEditModal, setShowEditModal] = useState(false)
  const [uploadImageModal, setUploadImageModal] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showCodeModal, setShowCodeModal] = useState(false)

  const handleEditText = () => {
    setShowEditModal(true)
  }
  const handleuploadImage = () => {
    setUploadImageModal(true)
  }
  const handleAddVideo = () => {
    setShowVideoModal(true)
  }
  const handleAddCode = () => {
    setShowCodeModal(true)
  }

  return (
    <ButtonGroup size="lg" aria-label="add elements button group">
      <Button
        variant='outlined'
        color='neutral'
        endDecorator={<EditIcon />}
        sx={{
          width: '100%',
          height: '32px',
          cursor: 'pointer',
          margin: '10px 0px',
          justifyContent: 'space-between'
        }}
        onClick={handleEditText}
      >
        Add text
      </Button>
      <Button
        variant='outlined'
        color='neutral'
        endDecorator={<AddPhotoAlternateIcon />}
        sx={{
          width: '100%',
          height: '32px',
          cursor: 'pointer',
          margin: '10px 0px',
          justifyContent: 'space-between'
        }}
        onClick={handleuploadImage}
      >
        Add Image
      </Button>
      <Button
        variant='outlined'
        color='neutral'
        endDecorator={<VideoCallIcon />}
        sx={{
          width: '100%',
          height: '32px',
          cursor: 'pointer',
          margin: '10px 0px',
          justifyContent: 'space-between'
        }}
        onClick={handleAddVideo}
      >
        Add Video
      </Button>
      <Button
        variant='outlined'
        color='neutral'
        endDecorator={<CodeIcon />}
        sx={{
          width: '100%',
          height: '32px',
          cursor: 'pointer',
          margin: '10px 0px',
          justifyContent: 'space-between'
        }}
        onClick={handleAddCode}
      >
        Add Code
      </Button>

      <AddTextModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
      <UploadImageModal
        open={uploadImageModal}
        onClose={() => setUploadImageModal(false)}
      />
      <AddVideoModal
        open={showVideoModal}
        onClose={() => setShowVideoModal(false)}
      />
      <AddCodeModal
        open={showCodeModal}
        onClose={() => setShowCodeModal(false)}
      />
    </ButtonGroup>
  )
}

export default AddSlideContent
