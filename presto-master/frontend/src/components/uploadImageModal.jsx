import React, { useEffect, useState } from 'react'
import Modal from '@mui/joy/Modal'
import Input from '@mui/joy/Input'
import Button from '@mui/joy/Button'
import DialogTitle from '@mui/joy/DialogTitle'
import DialogContent from '@mui/joy/DialogContent'
import IconButton from '@mui/joy/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Box, ModalDialog, Typography } from '@mui/joy'
import { usePresentation } from '../context/PresentationContext'
import axios from 'axios'

const UploadImageModal = ({ open, onClose, imageIndex }) => {
  const [imageSize, setImageSize] = useState(50)
  const [imageFile, setImageFile] = useState(null)
  const [imageName, setImageName] = useState('')
  const [imageDescription, setImageDescription] = useState('')
  const [imagePreview, setImagePreview] = useState(null)

  const { slideContent, setSlideContent, currentSlideId, presentation, token } =
    usePresentation()

  const [positionX, setPositionX] = useState(
    slideContent?.text?.[imageIndex]?.position?.x || 0
  )

  const [positionY, setPositionY] = useState(
    slideContent?.text?.[imageIndex]?.position?.y || 0
  )

  useEffect(() => {
    const imageItem = slideContent?.image?.[imageIndex]
    if (imageItem) {
      setImageSize(imageItem.imageSize || 50)
      setPositionX(imageItem.position?.x || 0)
      setPositionY(imageItem.position?.y || 0)
      setImageDescription(imageItem.description || '')
      setImagePreview(imageItem.src)
    } else {
      setImageSize(50)
      setPositionX(0)
      setPositionY(0)
      setImageDescription('')
      setImagePreview(null)
    }
  }, [currentSlideId, imageIndex, slideContent])

  const handleImageSizeChange = event => {
    const newImageSize = parseInt(event.target.value)
    setImageSize(Math.min(Math.max(newImageSize, 0), 100))
  }

  const handlePositionXChange = event => {
    const newX = Math.max(0, Math.min(100, parseInt(event.target.value, 10)))
    setPositionX(newX)
  }

  const handlePositionYChange = event => {
    const newY = Math.max(0, Math.min(100, parseInt(event.target.value, 10)))
    setPositionY(newY)
  }

  const handleImageUpload = event => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      setImageFile(reader.result)
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
    setImageName(file.name)
  }

  const handleSaveImage = async () => {
    try {
      setSlideContent(prevPresentation => {
        const updatedImage = [...(prevPresentation.image || [])]
        if (imageIndex !== undefined) {
          // Update existing image
          updatedImage[imageIndex] = {
            // Use the existing image if no new image is uploaded
            src: imageFile || imagePreview,
            imagesize: imageSize,
            name: imageName,
            position: { x: positionX, y: positionY },
            description: imageDescription,
            lastUpdated: Date.now()
          }
        } else {
          // Add new image
          if (imageFile || imagePreview) {
            updatedImage.push({
              src: imageFile || imagePreview,
              imagesize: imageSize,
              name: imageName,
              position: { x: positionX, y: positionY },
              description: imageDescription,
              lastUpdated: Date.now()
            })
          }
        }
        return {
          ...prevPresentation,
          image: updatedImage
        }
      })

      onClose()

      const storeResponse = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: token
        }
      })
      const currentStore = { ...storeResponse.data.store }
      const presentationIndex = currentStore.presentations.findIndex(
        p => p.id === presentation.id
      )

      if (presentationIndex !== -1) {
        const currentPresentation =
          currentStore.presentations[presentationIndex]
        const slideIndex = currentPresentation.slides.findIndex(
          slide => slide.id === currentSlideId
        )
        if (slideIndex !== -1) {
          const updatedImage = [
            ...(currentPresentation.slides[slideIndex].image || [])
          ]
          if (imageIndex !== undefined) {
            updatedImage[imageIndex] = {
              src: imageFile || imagePreview,
              imagesize: imageSize,
              name: imageName,
              position: { x: positionX, y: positionY },
              description: imageDescription,
              lastUpdated: Date.now()
            }
          } else {
            if (imageFile || imagePreview) {
              updatedImage.push({
                src: imageFile || imagePreview,
                imagesize: imageSize,
                name: imageName,
                position: { x: positionX, y: positionY },
                description: imageDescription,
                lastUpdated: Date.now()
              })
            }
          }
          currentPresentation.slides[slideIndex].image = updatedImage
        }

        const payload = { store: currentStore }
        await axios.put('http://localhost:5005/store', payload, {
          headers: {
            Authorization: token
          }
        })
      } else {
        console.error('Presentation not found.')
      }
    } catch (error) {
      console.error('Error saving image:', error)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>
          {imageIndex !== undefined ? 'Edit Image' : 'Add Image'}
          <IconButton
            aria-label='close'
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ margin: '4px 0px', color: 'white' }}>
            <Typography>Image Size (%) :</Typography>
            <Input
              margin='dense'
              label='Image Size (%)'
              type='number'
              sx={{ marginTop: '7px' }}
              fullWidth
              value={imageSize}
              onChange={handleImageSizeChange}
            />
          </Box>
          <Box sx={{ margin: '4px 0px', color: 'white' }}>
            <Typography>Image Upload :</Typography>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              style={{ marginTop: '7px' }}
            />
          </Box>
          {imagePreview && (
            <Box sx={{ margin: '4px 0px', color: 'white' }}>
              <Typography>Image Preview :</Typography>
              <img
                src={imagePreview}
                alt='Image Preview'
                style={{ maxWidth: '100%', marginTop: '7px' }}
              />
            </Box>
          )}
          <Box sx={{ margin: '4px 0px', color: 'white' }}>
            <Typography>Image Description :</Typography>
            <Input
              margin='dense'
              label='Image Description'
              type='text'
              sx={{ marginTop: '7px' }}
              fullWidth
              value={imageDescription}
              onChange={e => setImageDescription(e.target.value)}
            />
          </Box>
          {imageIndex !== undefined && (
            <>
              <Box sx={{ margin: '4px 0px', color: 'white' }}>
                <Typography>Position X (%) :</Typography>
                <Input
                  margin='dense'
                  label='Position X (%)'
                  type='number'
                  sx={{ marginTop: '7px' }}
                  fullWidth
                  value={positionX}
                  onChange={handlePositionXChange}
                />
              </Box>
              <Box sx={{ margin: '4px 0px', color: 'white' }}>
                <Typography>Position Y (%) :</Typography>
                <Input
                  margin='dense'
                  label='Position Y (%)'
                  type='number'
                  sx={{ marginTop: '7px' }}
                  fullWidth
                  value={positionY}
                  onChange={handlePositionYChange}
                />
              </Box>
            </>
          )}
        </DialogContent>
        <Button sx={{ width: '100%', marginTop: 1 }} onClick={handleSaveImage}>
          Save
        </Button>
      </ModalDialog>
    </Modal>
  )
}

export default UploadImageModal
