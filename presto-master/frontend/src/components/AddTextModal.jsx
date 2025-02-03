import React, { useEffect, useState } from 'react'
import Modal from '@mui/joy/Modal'
import Input from '@mui/joy/Input'
import Button from '@mui/joy/Button'
import DialogTitle from '@mui/joy/DialogTitle'
import DialogContent from '@mui/joy/DialogContent'
import IconButton from '@mui/joy/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import { Box, ModalDialog, Textarea } from '@mui/joy'
import { ChromePicker } from 'react-color'
import { usePresentation } from '../context/PresentationContext'
import Typography from '@mui/joy/Typography'

const AddTextModal = ({ open, onClose, textIndex }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false)
  const [textAreaWidth, settextAreaWidth] = useState(100)
  const [textAreaHeight, setTextAreaHeight] = useState(100)
  const [modalText, setModalText] = useState('')
  const [fontSize, setFontSize] = useState(30)
  const [textColor, setTextColor] = useState('#000000')
  const [fontFamily, setFontFamily] = useState('Arial')

  const { slideContent, setSlideContent, currentSlideId, presentation, token } =
    usePresentation()

  const [positionX, setPositionX] = useState(
    slideContent?.text?.[textIndex]?.position?.x || 0
  )

  const [positionY, setPositionY] = useState(
    slideContent?.text?.[textIndex]?.position?.y || 0
  )

  useEffect(() => {
    const textItem = slideContent?.text?.[textIndex]
    if (textItem) {
      setModalText(textItem.text || '')
      setFontSize(textItem.size || 30)
      setTextColor(textItem.color || '#000000')
      setFontFamily(textItem.fontFamily || 'Arial')
    } else {
      setModalText('')
      setFontSize(30)
      setTextColor('#000000')
      setFontFamily('Arial')
    }
  }, [currentSlideId, textIndex, slideContent])

  const handleColorClick = () => {
    setDisplayColorPicker(!displayColorPicker)
  }
  const handleColorChange = color => {
    setTextColor(color.hex)
  }

  const handlePositionXChange = event => {
    const newX = Math.max(0, Math.min(100, parseInt(event.target.value, 10)))
    setPositionX(newX)
  }

  const handlePositionYChange = event => {
    const newY = Math.max(0, Math.min(100, parseInt(event.target.value, 10)))
    setPositionY(newY)
  }

  const handleFontSizeChange = event => {
    const newFontSize = parseFloat(event.target.value)
    setFontSize(newFontSize)
  }

  const handleFontFamilyChange = event => {
    console.log('changed ', event.target.value)
    setFontFamily(event.target.value)
  }

  const handleSave = async () => {
    setSlideContent(prevPresentation => {
      const updatedText = [...(prevPresentation.text || [])]
      if (textIndex !== undefined) {
        // Update existing text
        updatedText[textIndex] = {
          text: modalText,
          size: fontSize,
          color: textColor,
          fontFamily,
          position: { x: positionX, y: positionY },
          textAreaHeight,
          textAreaWidth,
          lastUpdated: Date.now()
        }
      } else {
        // Add new text
        updatedText.push({
          text: modalText,
          size: fontSize,
          color: textColor,
          fontFamily,
          position: { x: positionX, y: positionY },
          textAreaHeight,
          textAreaWidth,
          lastUpdated: Date.now()
        })
      }
      return {
        ...prevPresentation,
        text: updatedText
      }
    })

    onClose()

    try {
      const response = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: token
        }
      })
      const currentStore = { ...response.data.store }
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
          const updatedText = [
            ...(currentPresentation.slides[slideIndex].text || [])
          ]
          if (textIndex !== undefined) {
            // Update existing text
            updatedText[textIndex] = {
              text: modalText,
              size: fontSize,
              fontFamily,
              color: textColor,
              position: { x: positionX, y: positionY },
              lastUpdated: Date.now()
            }
          } else {
            // Add new text
            updatedText.push({
              text: modalText,
              size: fontSize,
              fontFamily,
              color: textColor,
              position: { x: positionX, y: positionY },
              lastUpdated: Date.now()
            })
          }
          currentPresentation.slides[slideIndex].text = updatedText
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
      console.error('Error saving text:', error)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>
          {textIndex !== undefined ? 'Update Text' : 'Add Text'}
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
            <Typography>Text Area Size (%) :</Typography>
            <Input
              name='width'
              margin='dense'
              label='Width'
              type='number'
              onChange={e => settextAreaWidth(e.target.value)}
              sx={{ marginTop: '7px', marginRight: '8px' }}
              value={textAreaWidth}
              // onChange={handleTextAreaWidth}
            />
            <Input
              name='height'
              margin='dense'
              label='Height'
              type='number'
              onChange={e => setTextAreaHeight(e.target.value)}
              sx={{ marginTop: '7px' }}
              value={textAreaHeight}
              // onChange={handleTextAreaHeight}
            />
          </Box>
          <Box sx={{ margin: '4px 0px', color: 'white' }}>
            <Typography>Text :</Typography>
            <Textarea
              value={modalText}
              onChange={e => setModalText(e.target.value)}
              sx={{
                width: '100%',
                height: '100px',
                marginTop: '7px',
                resize: 'none'
              }}
            />
          </Box>
          <Box sx={{ margin: '4px 0px', color: 'white' }}>
            <Typography>Font Family :</Typography>
            <select
              value={fontFamily}
              onChange={handleFontFamilyChange}
              style={{ marginTop: '7px' }}
            >
              <option value='Arial'>Arial</option>
              <option value='Helvetica'>Helvetica</option>
              <option value='Times New Roman'>Times New Roman</option>
              <option value='Courier New'>Courier New</option>
            </select>
          </Box>
          <Box sx={{ margin: '4px 0px', color: 'white' }}>
            <Typography>Font Size (em) :</Typography>
            <Input
              margin='dense'
              label='Font Size (em)'
              type='number'
              sx={{ marginTop: '7px' }}
              fullWidth
              value={fontSize}
              onChange={handleFontSizeChange}
            />
          </Box>
          <Box sx={{ margin: '4px 0px', color: 'white' }}>
            <Typography>Text Color (Hex)</Typography>
            <div onClick={handleColorClick} style={{ cursor: 'pointer' }}>
              <div
                style={{
                  width: '100%',
                  height: '25px',
                  borderRadius: '2px',
                  textAlign: 'center',
                  marginTop: '7px',
                  backgroundColor: textColor
                }}
              >
                {textColor}
              </div>
            </div>
            {displayColorPicker && (
              <div style={{ position: 'absolute', zIndex: '2' }}>
                <ChromePicker color={textColor} onChange={handleColorChange} />
              </div>
            )}
          </Box>
          {textIndex !== undefined && (
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
        <Button sx={{ width: '100%', marginTop: 1 }} onClick={handleSave}>
          Save
        </Button>
      </ModalDialog>
    </Modal>
  )
}

export default AddTextModal
