import * as React from 'react';
import axios from 'axios';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material/Add';

export default function NewPresentation ({ token, onPresentationAdded }) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');

  const initialStore = {
    presentations: []
  };

  /**
   * Add new presentation to database
   * @param {*} e
   */
  const storePresentation = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      let currentStore = { ...response.data.store };
      if (Object.keys(currentStore).length === 0) {
        currentStore = initialStore;
      }

      const newSlide = {
        id: Math.floor(Math.random() * Date.now()) % 90000
      };

      const newPresentation = {
        id: Math.floor(Math.random() * Date.now()) % 90000,
        name,
        description: '',
        thumbnail: '',
        slides: [newSlide]
      };
      currentStore.presentations.push(newPresentation);
      const payload = { store: currentStore };
      console.log('storing', payload);

      await axios.put('http://localhost:5005/store', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onPresentationAdded();
      setName('');
      setOpen(false);
    } catch (err) {
      alert(`Error creating presentation: ${err.message}`);
    }
  };

  return (
    <React.Fragment>
      <Button
        variant='outlined'
        color='neutral'
        startDecorator={<Add />}
        onClick={() => setOpen(true)}
      >
        New presentation
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Create new presentation</DialogTitle>
          <DialogContent>Fill in the information of the project.</DialogContent>
          <form onSubmit={storePresentation}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  autoFocus
                  required
                  name="presentationName"
                  value={name}
                  onInput={(e) => setName(e.target.value)}
                />
              </FormControl>
              <Button type='submit'>Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
