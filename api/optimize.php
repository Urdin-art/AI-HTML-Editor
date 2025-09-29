<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/ImageOptimizer.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$files = $data['files'] ?? [];
$quality = isset($data['quality']) ? (int)$data['quality'] : 92;

if (empty($files)) {
    http_response_code(400);
    echo json_encode(['error' => 'No files provided.']);
    exit;
}

$creationsDir = __DIR__ . '/../creations/images';
if (!is_dir($creationsDir)) {
    mkdir($creationsDir, 0755, true);
}

$results = [];

foreach ($files as $filePath) {
    $sourceImagePath = __DIR__ . '/../' . $filePath;
    $result = ImageOptimizer::optimize($sourceImagePath, $creationsDir, $quality);
    $results[] = [
        'source' => $filePath,
        'result' => $result
    ];
}

http_response_code(200);
echo json_encode($results);
?>
