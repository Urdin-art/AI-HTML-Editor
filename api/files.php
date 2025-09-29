<?php
header('Content-Type: application/json');

$resourcesDir = __DIR__ . '/../resources';
$creationsDir = __DIR__ . '/../creations'; // Base creations folder
$creationsImagesDir = $creationsDir . '/images'; // Subfolder for images

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
    'creations' => scanDirectory($creationsImagesDir, 'creations/images/')
];

// Add HTML pages from the creations directory
$pages = [];
$htmlFiles = glob($creationsDir . '/*.html');
foreach ($htmlFiles as $page) {
    if (is_file($page)) {
        $pages[] = [
            'name' => basename($page),
            'path' => 'creations/' . basename($page)
        ];
    }
}
$response['pages'] = $pages;

echo json_encode($response);
