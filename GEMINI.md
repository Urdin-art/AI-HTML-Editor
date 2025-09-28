# Project: AI Web Creator

## Project Overview

This is a web-based AI-powered website creator. It provides a user-friendly interface to generate and modify a complete, single-file HTML webpage through a conversational chat interface. The application is built with React and TypeScript, using Vite as a build tool. It leverages the Google Gemini API for code generation and modification tasks.

The core user experience revolves around two main screens:
1.  **Home Screen**: Allows the user to start a new project either by writing a descriptive prompt or by providing a URL to an existing webpage to modify.
2.  **Editor Screen**: This is the main workspace, featuring a live `IframePreview` of the generated webpage and a `ChatPanel`. Users can interact with the AI assistant in the chat to request changes, and the live preview updates accordingly. It also includes functionality to save the final, cleaned HTML code.

The application cleverly injects CSS and JavaScript into the generated HTML to allow users to select specific elements on the page they want to modify, making the AI's changes more targeted and precise.

## Building and Running

**1. Prerequisites:**
*   Node.js installed.
*   A Gemini API key.

**2. Setup:**
*   Install dependencies:
    ```bash
    npm install
    ```
*   Create a `.env.local` file in the project root and add your Gemini API key:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

**3. Key Commands:**
*   **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

*   **Build for production:**
    ```bash
    npm run build
    ```

*   **Preview the production build:**
    ```bash
    npm run preview
    ```

## Development Conventions

*   **Framework:** React with TypeScript.
*   **Build Tool:** Vite.
*   **Architecture:** The application follows a component-based structure.
    *   `App.tsx`: The root component managing the main state (view, HTML content, chat history).
    *   `components/`: Contains all React components for different parts of the UI.
    *   `services/`: Handles all external API communication, specifically with the Gemini API in `geminiService.ts`.
    *   `types.ts`: Defines shared TypeScript types and enums used across the application.
*   **Styling:** The project appears to use utility-first CSS classes, likely from a framework like Tailwind CSS, applied directly in the JSX.
*   **State Management:** Local state is managed within components using React hooks (`useState`, `useEffect`, `useCallback`). Chat history is persisted to `localStorage`.
*   **API Interaction:** All logic for prompting the Gemini model is centralized in `services/geminiService.ts`. This service handles generating initial code, processing URLs, modifying existing code based on user feedback, and cleaning the final HTML for saving.
