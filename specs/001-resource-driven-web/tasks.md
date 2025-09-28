# Tasks: Resource-Driven Web Creation

**Input**: Design documents from `/specs/001-resource-driven-web/`

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Setup
- [ ] T001 Create the following directories: `resources/` and `creations/images/`. Ensure they are writable by the server.
- [ ] T002 [P] Install frontend testing dependencies: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
- [ ] T003 [P] Configure Vitest in the project by creating a `vite.config.ts` or similar configuration file to set up the test environment.
- [ ] T004 [P] If not already present, initialize Composer in the `api/` directory (`composer init`) and install Guzzle: `composer require guzzlehttp/guzzle`.

## Phase 3.2: Backend Implementation
- [ ] T005 [P] Implement `api/files.php` to scan the `resources/` and `creations/images/` directories and return their contents as a JSON object.
- [ ] T006 [P] Implement `api/upload.php` to handle `multipart/form-data` file uploads. It must validate files by extension and size, and move valid files to the `resources/` directory.
- [ ] T007 [P] Create a PHP utility/class that communicates with the `reSmush.it` API to optimize an image and save it to `creations/images/`.

## Phase 3.3: Frontend Implementation (TDD)
- [ ] T008 [P] Create `src/components/FileManager.test.tsx` and write failing tests for the core UI and state logic: rendering tabs, displaying mock file lists, and handling checkbox state changes.
- [ ] T009 Create the basic structure of the `src/components/FileManager.tsx` component.
- [ ] T010 Implement the UI of the `FileManager` component, including the upload form, the "Recursos" and "Imágenes" tabs.
- [ ] T011 Implement the client-side logic to call the `api/files.php` endpoint and display the files in the correct tabs.
- [ ] T012 Implement the client-side logic for the file upload form to send files to the `api/upload.php` endpoint.
- [ ] T012a [P] In `src/components/FileManager.tsx`, add client-side validation to the file input to check allowed extensions and sizes, providing immediate feedback to the user.
- [ ] T013 Implement state management within the component to track selected files.
- [ ] T014 Make the tests in `src/components/FileManager.test.tsx` pass.

## Phase 3.4: Integration
- [ ] T015 Integrate the `FileManager` component into `App.tsx` so it appears on both the `HomeScreen` and `EditorScreen`.
- [ ] T016 Modify `App.tsx` to pass the list of selected files from `FileManager` into the `geminiService` calls (`generateInitialCode`, `modifyCode`).
- [ ] T017 Modify `services/geminiService.ts` to include the list of selected files in the prompts sent to the Gemini API.
- [ ] T018 Modify the `handleSave` function in `App.tsx` to send the list of used images to the `api/save.php` endpoint.
- [ ] T018a [P] In `App.tsx`, implement a confirmation dialog (e.g., using `window.confirm`) that is triggered by `handleSave` if the `resources` directory is not empty, as per FR-010.
- [ ] T019 Fully implement the logic in `api/save.php` to orchestrate the entire save workflow: receive HTML, call the optimization utility for used images, update image paths in the HTML, clean the HTML, save the file, and clear the `resources` directory.

## Phase 3.5: Polish
- [ ] T020 [P] Implement robust error handling and user-facing notifications for all API interactions (file upload, file listing, saving).
- [ ] T021 [P] Write integration tests (using Vitest) that mock the API calls to verify the end-to-end frontend logic.
- [ ] T022 [P] Review and refactor all new code for clarity, performance, and adherence to project conventions.
- [ ] T023 [P] Update the main `README.md` with any new instructions related to the backend setup or environment if necessary.

## Dependencies
- T001, T002, T003, T004 must be done first.
- Backend (T005-T007) and Frontend (T008-T014) tasks can run largely in parallel.
- Integration tasks (T015-T019) depend on the completion of backend and frontend core tasks.
- Polish tasks (T020-T023) should be done last.

## Parallel Example
```
# Launch backend and frontend test creation together:
Task: "[P] Implement api/files.php..."
Task: "[P] Implement api/upload.php..."
Task: "[P] Create src/components/FileManager.test.tsx and write failing tests..."
```
