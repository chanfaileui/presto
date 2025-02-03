import React from 'react'
import ResizeHandles from './ResizeHandles'
import Box from '@mui/joy/Box'
import SlideVideo from './SlideVideo'

export const VideoElement = ({
  videoItem,
  index,
  selectedElement,
  handleElementClick,
  handleRightClick,
  handleResize,
//   handleMove
}) => (
  <Box
    key={`video-${index}`}
    sx={{
      position: 'absolute',
      width: `${videoItem.videoSize}%`,
      height: `${videoItem.videoSize}%`,
      left: `${videoItem.position.x}%`,
      top: `${videoItem.position.y}%`,
      border: '15px solid transparent',
      '&:hover': {
        border: '15px solid black'
      }
    }}
    onClick={event => handleElementClick(event, 'video', index)}
    onContextMenu={event => handleRightClick(event, 'video', index)}
    // onMouseDown={(event) => handleMove(event, 'video', index)}
  >
    <SlideVideo
      videoURL={videoItem.videoURL}
      videoSize={videoItem.videoSize}
      videoAutoplay={videoItem.autoplay}
    />

    {selectedElement?.type === 'video' && selectedElement?.index === index && (
      <ResizeHandles
        elementType='video'
        index={index}
        handleResize={handleResize}
      />
    )}
  </Box>
)
