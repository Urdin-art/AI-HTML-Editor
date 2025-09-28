<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/ImageOptimizer.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow requests from Vite dev server
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$response = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['htmlContent']) && isset($data['filename'])) {
        $htmlContent = $data['htmlContent'];
        $filename = $data['filename'];
        $usedImages = $data['usedImages'] ?? [];

        $creationsDir = __DIR__ . '/../creations';
        $creationsImagesDir = $creationsDir . '/images';
        $resourcesDir = __DIR__ . '/../resources';

        // Ensure directories exist
        if (!is_dir($creationsImagesDir)) mkdir($creationsImagesDir, 0755, true);

        // --- Image Optimization Step ---
        foreach ($usedImages as $imagePath) {
            $sourceImagePath = __DIR__ . '/../' . $imagePath;
            $optimizedPath = ImageOptimizer::optimize($sourceImagePath, $creationsImagesDir);
            
            if ($optimizedPath) {
                $newRelativePath = './images/' . basename($optimizedPath);
                // Replace old path with new relative path in HTML
                $htmlContent = str_replace($imagePath, $newRelativePath, $htmlContent);
            }
        }

        // --- Save HTML Step ---
        $basename = basename($filename);
        if (substr($basename, -5) !== '.html') {
            $basename .= '.html';
        }
        $filePath = $creationsDir . '/' . $basename;

        if (file_put_contents($filePath, $htmlContent) !== false) {
            // --- Cleanup Step ---
            if (!empty($usedImages)) {
                $files = glob($resourcesDir . '/*');
                foreach($files as $file){
                    if(is_file($file)) {
                        unlink($file);
                    }
                }
            }
            $response['status'] = 'success';
            $response['message'] = 'Archivo guardado y optimizado con éxito en: creations/' . $basename;
            http_response_code(200);
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Error: No se pudo escribir en el archivo HTML.';
            http_response_code(500);
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Error: Faltan datos (htmlContent o filename).';
        http_response_code(400);
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Error: Método de solicitud no válido.';
    http_response_code(405);
}

echo json_encode($response);
?>
