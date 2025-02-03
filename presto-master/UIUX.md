- we made a consistent effort to ensure the high usability of the app
    - simple navigation by having a layout with a navigation component that’s visible at all times
    - highly responsiveness app layouts, can support as small as 400x700 screens and wide screens
    - user tasks can be completed efficiently (e.g. all buttons such as logout are clearly visible and marked on screen, no hidden or secret screens, users can logout whenever they want to)
- consistent design and branding by using the same layout and colours throughout the app
    - elements stay the same when navigating between pages, such as the Logo and the logout button, which helps users create a cohesive vision of the app
- we use a joyui’s colour palette with pre-defined primary and secondary colours
    - ensures colours are harmonious and are pleasing to the eye
    - ensure sufficient contrast between colours for accessibility
- use consistent fonts, inter, and import it at index, ensuring consistent font throughout
    
    ```jsx
    import '@fontsource/inter'
    ```
    
- implemented a grid system for dashboard to align presentations to the grid, improving the structural layout of your screens
- made use of visual hierarchy by manipulating size, colour, contrast, spacing, alignment, and repetition
    - use different button variants (neutral, outlined, filled etc.) to create contrast with other element
    
    ```jsx
    <Button
              color='neutral'
              variant='plain'
              onClick={() => navigate('/dashboard')}
            >
    ```
    
    - in modals, use bolded, larger text for headings and smaller, grey text for descriptions text to convey importance
    
    ```jsx
     <Typography id='delete-presentation-title' level='h2'>
                    Are you sure?
                  </Typography>
                  <Typography
                    id='delete-presentation-description'
                    textColor='text.tertiary'
                  >
                    This action cannot be undone. This will permanently delete your
                    presentation :&#40;
                  </Typography>
    ```
    
- we clearly indicate what elements are interactive (such as buttons and links), such as making a slide in the deck clickable with `cursor: 'pointer',`

```jsx
<AspectRatio
        data-testid='singleSlideDeck'
        ratio='4/3'
        sx={{
          width: '100%',
          margin: '0',
          cursor: 'pointer',
          border: isActive ? '2px solid' : 'none'
        }}
        onClick={onClick}
      >
```