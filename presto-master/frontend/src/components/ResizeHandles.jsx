import React from 'react'

const ResizeHandles = ({ elementType, index, handleResize }) => (
  <>
    <div
      style={{
        position: 'absolute',
        top: '-2px',
        left: '-2px',
        width: '15px',
        height: '15px',
        backgroundColor: 'wite',
        border: '1px solid black',
        cursor: 'nw-resize'
      }}
      onMouseDown={event => handleResize(event, elementType, index, 'top-left')}
    />
    <div
      style={{
        position: 'absolute',
        top: '-2px',
        right: '-2px',
        width: '15px',
        height: '15px',
        backgroundColor: 'white',
        border: '1px solid black',
        cursor: 'ne-resize'
      }}
      onMouseDown={event =>
        handleResize(event, elementType, index, 'top-right')
      }
    />
    <div
      style={{
        position: 'absolute',
        bottom: '-2px',
        left: '-2px',
        width: '15px',
        height: '15px',
        backgroundColor: 'white',
        border: '1px solid black',
        cursor: 'sw-resize'
      }}
      onMouseDown={event =>
        handleResize(event, elementType, index, 'bottom-left')
      }
    />
    <div
      style={{
        position: 'absolute',
        bottom: '-2px',
        right: '-2px',
        width: '15px',
        height: '15px',
        backgroundColor: 'white',
        border: '1px solid black',
        cursor: 'se-resize'
      }}
      onMouseDown={event =>
        handleResize(event, elementType, index, 'bottom-right')
      }
    />
  </>
)
export default ResizeHandles
