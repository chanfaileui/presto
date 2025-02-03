/* eslint-disable multiline-ternary */
import React from 'react'
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useColorScheme } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Tooltip from '@mui/joy/Tooltip';
import Drawer from '@mui/joy/Drawer';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';

import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

import NewPresentation from './NewPresentation';
import myLogo from '../assets/uwu.jpeg';
import LogoutButton from './LogoutButton';
import DeletePresentation from '../components/DeletePresentation';

import Navigation from './Navigation';
// import { usePresentation } from '../context/PresentationContext';
// import { getPresentation } from '../helpers/Api';

/**
 * Light/dark mode
 * @returns
 */
const ColorSchemeToggle = () => {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <IconButton size='sm' variant='outlined' color='primary' />;
  }
  return (
    <Tooltip title='Change theme' variant='outlined'>
      <IconButton
        id='toggle-mode'
        size='sm'
        variant='plain'
        color='neutral'
        sx={{ alignSelf: 'center' }}
        onClick={() => {
          if (mode === 'light') {
            setMode('dark');
          } else {
            setMode('light');
          }
        }}
      >
        {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  );
};

const StyledLogo = styled.img`
  width: 30px;
  height: auto;
`;

export default function Header ({
  token,
  setTokenFunction,
  headerContent,
  onPresentationAdded
}) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const { id } = useParams();

  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'space-between'
      }}
    >
      {/* MENU BAR */}
      <Stack
        id='desktop-dashboard-stack'
        direction='row'
        justifyContent='center'
        alignItems='center'
        spacing={1}
        sx={{ display: { xs: 'none', sm: 'flex' } }}
      >
        {/* ICON */}
        <IconButton
          size='md'
          variant='plain'
          color='neutral'
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            width: 2,
            height: 'auto'
          }}
          onClick={() => navigate('/dashboard')}
        >
          <StyledLogo src={myLogo} alt='My Logo' />
        </IconButton>
        {headerContent === 'dashboard' ? (
          <>
            <NewPresentation
              token={token}
              onPresentationAdded={onPresentationAdded}
            />
          </>
        ) : headerContent === 'presentation' ? (
          <>
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
          </>
        ) : null}
      </Stack>

      {/* MOBILE MENU ICON */}
      <Box sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
        <IconButton
          variant='plain'
          color='neutral'
          onClick={() => setOpen(true)}
        >
          <MenuRoundedIcon />
        </IconButton>
        <Drawer
          sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
          open={open}
          onClose={() => setOpen(false)}
        >
          <ModalClose />
          <DialogTitle>I&apos;M JUST A GIRL TT</DialogTitle>
          <Box sx={{ px: 1 }}>
            <Navigation />
          </Box>
        </Drawer>
      </Box>
      <Stack
        id='logout-header'
        direction='row'
        justifyContent='center'
        alignItems='center'
        spacing={1}
        sx={{ display: { xs: 'none', sm: 'flex' } }}
      >
        <LogoutButton
          token={token}
          setTokenFunction={setTokenFunction}
        />
        {/* DARK MODE */}
        <ColorSchemeToggle />
      </Stack>
    </Box>
  );
}
