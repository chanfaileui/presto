import * as React from 'react'
import Snackbar from '@mui/joy/Snackbar'

import ReportIcon from '@mui/icons-material/Report'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import IconButton from '@mui/joy/IconButton'
import Typography from '@mui/joy/Typography'

export default function AlertPopup ({ message, errorPopup, setErrorPopup }) {
  return (
    <Snackbar
      variant='soft'
      color='danger'
      open={errorPopup}
      onClose={() => setErrorPopup(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      startDecorator={<ReportIcon />}
      endDecorator={
        <IconButton
          onClick={() => setErrorPopup(false)}
          variant='soft'
          color={'danger'}
        >
          <CloseRoundedIcon />
        </IconButton>
      }
    >
      <Typography level='body-sm' color={'danger'}>
        {message}
      </Typography>
    </Snackbar>
  )
}
