<!--
Sync Impact Report:
- Version change: 0.0.0 → 1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] → Principle I: Resource-Driven Content Generation
  - [PRINCIPLE_2_NAME] → Principle II: Controlled File System Interaction
  - [PRINCIPLE_3_NAME] → Principle III: Structured Save and Optimization Workflow
  - [PRINCIPLE_4_NAME] → Principle IV: User Interface for Resource Management
  - [PRINCIPLE_5_NAME] → Principle V: Contextual Prompts
- Added sections: None
- Removed sections: None
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
  - ✅ .specify/templates/commands/implement.toml
- Follow-up TODOs: None
-->
# AI Web Creator Constitution

## Core Principles

### Principle I: Resource-Driven Content Generation
The agent MUST use user-provided files (images, documents) from the `resources` and `creations/images` folders to generate web page content. It will use these resources to replace placeholder content like text and images. If the intended use of a file is ambiguous, the agent MUST ask the user for clarification.

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

### Principle V: Contextual Prompts
The list of user-selected files from the resource management UI MUST be included in every prompt sent to the AI, for both initial page creation and subsequent modifications, to ensure the agent has the necessary context.

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

**Version**: 1.0.0 | **Ratified**: 2025-09-28 | **Last Amended**: 2025-09-28
