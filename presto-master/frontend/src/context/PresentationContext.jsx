import React, { createContext, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'

const PresentationContext = createContext()

export const usePresentation = () => useContext(PresentationContext)

export const PresentationProvider = ({ children }) => {
  const [presentation, setPresentation] = useState(null)
  const [presentationId, setPresentationId] = React.useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  const [thumbnail, setThumbnail] = useState('')
  const [token, setToken] = React.useState(null)
  const { id } = useParams()
  // const [modalText, setModalText] = useState('')
  // const [fontSize, setFontSize] = useState(20)
  // const [imageSize, setImageSize] = useState('')
  // const [imageFile, setImageFile] = useState(null)
  // const [imageDescription, setImageDescription] = useState('')
  const [currentSlideId, setCurrentSlideId] = useState('')
  // const [textColor, setTextColor] = useState('#A71414')
  // const [videoURL, setVideoURL] = useState('')
  // const [videoSize, setVideoSize] = useState(50) // Example default size in percentage
  // const [videoAutoplay, setVideoAutoplay] = useState(false)
  const [slideContent, setSlideContent] = useState({})

  return (
    <PresentationContext.Provider
      value={{
        // imageFile,
        // setImageFile,
        // imageDescription,
        // setImageDescription,
        token,
        presentationId,
        setPresentationId,
        setToken,
        // imageFile,
        // setImageFile,
        // imageDescription,
        // setImageDescription,
        thumbnail,
        setThumbnail,
        presentation,
        id,
        setPresentation,
        // setModalText,
        // modalText,
        // fontSize,
        // setFontSize,
        // textColor,
        // setTextColor,
        // imageSize,
        // setImageSize,
        // videoURL,
        // setVideoURL,
        // videoSize,
        // setVideoSize,
        // videoAutoplay,
        // setVideoAutoplay,
        currentSlide,
        setCurrentSlide,
        currentSlideId,
        setCurrentSlideId,
        slideContent,
        setSlideContent
        // setModalText,
        // modalText,
        // fontSize,
        // setFontSize,
        // textColor,
        // setTextColor,
        // imageSize,
        // setImageSize,
        // videoURL,
        // setVideoURL,
        // videoSize,
        // setVideoSize,
        // videoAutoplay,
        // setVideoAutoplay
      }}
    >
      {children}
    </PresentationContext.Provider>
  )
}
