# Phase 1: Data Model

This document defines the key data entities for the resource management feature.

## 1. UserResource

Represents a file uploaded by the user to the `/resources` directory.

- **`filename`**: `string` - The original name of the file (e.g., `my-dog.jpg`).
- **`serverPath`**: `string` - The absolute path to the file on the server.
- **`fileType`**: `string` - The MIME type of the file (e.g., `image/jpeg`, `text/plain`).
- **`size`**: `number` - The file size in bytes.
- **`isSelected`**: `boolean` - The current selection state in the UI.

## 2. OptimizedImage

Represents an image after it has been processed by the optimization workflow, stored in `/creations/images`.

- **`filename`**: `string` - The name of the optimized image file.
- **`optimizedPath`**: `string` - The relative path for use in HTML (e.g., `./images/my-dog.jpg`).
- **`originalPath`**: `string` - The path of the original file in the `/resources` directory.
- **`originalSize`**: `number` - The size of the original file in bytes.
- **`optimizedSize`**: `number` - The size of the optimized file in bytes.

## 3. DisplayFile

A union type representing a file displayed in the UI, which can be either a `UserResource` or a reference to an `OptimizedImage`.

- **`name`**: `string`
- **`type`**: `'resource' | 'creation'`
- **`path`**: `string`
- **`isSelected`**: `boolean`
