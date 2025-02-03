import * as React from 'react';

import Button from '@mui/joy/Button';
import Add from '@mui/icons-material/Add';

import { getStore, putStore } from '../helpers/Api';
import { usePresentation } from '../context/PresentationContext';

export default function NewSlide ({ token, onSlideAdded }) {
  const { presentationId } = usePresentation();

  /**
   * Add new presentation to database
   * @param {*} e
   */
  const storeSlide = async (e) => {
    e.preventDefault();
    try {
      const response = await getStore(token);
      console.log('store get res', response);
      const currentStore = { ...response };
      const found = currentStore.presentations.find(
        (p) => String(p.id) === String(presentationId)
      );
      console.log('found?', found);
      if (found) {
        const newSlide = {
          id: Math.floor(Math.random() * Date.now()) % 90000
        };
        found.slides.push(newSlide);
        const payload = { store: currentStore };
        await putStore(token, payload);
        onSlideAdded();
      } else {
        throw new Error('Presentation not found.');
      }
    } catch (err) {
      alert(`Error creating slide: ${err.message}`);
    }
  };

  return (
    <React.Fragment>
      <Button
        variant='outlined'
        color='neutral'
        startDecorator={<Add />}
        onClick={storeSlide}
      >
        New slide
      </Button>
    </React.Fragment>
  );
}
