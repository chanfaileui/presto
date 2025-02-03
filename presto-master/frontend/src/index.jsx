import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import '@fontsource/inter'
import { PresentationProvider } from './context/PresentationContext'

ReactDOM.render(
  <React.StrictMode>
    <PresentationProvider>
      <App />
    </PresentationProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
