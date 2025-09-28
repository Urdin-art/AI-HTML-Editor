<?php

require_once __DIR__ . '/vendor/autoload.php';

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class ImageOptimizer {
    const API_ENDPOINT = 'http://api.resmush.it/';

    public static function optimize($sourceImagePath, $outputDir) {
        if (!file_exists($sourceImagePath)) {
            return false;
        }

        $client = new Client();

        try {
            $response = $client->request('POST', self::API_ENDPOINT, [
                'multipart' => [
                    [
                        'name'     => 'files',
                        'contents' => fopen($sourceImagePath, 'r')
                    ]
                ]
            ]);

            if ($response->getStatusCode() === 200) {
                $result = json_decode($response->getBody()->getContents());

                if (isset($result->error)) {
                    // API returned an error
                    return false;
                }

                // Download the optimized image
                $optimizedImageContents = file_get_contents($result->dest);
                if ($optimizedImageContents === false) {
                    return false;
                }

                // Save the optimized image
                $outputFileName = basename($sourceImagePath);
                $outputPath = $outputDir . '/' . $outputFileName;
                file_put_contents($outputPath, $optimizedImageContents);

                return $outputPath;
            }
        } catch (RequestException $e) {
            // Guzzle/HTTP error
            return false;
        }

        return false;
    }
}
