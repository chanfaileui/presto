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
import hljs from 'highlight.js'

const AddCodeModal = ({ open, onClose, codeIndex }) => {
  const [codeSize, setCodeSize] = useState(50)
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const [code, setCode] = useState('')
  const [fontSize, setFontSize] = useState(1)
  const [language, setLanguage] = useState('')
  const [detectedLanguage, setDetectedLanguage] = useState(null)

  const { slideContent, setSlideContent, currentSlideId, presentation, token } =
    usePresentation()

  useEffect(() => {
    const codeItem = slideContent?.code?.[codeIndex]
    if (codeItem) {
      setCodeSize(codeItem.codeSize || 50)
      setPositionX(codeItem.position?.x || 0)
      setPositionY(codeItem.position?.y || 0)
      setCode(codeItem.code || '')
      setFontSize(codeItem.fontSize || 1)
      setLanguage(codeItem.language || '')
    } else {
      setCodeSize(50)
      setPositionX(0)
      setPositionY(0)
      setCode('')
      setFontSize(1)
      setLanguage('')
    }
  }, [currentSlideId, codeIndex, slideContent])

  const handleCodeSizeChange = event => {
    const newCodeSize = parseInt(event.target.value)
    setCodeSize(Math.min(Math.max(newCodeSize, 0), 100))
  }

  const handlePositionXChange = event => {
    const newX = Math.max(0, Math.min(100, parseInt(event.target.value, 10)))
    setPositionX(newX)
  }

  const handlePositionYChange = event => {
    const newY = Math.max(0, Math.min(100, parseInt(event.target.value, 10)))
    setPositionY(newY)
  }
  const handleCodeChange = event => {
    const newCode = event.target.value
    setCode(newCode)
    // autodetect language
    const result = hljs.highlightAuto(code, ['c', 'javascript', 'python']);
    setDetectedLanguage(result.language);
  }
  // user selection will override detect
  const languageForHighlighter = language || detectedLanguage

  const handleFontSizeChange = event => {
    const newFontSize = parseFloat(event.target.value)
    setFontSize(newFontSize)
  }

  const handleLanguageChange = event => {
    setLanguage(event.target.value)
  }

  const handleSaveCode = async () => {
    try {
      setSlideContent(prevPresentation => {
        const updatedCode = [...(prevPresentation.code || [])]
        if (codeIndex !== undefined) {
          // Update existing code block
          updatedCode[codeIndex] = {
            code,
            codeSize,
            position: { x: positionX, y: positionY },
            fontSize,
            language: languageForHighlighter,
            lastUpdated: Date.now()
          }
        } else {
          // Add new code block
          updatedCode.push({
            code,
            codeSize,
            position: { x: positionX, y: positionY },
            fontSize,
            language: languageForHighlighter,
            lastUpdated: Date.now()
          })
        }
        return {
          ...prevPresentation,
          code: updatedCode
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
          const updatedCode = [
            ...(currentPresentation.slides[slideIndex].code || [])
          ]
          if (codeIndex !== undefined) {
            // Update existing code block
            updatedCode[codeIndex] = {
              code,
              codeSize,
              position: { x: positionX, y: positionY },
              fontSize,
              language: languageForHighlighter,
              lastUpdated: Date.now()
            }
          } else {
            // Add new code block
            updatedCode.push({
              code,
              codeSize,
              position: { x: positionX, y: positionY },
              fontSize,
              language: languageForHighlighter,
              lastUpdated: Date.now()
            })
          }
          currentPresentation.slides[slideIndex].code = updatedCode
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
      console.error('Error saving code:', error)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>
          {codeIndex !== undefined ? 'Edit Code Block' : 'Add Code Block'}
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
            <Typography>Code :</Typography>
            <textarea
              value={code}
              onChange={handleCodeChange}
              style={{
                width: '100%',
                height: '200px',
                marginTop: '7px',
                fontFamily: 'monospace',
                fontSize: `${fontSize}em`,
                whiteSpace: 'pre'
              }}
            />
          </Box>
          <Box sx={{ margin: '4px 0px', color: 'white' }}>
            <Typography>Code Size (%) :</Typography>
            <Input
              margin='dense'
              label='Code Size (%)'
              type='number'
              sx={{ marginTop: '7px' }}
              fullWidth
              value={codeSize}
              onChange={handleCodeSizeChange}
            />
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

          {codeIndex !== undefined && (
            <>
              <Box sx={{ margin: '4px 0px', color: 'white' }}>
                <Typography>Language :</Typography>
                <select
                  value={languageForHighlighter}
                  onChange={handleLanguageChange}
                  style={{ marginTop: '7px' }}
                >
                  <option value='javascript'>JavaScript</option>
                  <option value='python'>Python</option>
                  <option value='c'>C</option>
                </select>
              </Box>
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
        <Button sx={{ width: '100%', marginTop: 1 }} onClick={handleSaveCode}>
          Save
        </Button>
      </ModalDialog>
    </Modal>
  )
}

export default AddCodeModal
