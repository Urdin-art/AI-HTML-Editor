<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/ImageResizer.php';

// Function to send debug messages to PHP's error log
function debug_log($message) {
    error_log("[SAVE_PROCESS] " . $message);
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

debug_log("------ Save script started ------");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    debug_log("Error: Method not allowed.");
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['htmlContent']) || !isset($data['filename'])) {
    http_response_code(400);
    debug_log("Error: Missing htmlContent or filename.");
    echo json_encode(['status' => 'error', 'message' => 'Faltan datos (htmlContent o filename).']);
    exit;
}

$htmlContent = $data['htmlContent'];
$filename = $data['filename'];
debug_log("Received request to save {$filename}");

$creationsDir = __DIR__ . '/../creations';
$creationsImagesDir = $creationsDir . '/images';
$resourcesDir = __DIR__ . '/../resources';

if (!is_dir($creationsImagesDir)) {
    debug_log("Creating directory: {$creationsImagesDir}");
    mkdir($creationsImagesDir, 0755, true);
}

// --- Dynamic Image Resizing Step ---
debug_log("Starting image resizing process...");
$dom = new DOMDocument();
libxml_use_internal_errors(true);
$dom->loadHTML($htmlContent, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
libxml_clear_errors();
debug_log("HTML content loaded into DOM.");

$images = $dom->getElementsByTagName('img');
debug_log("Found " . $images->length . " image tags.");

foreach ($images as $img) {
    $src = $img->getAttribute('src');
    debug_log("Processing img tag with src: {$src}");

    if (strpos($src, 'resources/') === 0) {
        $width = $img->getAttribute('width');
        $height = $img->getAttribute('height');
        $sourcePath = __DIR__ . '/../' . $src;
        $imageName = basename($src);
        $destinationPath = $creationsImagesDir . '/' . $imageName;

        if ($width && $height && file_exists($sourcePath)) {
            debug_log("Image is a resource with dimensions: {$width}x{$height}. Attempting resize...");
            $result = ImageResizer::processImage($sourcePath, $destinationPath, (int)$width, (int)$height);
            
            if ($result['success']) {
                $newSrc = 'images/' . $imageName;
                $img->setAttribute('src', $newSrc);
                debug_log("Resize successful. Image src updated to {$newSrc}");
            } else {
                debug_log("ERROR resizing {$src}: " . $result['error']);
            }
        } else {
            // Fallback: If image can't be resized (no dimensions or other issue), copy it as-is
            if (file_exists($sourcePath)) {
                copy($sourcePath, $destinationPath);
                $newSrc = 'images/' . $imageName;
                $img->setAttribute('src', $newSrc);
                debug_log("Fallback: Copied {$src} as-is to {$destinationPath} and updated src.");
            } else {
                debug_log("WARNING: Source file not found at {$sourcePath} and could not be processed.");
            }
        }
    } else {
        debug_log("Skipping image, not in /resources folder.");
    }
}

$finalHtml = $dom->saveHTML();
debug_log("Finished processing images. Saving final HTML...");

// --- Save HTML Step ---
$basename = basename($filename);
if (substr($basename, -5) !== '.html') {
    $basename .= '.html';
}
$filePath = $creationsDir . '/' . $basename;

if (file_put_contents($filePath, $finalHtml) !== false) {
    debug_log("HTML file saved successfully to {$filePath}");
    // --- Cleanup Step ---
    debug_log("Cleaning up /resources directory...");
    $resourceFiles = glob($resourcesDir . '/*');
    foreach($resourceFiles as $file){
        if(is_file($file)) {
            unlink($file);
        }
    }
    
    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'Archivo guardado con imágenes redimensionadas en: creations/' . $basename]);
} else {
    http_response_code(500);
    debug_log("FATAL: Could not write final HTML to {$filePath}");
    echo json_encode(['status' => 'error', 'message' => 'Error: No se pudo escribir en el archivo HTML.']);
}

debug_log("------ Save script finished ------\n");

?>