<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/ImageResizer.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$sourceFile = $data['sourceFile'] ?? null;
$width = isset($data['width']) ? (int)$data['width'] : null;
$height = isset($data['height']) ? (int)$data['height'] : null;
$quality = isset($data['quality']) ? (int)$data['quality'] : 85;

if (!$sourceFile || !$width || !$height) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing parameters: sourceFile, width, and height are required.']);
    exit;
}

$sourcePath = __DIR__ . '/../' . $sourceFile;
$imageName = basename($sourceFile);
$destinationDir = __DIR__ . '/../creations/images';
$destinationPath = $destinationDir . '/test-' . $width . 'x' . $height . '-' . $imageName;

if (!is_dir($destinationDir)) {
    mkdir($destinationDir, 0755, true);
}

if (!file_exists($sourcePath)) {
    http_response_code(404);
    echo json_encode(['error' => 'Source file not found at: ' . $sourcePath]);
    exit;
}

$result = ImageResizer::processImage($sourcePath, $destinationPath, $width, $height, $quality);

// Add the new path to the result for the frontend to use
if ($result['success']) {
    $result['new_path_relative'] = 'creations/images/' . basename($destinationPath);
}

http_response_code($result['success'] ? 200 : 500);
echo json_encode($result);

?>
