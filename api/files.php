<?php
header('Content-Type: application/json');

$resourcesDir = __DIR__ . '/../resources';
$creationsDir = __DIR__ . '/../creations/images';

function scanDirectory($dir, $publicPath) {
    $files = [];
    if (!is_dir($dir)) {
        return [];
    }
    $items = scandir($dir);
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') {
            continue;
        }
        $files[] = [
            'name' => $item,
            'path' => $publicPath . $item
        ];
    }
    return $files;
}

$response = [
    'resources' => scanDirectory($resourcesDir, 'resources/'),
    'creations' => scanDirectory($creationsDir, 'creations/images/')
];

echo json_encode($response);
