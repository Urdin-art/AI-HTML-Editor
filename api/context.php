<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$files = $data['files'] ?? [];

if (empty($files)) {
    echo json_encode([]);
    exit;
}

$context = [];
$totalChars = 0;
$charLimit = 100000; // 100k character limit for text content

$docExts = ['txt', 'md', 'csv', 'json'];
$imgExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

foreach ($files as $filePath) {
    $fullPath = __DIR__ . '/../' . $filePath;
    if (!file_exists($fullPath)) continue;

    $ext = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
    $fileInfo = ['name' => basename($filePath), 'path' => $filePath];

    if (in_array($ext, $docExts)) {
        $content = file_get_contents($fullPath);
        if ($totalChars + strlen($content) > $charLimit) {
            $remainingChars = $charLimit - $totalChars;
            $content = substr($content, 0, $remainingChars) . "... [TRUNCATED]";
        }
        $fileInfo['type'] = 'document';
        $fileInfo['content'] = $content;
        $totalChars += strlen($content);

    } elseif (in_array($ext, $imgExts)) {
        $metadata = getimagesize($fullPath);
        $fileInfo['type'] = 'image';
        $fileInfo['metadata'] = [
            'width' => $metadata[0] ?? 'unknown',
            'height' => $metadata[1] ?? 'unknown',
            'mime' => $metadata['mime'] ?? 'unknown'
        ];
    }

    $context[] = $fileInfo;

    if ($totalChars >= $charLimit) {
        break; // Stop processing if limit is reached
    }
}

echo json_encode($context);
