# Quickstart: Using Local Resources

This guide walks through the end-to-end process of using the new resource management feature to create a webpage.

## 1. Upload Files

- **Action**: Navigate to the application's home screen.
- **Observe**: A new file management panel is visible.
- **Action**: Click the "Upload Files" button and select an image (e.g., `cat.jpg`) and a text file (e.g., `about.txt`).
- **Observe**: The files `cat.jpg` and `about.txt` appear in the "Recursos" tab, and their checkboxes are ticked.

## 2. Generate the Webpage

- **Action**: In the prompt input field, type: "Create a simple portfolio page for me. Use the uploaded picture of my cat as the main image and the text from the document for the 'About Me' section."
- **Action**: Click the generate button.
- **Observe**: The application switches to the Editor view. The iframe shows a webpage containing the image of the cat and the text from `about.txt`.

## 3. Modify and Save

- **Action**: In the chat panel, type: "Make the background color a light grey."
- **Observe**: The iframe preview updates to show the new background color.
- **Action**: Click the "Save" button.
- **Observe**: A confirmation dialog appears: "Se guardará una copia optimizada de las imágenes utilizadas en el diseño y se eliminarán todos los archivos subidos. ¿Quieres continuar?"
- **Action**: Click "Continue".
- **Observe**: A notification "Optimizando imágenes" appears briefly.

## 4. Verify the Output

- **Action**: Check the `creations` directory in the project.
- **Observe**: The following files are present:
  - `web.html` (or the user-specified filename).
  - `images/cat.jpg` (the optimized version).
- **Action**: Open `web.html` in a browser.
- **Observe**: The page renders correctly, and the image path in the HTML source is `./images/cat.jpg`.
- **Action**: Check the `resources` directory.
- **Observe**: The directory is empty.
