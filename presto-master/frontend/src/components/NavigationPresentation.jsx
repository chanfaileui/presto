import React, { useEffect, useState } from 'react'
import Box from '@mui/joy/Box'
import Stack from '@mui/joy/Stack'
import AspectRatio from '@mui/joy/AspectRatio'
import IconButton from '@mui/joy/IconButton'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { usePresentation } from '../context/PresentationContext'

export default function NavigationPresentatio ({
  fetchSlideDeck,
  NewSlide,
  handlePrevSlide,
  handleNextSlide
}) {
  const {
    token,
    presentation,
    currentSlide,
    setCurrentSlide,

    setCurrentSlideId
  } = usePresentation()

  // SLIDE DECK THUMBNAIL
  const EmptySlide = ({ slideNo, isActive, onClick }) => {
    return (
      <AspectRatio
        data-testid='singleSlideDeck'
        ratio='4/3'
        sx={{
          width: '100%',
          margin: '0',
          cursor: 'pointer',
          border: isActive ? '2px solid' : 'none'
        }}
        onClick={onClick}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {slideNo}
        </Box>
      </AspectRatio>
    )
  }

  const [autoSlideId, setAutoSlideId] = useState('')

  useEffect(() => {
    if (autoSlideId === '') {
      setCurrentSlideId(presentation.slides[0]?.id)
    } else {
      setCurrentSlideId(autoSlideId)
    }
  }, [autoSlideId])

  return (
    <Box
      id='presentation-nav'
      sx={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <h1>Name: {presentation.name}</h1>
      <p>ID: {presentation.id}</p>
      <NewSlide token={token} onSlideAdded={fetchSlideDeck} />

      <Box
        padding='20px'
        sx={{
          height: {
            xs: '50vh',
            md: '70vh'
          },
          maxHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overflow: 'auto'
        }}
      >
        {presentation.slides.map((slide, index) => (
          <EmptySlide
            key={index}
            slideNo={index + 1}
            isActive={index === currentSlide}
            onClick={() => {
              setCurrentSlide(index)
              setAutoSlideId(slide.id)
            }}
          />
        ))}
      </Box>

      <Stack
        display='block'
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        spacing={1}
        sx={{ display: 'flex' }}
      >
        <IconButton
          size='large'
          variant='plain'
          color='neutral'
          sx={{
            alignSelf: 'center',
            padding: '0',
            visibility: currentSlide === 0 ? 'hidden' : 'visible'
          }}
          onClick={handlePrevSlide}
          aria-label='Prev slide'
        >
          <NavigateBeforeIcon sx={{ fontSize: 40 }} />
        </IconButton>
        <IconButton
          size='large'
          variant='plain'
          color='neutral'
          sx={{
            alignSelf: 'center',
            padding: '0',
            visibility:
              currentSlide === presentation.slides.length - 1
                ? 'hidden'
                : 'visible'
          }}
          onClick={handleNextSlide}
          aria-label='Next slide'
        >
          <NavigateNextIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Stack>
    </Box>
  )
}
