<?php
header('Content-Type: text/html'); // Return plain HTML content
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method Not Allowed');
}

$data = json_decode(file_get_contents('php://input'), true);
$filePath = $data['path'] ?? null;

if (!$filePath) {
    http_response_code(400);
    die('File path not provided.');
}

// Security check: Ensure the file is within the 'creations' directory
$baseDir = realpath(__DIR__ . '/../creations');
$fullPath = realpath(__DIR__ . '/../' . $filePath);

if (!$fullPath || strpos($fullPath, $baseDir) !== 0) {
    http_response_code(403);
    die('Access denied: You can only access files within the creations directory.');
}

if (!file_exists($fullPath)) {
    http_response_code(404);
    die('File not found.');
}

// Return the raw HTML content
echo file_get_contents($fullPath);

?>
