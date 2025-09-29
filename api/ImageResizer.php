<?php

require_once __DIR__ . '/vendor/autoload.php';

use Gumlet\ImageResize;
use Gumlet\ImageResizeException;

class ImageResizer {

    public static function processImage($sourcePath, $destinationPath, $width, $height, $quality = 85)
    {
        try {
            $image = new ImageResize($sourcePath);

            if ($width && $height) {
                $image->resizeToBestFit($width, $height, true);
            } elseif ($width) {
                $image->resizeToWidth($width, true);
            } elseif ($height) {
                $image->resizeToHeight($height, true);
            }

            $image->save($destinationPath, null, $quality);

            return [
                'success' => true,
                'path' => $destinationPath
            ];

        } catch (ImageResizeException $e) {
            return [
                'success' => false,
                'error' => 'Image resize failed: ' . $e->getMessage()
            ];
        }
    }
}
