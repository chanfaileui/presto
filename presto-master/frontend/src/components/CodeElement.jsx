import React from 'react'
import ResizeHandles from './ResizeHandles'
import Box from '@mui/joy/Box'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'

export const CodeElement = ({
  codeItem,
  index,
  selectedElement,
  handleElementClick,
  handleRightClick,
  handleResize,
//   handleMove
}) => (
    <Box
    key={`code-${index}`}
    style={{
      position: 'absolute',
      width: `${codeItem.codeSize}%`,
      left: `${codeItem.position.x}%`,
      top: `${codeItem.position.y}%`,
      border: '1px solid #ccc',
      overflow: 'hidden'
    }}
    onContextMenu={event => handleRightClick(event, 'code', index)}
  >
    <SyntaxHighlighter
      language={codeItem.language}
      style={docco}
      customStyle={{
        fontSize: `${codeItem.fontSize}em`,
        backgroundColor: 'transparent',
        padding: '10px',
        margin: 0,
        whiteSpace: 'pre-wrap'
      }}
      onClick={event => handleElementClick(event, 'code', index)}
    //   onMouseDown={(event) => handleMove(event, 'code', index)}
    >
      {codeItem.code}
    </SyntaxHighlighter>

    {selectedElement?.type === 'code' && selectedElement?.index === index && (
      <ResizeHandles
        elementType='code'
        index={index}
        handleResize={handleResize}
      />
    )}
  </Box>
)
