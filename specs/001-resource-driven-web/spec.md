# Feature Specification: Resource-Driven Web Creation and Optimization

**Feature Branch**: `001-resource-driven-web`  
**Created**: 2025-09-28  
**Status**: Clarified  
**Input**: User description: "Partimmos de una aplicación ya terminada a la que vamos a hacerle algunas mejoras y añadidos..."

## Clarifications
### Session 2025-09-28 (v1.1)
- Q: How should the application provide file content to the AI? → A: The application backend will read the content of selected text files and the metadata of selected images and include it directly in the prompt context sent to the AI.
- Q: What UI indicators should exist for selected files? → A: Icons for documents and images should appear near the chat input when files are selected.

### Session 2025-09-28 (v1.0)
- Q: For the image optimization utility, which implementation approach should be prioritized? → A: An external third-party API/CDN service for image processing.
- Q: What types of files should be allowed for upload? → A: Both images and documents.
- Q: What should be the maximum upload size per file? → A: 10 MB for images and 1 MB for documents.
- Q: If the external image optimization service fails, how should the system proceed? → A: Retry the optimization once, and if it fails again, proceed with the original images.
- Q: How should the system validate uploaded files for security? → A: Trust the file extension only.
- Q: What should happen to the optimized images saved in the `creations/images` folder? → A: They should persist indefinitely for future use in the "Imágenes" tab.

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a user, I want to upload my own files (images, documents) so that the AI can use their content and metadata to create a personalized and context-aware webpage, instead of relying on generic placeholders. I also want the final website to be automatically optimized for better performance.

### Acceptance Scenarios
1.  **Given** a user has selected a text document in the file manager, **When** they send a prompt, **Then** an icon indicating a document is attached appears near the input, and the AI receives the full content of the document in its context.
2.  **Given** the user has uploaded files, **When** they write a prompt like "Create a page about my dog using the uploaded picture and text", **Then** the generated HTML page includes the specified image and text content from the files.
3.  **Given** a user asks the AI to use a file named `summary.txt` that is not selected, **Then** the AI MUST respond by asking the user to select the file in the file manager.
4.  **Given** there are files in the `resources` directory, **When** the user clicks "Save", **Then** a confirmation dialog appears with the message: "Se guardará una copia optimizada de las imágenes utilizadas en el diseño y se eliminarán todos los archivos subidos. ¿Quieres continuar?".

### Edge Cases
- What happens when the total size of selected document contents exceeds the context limit? The system should show a warning and only include content up to the limit.
- How does the system handle a user trying to upload more than 10 files? The UI should prevent uploads beyond the 10-file limit.
- What happens if the image optimization process fails? The system will retry the optimization once. If it fails a second time, it will notify the user and save the HTML with the original, unoptimized image paths.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: The system MUST provide a file management UI on both the Home and Editor screens.
- **FR-002**: The UI MUST include a file input that allows uploading up to 10 files.
    - Allowed image extensions: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`. Maximum size: 10 MB.
    - Allowed document extensions: `.txt`, `.md`, `.csv`, `.json`. Maximum size: 1 MB.
- **FR-003**: The UI MUST contain a tabbed view with two tabs: "Recursos" (listing files in `/resources`) and "Imágenes" (listing files in `/creations/images`).
- **FR-004**: Each file listed MUST have a checkbox. Files in "Recursos" are checked by default; files in "Imágenes" are unchecked by default.
- **FR-005**: The application MUST prepare and send a detailed context with every request to the AI agent, which includes:
    - For selected documents: The full, plain-text content.
    - For selected images: The file name, path, and metadata (format, size).
- **FR-006**: The prompt sent to the AI MUST clearly label the provided file content and metadata, explaining its origin and purpose.
- **FR-007**: The AI agent MUST refuse any direct user command to perform file system operations (e.g., "delete this file"). Its file operations are governed by the application's internal logic only.
- **FR-008**: The system MUST implement a multi-step save process.
- **FR-009**: The system MUST trigger the deletion of all files in the `/resources` directory only after the save process completes successfully.
- **FR-010**: If the `/resources` directory is not empty, the system MUST display a confirmation modal before saving.
- **FR-011**: The AI agent MUST ask the user to select a file if asked to use one whose content/metadata is not in the current context.
- **FR-012**: File uploads MUST be validated by file extension on the frontend.
- **FR-013**: The `/creations/images` directory MUST be persistent.
- **FR-014**: The UI MUST display distinct icons near the chat input when documents or images are selected for context.
- **FR-015**: There MUST be a configurable limit on the total character count of text file content sent to the AI in a single prompt.

### Key Entities *(include if feature involves data)*
- **UserResource**: Represents a file managed by the system.
  - Attributes: `filename`, `path`, `type` ('resource' or 'creation'), `fileCategory` ('image' or 'document'), `isSelected` (boolean), `content` (string, for documents), `metadata` (object, for images).
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
