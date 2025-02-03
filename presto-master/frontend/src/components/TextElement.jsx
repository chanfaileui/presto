import React from 'react'
import ResizeHandles from './ResizeHandles'
import { Box } from '@mui/joy'

export const TextElement = ({
  textItem,
  index,
  selectedElement,
  handleElementClick,
  handleRightClick,
  handleResize,
//   handleMove
}) => (
  <Box
    key={`text-${index}`}
    sx={{
      position: 'absolute',
      width: `${textItem.textAreaWidth}%`,
      height: `${textItem.textAreaHeight}%`,
      left: `${textItem.position.x}%`,
      top: `${textItem.position.y}%`,
      border: '1px solid #ccc',
      overflow: 'hidden',
      cursor: 'move',
      resize: 'both'
    }}
    onClick={event => handleElementClick(event, 'text', index)}
    onContextMenu={event => handleRightClick(event, 'text', index)}
    // onMouseDown={(event) => handleMove(event, 'text', index)}
  >
    <Box
      sx={{
        fontSize: `${textItem.size}em`,
        color: textItem.color,
        textAlign: 'left',
        fontFamily: textItem.fontFamily,
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      {textItem.text}
    </Box>
    {selectedElement?.type === 'text' && selectedElement?.index === index && (
      <ResizeHandles
        elementType='text'
        index={index}
        handleResize={handleResize}
      />
    )}
  </Box>
)
