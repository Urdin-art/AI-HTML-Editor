# Feature Specification: Resource-Driven Web Creation and Optimization

**Feature Branch**: `001-resource-driven-web`  
**Created**: 2025-09-28  
**Status**: Clarified  
**Input**: User description: "Partimmos de una aplicación ya terminada a la que vamos a hacerle algunas mejoras y añadidos..."

## Clarifications
### Session 2025-09-28
- Q: For the image optimization utility, which implementation approach should be prioritized? → A: An external third-party API/CDN service for image processing.
- Q: What types of files should be allowed for upload? → A: Both images and documents.
- Q: What should be the maximum upload size per file? → A: 10 MB for images and 1 MB for documents.
- Q: If the external image optimization service fails, how should the system proceed? → A: Retry the optimization once, and if it fails again, proceed with the original images.
- Q: How should the system validate uploaded files for security? → A: Trust the file extension only.

- Q: What should happen to the optimized images saved in the `creations/images` folder? → A: They should persist indefinitely for future use in the "Imágenes" tab.

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a user, I want to upload my own files (images, documents) so that the AI can use them to create a personalized and context-aware webpage, instead of relying on generic placeholders. I also want the final website to be automatically optimized for better performance.

### Acceptance Scenarios
1.  **Given** a user is on the home or editor screen, **When** they upload an image and a text document using the file manager, **Then** the files appear in the "Recursos" tab with their checkboxes selected.
2.  **Given** the user has uploaded files, **When** they write a prompt like "Create a page about my dog using the uploaded picture and text", **Then** the generated HTML page includes the specified image and text content from the files.
3.  **Given** a generated page uses images from the user's uploads, **When** the user clicks the "Save" button, **Then** the system optimizes the images, updates the HTML to point to the new image paths (`./images/...`), cleans the code, and saves the final `index.html` to the `creations` folder.
4.  **Given** there are files in the `resources` directory, **When** the user clicks "Save", **Then** a confirmation dialog appears with the message: "Se guardará una copia optimizada de las imágenes utilizadas en el diseño y se eliminarán todos los archivos subidos. ¿Quieres continuar?".

### Edge Cases
- What happens when a user uploads a file with an unsupported extension? The system should show an error message.
- How does the system handle a user trying to upload more than 10 files? The UI should prevent uploads beyond the 10-file limit.
- What happens if the image optimization process fails? The system will retry the optimization once. If it fails a second time, it will notify the user and save the HTML with the original, unoptimized image paths.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: The system MUST provide a file management UI on both the Home and Editor screens.
- **FR-002**: The UI MUST include a file input that allows uploading up to 10 files.
    - Allowed image extensions: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`. Maximum size: 10 MB.
    - Allowed document extensions: `.txt`, `.md`. Maximum size: 1 MB.
- **FR-003**: The UI MUST contain a tabbed view with two tabs: "Recursos" (listing files in `/resources`) and "Imágenes" (listing files in `/creations/images`).
- **FR-004**: Each file listed MUST have a checkbox. Files in "Recursos" are checked by default; files in "Imágenes" are unchecked by default.
- **FR-005**: The application MUST send the list of all user-selected files with every request to the AI agent.
- **FR-006**: The AI agent MUST have the capability to read file contents and metadata from the `/resources` and `/creations` directories and their subdirectories.
- **FR-007**: The AI agent MUST refuse any direct user command to perform file system operations (e.g., "delete this file"). Its file operations are governed by the application's internal logic only.
- **FR-008**: The system MUST implement a multi-step save process:
    - a. Display an "Optimizando imágenes" notification.
    - b. An **external image processing API** MUST be used to optimize and resize images.
    - c. Optimized images MUST be saved to the `/creations/images` directory.
    - d. The agent MUST update all `<img>` `src` attributes in the HTML to point to the new relative paths (e.g., `./images/optimized-image.jpg`).
    - e. The agent MUST clean all instrumentation code from the HTML.
    - f. The final, cleaned HTML MUST be saved to the `/creations` directory.
- **FR-009**: The system MUST trigger the deletion of all files in the `/resources` directory only after the save process completes successfully.
- **FR-010**: If the `/resources` directory is not empty when the save process is initiated, the system MUST display a confirmation modal with a warning about file deletion.
- **FR-011**: The AI agent MUST ask for clarification if a user's prompt is ambiguous about how to use the provided files.
- **FR-012**: File uploads MUST be validated by file extension on the frontend.
- **FR-013**: The `/creations/images` directory MUST be persistent. Its contents are not to be deleted as part of the save workflow to allow for reuse.

### Key Entities *(include if feature involves data)*
- **UserResource**: Represents a file uploaded by the user.
  - Attributes: `filename`, `serverPath`, `fileType` (e.g., 'image/jpeg', 'text/plain'), `isSelected` (boolean).
- **OptimizedImage**: Represents an image processed during the save workflow.
  - Attributes: `originalPath`, `optimizedPath`, `originalSize`, `optimizedSize`.

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [X] No implementation details (languages, frameworks, APIs)
- [X] Focused on user value and business needs
- [X] Written for non-technical stakeholders
- [X] All mandatory sections completed

### Requirement Completeness
- [X] No [NEEDS CLARIFICATION] markers remain
- [X] Requirements are testable and unambiguous  
- [X] Success criteria are measurable
- [X] Scope is clearly bounded
- [X] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [X] User description parsed
- [X] Key concepts extracted
- [X] Ambiguities marked
- [X] User scenarios defined
- [X] Requirements generated
- [X] Entities identified
- [X] Review checklist passed

---
