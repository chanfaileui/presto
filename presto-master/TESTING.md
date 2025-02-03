**instructions**
Please run <npm run reset> in the /backend folder to reset database.
Then, start the server by running <npm start> in both /backend and /frontend.
Run <npm run test> (or <npx cypress open>) to open cypress.

**component testing**

Using cypress, wrote tests for register, checking for both valid and invalid inputs.
Chose not to test for header/navbar because of the complexity to do so, depend heavily on external libraries and parent components for their data and state. Unit testing them in isolation will require extensive mocking and stubbing.
Additionally, presentation navbar functionality (moving between slides) is adequately tested in ui testing.

**ui testing**

<other_path.cy.js>
1. Using mobile viewport, testing mobile responsiveness
2. (setting up) register account
3. create multiple presentations
4. Add and delete slides
5. Add elements to the remaining slide
6. Deleting last slide to delete presentation
7. Delete all presentations

**Rationale**: 

We wanted to test the mobile layout of the app as well, as some components (such as the header) is rendered differently based on the display size of the screen. The happy path only tested one presentation, so in this path, we made sure the user could create multiple presentations. We also tested all remaining functionality that wasn’t tested in happy_path, such as creating and navigating between multiple presentations, deleting slides and adding elements to slides.

**Other comments:**

Due to the simplicity of the app, many selectors are coupled to text content versus using `data-*` attributes. If the app continues to grow in scale, testing should be refactored to use data attributes. 
