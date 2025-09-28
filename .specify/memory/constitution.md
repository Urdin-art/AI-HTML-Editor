<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0
- List of modified principles:
  - Principle I: Resource-Driven Content Generation (clarified content vs. metadata)
  - Principle V: Contextual Prompts (clarified content vs. metadata)
- Added sections: None
- Removed sections: None
- Templates requiring updates: [Will be re-evaluated]
- Follow-up TODOs: None
-->
# AI Web Creator Constitution

## Core Principles

### Principle I: Resource-Driven Content Generation
The agent MUST use user-provided files to generate web page content. For documents (txt, md, json, csv), it will receive the full text content. For images, it will receive metadata (name, path, dimensions). It MUST use these resources to replace placeholder content. If the intended use of a file is ambiguous, the agent MUST ask the user for clarification. If the user asks for a file not in the context, the agent MUST ask the user to select it.

### Principle II: Controlled File System Interaction
The agent's file system operations are strictly controlled. It is permitted to read from the `resources` and `creations` directories (including subdirectories) to gather context. However, it MUST NOT perform any user-requested file manipulation (create, delete, modify). All write operations are restricted to the automated "Save" workflow.

### Principle III: Structured Save and Optimization Workflow
The agent MUST adhere to the following multi-step saving process, initiated only by the application's "Save" button:
1.  Display an "Optimizando imágenes" message to the user.
2.  A backend utility will optimize and resize images used in the design, saving them to the `creations/images` folder.
3.  The agent will then update the HTML to use relative paths (`./images/<image_file>`) for all optimized images.
4.  The agent will clean the HTML of all temporary instrumentation code (e.g., selection-related classes and scripts).
5.  The final, clean HTML is saved to the `creations` folder.
6.  If the `resources` folder was used, the application will prompt the user for confirmation before deleting its contents: "Se guardará una copia optimizada de las imágenes utilizadas en el diseño y se eliminarán todos los archivos subidos. ¿Quieres continuar?"
The agent MUST refuse any user requests to bypass this structured process.

### Principle IV: User Interface for Resource Management
The application UI MUST provide components for resource management on both the home and editor screens. This includes:
- A file uploader for up to 10 files, which will be saved to the `resources` directory.
- A tabbed view to display selectable lists of files from the `resources` (default: selected) and `creations/images` (default: unselected) directories.
- UI indicators MUST be displayed in the chat input area to show when documents or images are selected.

### Principle V: Contextual Prompts
The context provided to the AI in each prompt MUST include:
- For selected documents (`.txt`, `.md`, `.csv`, `.json`): The full, plain-text content of the file, up to a specified total limit.
- For selected images: The file name, path, and key metadata (e.g., format, dimensions).
This information MUST be clearly labeled to inform the agent of its origin and purpose.

## Development Workflow

The development process will be guided by the core principles. All new features or modifications must align with the defined workflows for content generation, file handling, and the save process. The agent is expected to use PowerShell for executing shell commands on the Windows environment.

## Governance

This constitution is the primary source of truth for the project's operational logic and agent behavior. Amendments require a documented proposal, review, and impact analysis on all related system components.

- **Amendment Procedure**: Propose changes via a pull request updating this document. The PR description must detail the rationale and impact.
- **Versioning**: Changes will follow Semantic Versioning 2.0.0.
  - **MAJOR**: Backward-incompatible changes to principles or core workflows.
  - **MINOR**: Adding new, backward-compatible principles or features.
  - **PATCH**: Clarifications, typo fixes, or non-functional refinements.
- **Compliance**: All agent actions and application logic must be verifiable against this constitution.

**Version**: 1.1.0 | **Ratified**: 2025-09-28 | **Last Amended**: 2025-09-28
