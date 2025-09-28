<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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

        // --- Basic Security --- 
        // Sanitize filename to prevent directory traversal
        $basename = basename($filename);
        // Ensure it ends with .html
        if (substr($basename, -5) !== '.html') {
            $basename .= '.html';
        }

        // Define a safe directory for creations
        $creationsDir = __DIR__ . '/../creations';
        if (!is_dir($creationsDir)) {
            if (!mkdir($creationsDir, 0755, true)) {
                $response['status'] = 'error';
                $response['message'] = 'Error: No se pudo crear el directorio de guardado.';
                http_response_code(500);
                echo json_encode($response);
                exit;
            }
        }

        $filePath = $creationsDir . '/' . $basename;

        if (file_put_contents($filePath, $htmlContent) !== false) {
            $response['status'] = 'success';
            // Provide a relative path for the user
            $response['message'] = 'Archivo guardado con éxito en: creations/' . $basename;
            http_response_code(200);
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Error: No se pudo escribir en el archivo.';
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
