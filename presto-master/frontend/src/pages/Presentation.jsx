import React, { useEffect, useState } from 'react'
import { CssVarsProvider } from '@mui/joy/styles'
import { useParams, useNavigate } from 'react-router-dom'
import { getPresentation } from '../helpers/Api'
import { usePresentation } from '../context/PresentationContext'

import NavigationPresentation from '../components/NavigationPresentation'
import HeaderPresentation from '../components/HeaderPresentation'
import DeletePresentation from '../components/DeletePresentation'
import UploadImageModal from '../components/uploadImageModal'
import AddVideoModal from '../components/AddVideoModal'
import AddSlideContent from '../components/AddSlideContent'
import LogoutButton from '../components/LogoutButton'
import AddTextModal from '../components/AddTextModal'
import AddCodeModal from '../components/AddCodeModal'
import DeleteSlide from '../components/DeleteSlide'
import CssBaseline from '@mui/joy/CssBaseline'
import NewSlide from '../components/NewSlide'
import Layout from '../components/Layout'
import Button from '@mui/joy/Button'
import Stack from '@mui/joy/Stack'
import Box from '@mui/joy/Box'
import axios from 'axios'
import { CodeElement } from '../components/CodeElement'
import { TextElement } from '../components/TextElement'
import { ImageElement } from '../components/ImageElement'
import { VideoElement } from '../components/VideoElement'

import { motion, AnimatePresence } from 'framer-motion';

export default function Presentation ({ token, setTokenFunction }) {
  const navigate = useNavigate()
  const { id } = useParams()

  const [showEditModal, setShowEditModal] = useState(false)
  const [uploadImageModal, setUploadImageModal] = useState(false)
  const [uploadVideoModal, setUploadVideoModal] = useState(false)
  const [addCodeModal, setAddCodeModal] = useState(false)

  const [seletedElementIndex, setSeletedElementIndex] = useState(null)
  const [selectedElement, setSelectedElement] = useState(null)

  const {
    setPresentationId,
    presentation,
    setPresentation,
    currentSlide,
    presentationId,
    slideContent,
    setSlideContent,
    currentSlideId,
    setCurrentSlide
  } = usePresentation()

  useEffect(() => {
    if (token) {
      setPresentationId(id)
      fetchPresentation()
      setCurrentSlide(0)
    }
  }, [id, token])

  useEffect(() => {
    if (token) {
      renderCurrentSlide()
    }
  }, [currentSlide])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })
  const handleKeyDown = event => {
    if (event.key === 'ArrowLeft') {
      handlePrevSlide()
    } else if (event.key === 'ArrowRight') {
      handleNextSlide()
    }
  }

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }
  const handleNextSlide = () => {
    if (currentSlide < presentation.slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const renderCurrentSlide = () => {
    if (presentation && presentation.slides) {
      console.log(`rendering current slide ${currentSlide}`)
      const slide = presentation.slides[currentSlide]
      setSlideContent(slide)
    }
  }

  const fetchPresentation = async () => {
    try {
      const data = await getPresentation(token, id)
      setPresentation(data)
      renderCurrentSlide()
    } catch (err) {
      console.error('Failed to fetch presentation', err)
    }
  }

  const renderContent = () => {
    const sortedContent = []
    if (!slideContent) {
      return
    }

    if (slideContent.text) {
      slideContent.text.forEach((textItem, index) => {
        sortedContent.push({
          type: 'text',
          lastUpdated: textItem.lastUpdated,
          jsx: (<TextElement
            textItem={textItem}
            index={index}
            selectedElement={selectedElement}
            handleElementClick={handleElementClick}
            handleRightClick={handleRightClick}
            handleResize={handleResize}
          />
          )
        })
      })
    }

    if (slideContent.image) {
      slideContent.image.forEach((imageItem, index) => {
        console.log('img index', index)
        sortedContent.push({
          type: 'image',
          lastUpdated: imageItem.lastUpdated,
          jsx: (<ImageElement
            imageItem={imageItem}
            index={index}
            selectedElement={selectedElement}
            handleElementClick={handleElementClick}
            handleRightClick={handleRightClick}
            handleResize={handleResize}
          />
          )
        })
      })
    }

    if (slideContent.video) {
      slideContent.video.forEach((videoItem, index) => {
        sortedContent.push({
          type: 'video',
          lastUpdated: videoItem.lastUpdated,
          jsx: (<VideoElement
            videoItem={videoItem}
            index={index}
            selectedElement={selectedElement}
            handleElementClick={handleElementClick}
            handleRightClick={handleRightClick}
            handleResize={handleResize}
          />
          )
        })
      })
    }

    if (slideContent.code) {
      slideContent.code.forEach((codeItem, index) => {
        sortedContent.push({
          type: 'code',
          lastUpdated: codeItem.lastUpdated,
          jsx: (
            <CodeElement
            codeItem={codeItem}
            index={index}
            selectedElement={selectedElement}
            handleElementClick={handleElementClick}
            handleRightClick={handleRightClick}
            handleResize={handleResize}
          />
          )
        })
      })
    }
    sortedContent.sort((a, b) => a.lastUpdated - b.lastUpdated)
    return sortedContent.map(item => item.jsx)
  }

  // handle click events
  const handleElementClick = (event, elementType, index) => {
    if (event.detail === 1) {
      setSelectedElement({ type: elementType, index })
    } else if (event.detail === 2) {
      setSelectedElement(null)
      setSeletedElementIndex(index)
      if (elementType === 'text') {
        setShowEditModal(true)
      } else if (elementType === 'image') {
        setUploadImageModal(true)
      } else if (elementType === 'video') {
        setUploadVideoModal(true)
      } else if (elementType === 'code') {
        setAddCodeModal(true)
      }
    }
  }

  const handleRightClick = async (event, elementType, index) => {
    event.preventDefault()

    setSlideContent(prevContent => {
      const updated = prevContent[elementType].filter((_, i) => i !== index)
      return {
        ...prevContent,
        [elementType]: updated
      }
    })

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
        currentPresentation.slides.forEach(slide => {
          if (slide.id === currentSlideId) {
            slide[elementType] = slide[elementType].filter(
              (_, i) => i !== index
            )
          }
        })
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

  const handleResize = (event, elementType, index, corner) => {
    event.preventDefault()

    const initialX = event.clientX
    const initialY = event.clientY
    const initialWidth = event.target.parentElement.offsetWidth
    const initialHeight = event.target.parentElement.offsetHeight
    const initialLeft = event.target.parentElement.offsetLeft
    const initialTop = event.target.parentElement.offsetTop

    const handleMouseMove = moveEvent => {
      const deltaX = moveEvent.clientX - initialX
      const deltaY = moveEvent.clientY - initialY

      let newWidth = initialWidth
      let newHeight = initialHeight
      let newLeft = initialLeft
      let newTop = initialTop

      if (corner === 'top-left') {
        newWidth = initialWidth - deltaX
        newHeight = initialHeight - deltaY
        newLeft = initialLeft + deltaX
        newTop = initialTop + deltaY
      } else if (corner === 'top-right') {
        newWidth = initialWidth + deltaX
        newHeight = initialHeight - deltaY
        newTop = initialTop + deltaY
      } else if (corner === 'bottom-left') {
        newWidth = initialWidth - deltaX
        newHeight = initialHeight + deltaY
        newLeft = initialLeft + deltaX
      } else if (corner === 'bottom-right') {
        newWidth = initialWidth + deltaX
        newHeight = initialHeight + deltaY
      }

      // Maintain aspect ratio
      const aspectRatio = initialWidth / initialHeight
      if (newWidth / newHeight > aspectRatio) {
        newHeight = newWidth / aspectRatio
      } else {
        newWidth = newHeight * aspectRatio
      }

      // Prevent extending beyond slide edges
      if (newLeft < 0) {
        newWidth += newLeft
        newLeft = 0
      }
      if (newTop < 0) {
        newHeight += newTop
        newTop = 0
      }
      if (
        newLeft + newWidth >
        event.target.parentElement.parentElement.offsetWidth
      ) {
        newWidth =
          event.target.parentElement.parentElement.offsetWidth - newLeft
      }
      if (
        newTop + newHeight >
        event.target.parentElement.parentElement.offsetHeight
      ) {
        newHeight =
          event.target.parentElement.parentElement.offsetHeight - newTop
      }

      setSlideContent(prevContent => {
        const updatedElement = [...prevContent[elementType]]
        updatedElement[index] = {
          ...updatedElement[index],
          textAreaWidth:
            (newWidth / event.target.parentElement.parentElement.offsetWidth) *
            100,
          textAreaHeight:
            (newHeight /
              event.target.parentElement.parentElement.offsetHeight) *
            100,
          position: {
            x:
              (newLeft / event.target.parentElement.parentElement.offsetWidth) *
              100,
            y:
              (newTop / event.target.parentElement.parentElement.offsetHeight) *
              100
          }
        }
        return {
          ...prevContent,
          [elementType]: updatedElement
        }
      })
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  useEffect(async () => {
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
      setPresentation(currentStore.presentations[presentationIndex])
      if (presentation && presentation.slides) {
        presentation.slides.forEach(slide => {
          if (slide.id === currentSlideId) {
            setSlideContent(slide)
          }
        })
      }
    } catch (error) {
      console.log('Error fetching store:', error)
    }
  }, [currentSlideId, presentationId])

  if (!presentation) {
    return <Box>Loading...</Box>
  }
  const fetchSlideDeck = () => {
    fetchPresentation()
  }

  const handleDeleteSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
    fetchSlideDeck()
  }

  return (
    <CssVarsProvider>
      <CssBaseline />

      {/* BOTTOM MOBILE STACK */}
      <Stack
        id='tab-bar'
        direction='row'
        justifyContent='space-around'
        spacing={1}
        sx={{
          display: { xs: 'flex', sm: 'none' },
          justifyContent: 'space-between',
          padding: '20px',
          zIndex: '999',
          bottom: 0,
          position: 'fixed',
          width: '100dvw',
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Button
          color='neutral'
          variant='plain'
          onClick={() => navigate('/dashboard')}
        >
          ← Back
        </Button>
        <DeletePresentation
          token={token}
          presentationId={id}
        ></DeletePresentation>
        <LogoutButton token={token} setTokenFunction={setTokenFunction} />
      </Stack>

      <Layout.Root>
        <Layout.Header>
          <HeaderPresentation
            token={token}
            setTokenFunction={setTokenFunction}
            fetchSlideDeck={fetchSlideDeck}
            NewSlide={NewSlide}
          />
        </Layout.Header>

        <Layout.SideNav>
          <NavigationPresentation
            fetchSlideDeck={fetchSlideDeck}
            NewSlide={NewSlide}
            handlePrevSlide={handlePrevSlide}
            handleNextSlide={handleNextSlide}
          />
        </Layout.SideNav>

        <Layout.Main>
          <Box align='right' marginBottom='30px'>
            <DeleteSlide
              token={token}
              presentationId={id}
              slideId={currentSlide}
              onSlideDeleted={handleDeleteSlide}
            />
          </Box>
          <Box
            maxWidth={{
              xs: '90%',
              sm: '70%',
              lg: '60%'
            }}
            sx={{
              margin: 'auto'
            }}
          >
            <Box
              maxHeight='60%'
              maxWidth='100%'
              sx={{
                aspectRatio: '4/3',
                bgcolor: 'background.surface',
                margin: 'auto',
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ width: '100%', height: '100%' }}>
                <AnimatePresence>
                  {presentation && presentation.slides && (
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 300 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -300 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderContent()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '1em',
                  color: 'text.primary'
                }}
              >
                {currentSlide + 1}
              </Box>

              <AddTextModal
                open={showEditModal}
                onClose={() => setShowEditModal(false)}
                textIndex={seletedElementIndex}
              />
              <UploadImageModal
                open={uploadImageModal}
                onClose={() => setUploadImageModal(false)}
                imageIndex={seletedElementIndex}
              />
              <AddVideoModal
                open={uploadVideoModal}
                onClose={() => setUploadVideoModal(false)}
                videoIndex={seletedElementIndex}
              />
              <AddCodeModal
                open={addCodeModal}
                onClose={() => {
                  setAddCodeModal(false)
                  setSeletedElementIndex(null)
                }}
                codeIndex={seletedElementIndex}
              />
            </Box>

            <AddSlideContent />
          </Box>
        </Layout.Main>
      </Layout.Root>
    </CssVarsProvider>
  )
}
