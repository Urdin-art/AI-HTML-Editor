# Phase 0: Research

## 1. External Image Optimization Service

- **Task**: Research and select a suitable external image optimization API.
- **Candidates**: TinyPNG, Cloudinary, reSmush.it.
- **Criteria**: Ease of integration with PHP, cost, performance, and documentation quality.
- **Decision**: **reSmush.it**
- **Rationale**: The `reSmush.it` API is completely free and provides a simple, well-documented REST API that can be easily integrated with PHP using cURL. The free-of-charge aspect makes it the most efficient choice for this project, avoiding the need for budget management or API key secrets.

## 2. Frontend Testing Framework

- **Task**: Decide on a testing framework for the React frontend.
- **Candidates**:
  - Jest + React Testing Library (RTL)
  - Vitest
- **Criteria**: Ease of setup in the existing Vite project, performance, and community support.
- **Decision**: **Vitest**
- **Rationale**: Vitest is designed specifically for Vite projects, offering significant performance improvements and out-of-the-box support for TypeScript and JSX with minimal configuration. Its Jest-compatible API makes it easy to adopt, and it provides a much faster feedback loop during development, making it the most efficient choice for this project.