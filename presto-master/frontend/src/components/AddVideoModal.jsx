import React, { useEffect, useState } from 'react'
import Modal from '@mui/joy/Modal'
import Input from '@mui/joy/Input'
import Button from '@mui/joy/Button'
import Switch from '@mui/joy/Switch'
import DialogTitle from '@mui/joy/DialogTitle'
import DialogContent from '@mui/joy/DialogContent'
import IconButton from '@mui/joy/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Box, ModalDialog, Typography } from '@mui/joy'
import { usePresentation } from '../context/PresentationContext'
import axios from 'axios'

const AddVideoModal = ({ open, onClose, videoIndex }) => {
  const [videoSize, setVideoSize] = useState(50)
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const [videoURL, setVideoURL] = useState('')
  const [videoAutoplay, setVideoAutoplay] = useState(false)

  const { slideContent, setSlideContent, currentSlideId, presentation, token } =
    usePresentation()

  useEffect(() => {
    const videoItem = slideContent?.video?.[videoIndex]
    if (videoItem) {
      setVideoSize(videoItem.videoSize || 50)
      setPositionX(videoItem.position?.x || 0)
      setPositionY(videoItem.position?.y || 0)
      setVideoURL(videoItem.videoURL || '')
      setVideoAutoplay(videoItem.autoplay || false)
    } else {
      setVideoSize(50)
      setPositionX(0)
      setPositionY(0)
      setVideoURL('')
      setVideoAutoplay(false)
    }
  }, [currentSlideId, videoIndex, slideContent])

  const handleVideoSizeChange = event => {
    const newVideoSize = parseInt(event.target.value)
    setVideoSize(Math.min(Math.max(newVideoSize, 0), 100))
  }

  const handlePositionXChange = event => {
    const newX = Math.max(0, Math.min(100, parseInt(event.target.value, 10)))
    setPositionX(newX)
  }

  const handlePositionYChange = event => {
    const newY = Math.max(0, Math.min(100, parseInt(event.target.value, 10)))
    setPositionY(newY)
  }

  const handleVideoURLChange = event => {
    setVideoURL(event.target.value)
  }

  const handleVideoAutoplayChange = event => {
    setVideoAutoplay(event.target.checked)
  }

  const handleSaveVideo = async () => {
    try {
      setSlideContent(prevPresentation => {
        const updatedVideo = [...(prevPresentation.video || [])]
        if (videoIndex !== undefined) {
          // Update existing video
          updatedVideo[videoIndex] = {
            videoURL,
            videoSize,
            position: { x: positionX, y: positionY },
            autoplay: videoAutoplay,
            lastUpdated: Date.now()
          }
        } else {
          // Add new video
          updatedVideo.push({
            videoURL,
            videoSize,
            position: { x: positionX, y: positionY },
            autoplay: videoAutoplay,
            lastUpdated: Date.now()
          })
        }
        return {
          ...prevPresentation,
          video: updatedVideo
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
          const updatedVideo = [
            ...(currentPresentation.slides[slideIndex].video || [])
          ]
          if (videoIndex !== undefined) {
            // Update existing video
            updatedVideo[videoIndex] = {
              videoURL,
              videoSize,
              position: { x: positionX, y: positionY },
              autoplay: videoAutoplay,
              lastUpdated: Date.now()
            }
          } else {
            // Add new video
            updatedVideo.push({
              videoURL,
              videoSize,
              position: { x: positionX, y: positionY },
              autoplay: videoAutoplay,
              lastUpdated: Date.now()
            })
          }
          currentPresentation.slides[slideIndex].video = updatedVideo
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
      console.error('Error saving video:', error)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>
          {videoIndex !== undefined ? 'Edit Video' : 'Add Video'}
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
            <Typography>Video URL :</Typography>
            <Input
              margin='dense'
              label='Video URL'
              type='text'
              sx={{ marginTop: '7px' }}
              fullWidth
              value={videoURL}
              onChange={handleVideoURLChange}
            />
          </Box>
          <Box sx={{ margin: '4px 0px', color: 'white' }}>
            <Typography>Video size (%):</Typography>
            <Input
              margin='dense'
              type='number'
              label='Video Size (%)'
              value={videoSize}
              onChange={handleVideoSizeChange}
              fullWidth
              sx={{ marginTop: '7px' }}
            />
          </Box>
          <Box sx={{ margin: '4px 0px', color: 'white' }}>
            <Typography>Autoplay :</Typography>
            <Switch
              checked={videoAutoplay}
              onChange={handleVideoAutoplayChange}
              sx={{ marginTop: '7px' }}
            />
          </Box>
          {videoIndex !== undefined && (
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
        <Button onClick={handleSaveVideo} sx={{ width: '100%', marginY: 1 }}>
          Save
        </Button>
      </ModalDialog>
    </Modal>
  )
}

export default AddVideoModal
