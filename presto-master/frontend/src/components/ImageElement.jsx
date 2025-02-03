import React from 'react'

import ResizeHandles from './ResizeHandles'
import Box from '@mui/joy/Box'

export const ImageElement = ({
  imageItem,
  index,
  selectedElement,
  handleElementClick,
  handleRightClick,
  handleResize,
//   handleMove
}) => (
  <Box
    sx={{
      // maxWidth: `${imageItem.imagesize}%`,
      background: 'orange'
      // height: '100%'
    }}
  >
    <img
      key={`image-${index}`}
      onClick={event => handleElementClick(event, 'image', index)}
      src={imageItem.src}
      alt={imageItem.description}
      style={{
        position: 'absolute',
        maxWidth: `${imageItem.imagesize}%`,
        left: `${imageItem.position.x}%`,
        top: `${imageItem.position.y}%`
      }}
      onContextMenu={event => handleRightClick(event, 'image', index)}
    //   onMouseDown={(event) => handleMove(event, 'image', index)}
    />

    {selectedElement?.type === 'image' && selectedElement?.index === index && (
      <ResizeHandles
        elementType='image'
        index={index}
        handleResize={handleResize}
      />
    )}
  </Box>
)
