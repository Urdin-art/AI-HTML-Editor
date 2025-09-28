<?php
header('Content-Type: application/json');

$uploadDir = __DIR__ . '/../resources/';

// Define validation rules
$allowedImageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$allowedDocExts = ['txt', 'md', 'csv', 'json'];
$maxImageSize = 10 * 1024 * 1024; // 10 MB
$maxDocSize = 1 * 1024 * 1024;   // 1 MB

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'No file uploaded.']);
    exit;
}

$file = $_FILES['file'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Upload error: ' . $file['error']]);
    exit;
}

$fileName = basename($file['name']);
$fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
$fileSize = $file['size'];

// Validate file type and size
$isValid = false;
if (in_array($fileExt, $allowedImageExts)) {
    if ($fileSize <= $maxImageSize) {
        $isValid = true;
    }
} elseif (in_array($fileExt, $allowedDocExts)) {
    if ($fileSize <= $maxDocSize) {
        $isValid = true;
    }
}

if (!$isValid) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid file type or size.']);
    exit;
}

$uploadPath = $uploadDir . $fileName;

if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
    echo json_encode(['status' => 'success', 'message' => 'File uploaded successfully.', 'path' => 'resources/' . $fileName]);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to save uploaded file.']);
}
