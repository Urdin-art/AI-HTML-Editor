<?php

require_once __DIR__ . '/vendor/autoload.php';

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class ImageOptimizer {
    const API_ENDPOINT = 'http://api.resmush.it/';

    public static function optimize($sourceImagePath, $outputDir, $quality = 92) {
        if (!file_exists($sourceImagePath)) {
            return [
                'success' => false,
                'error' => 'Source file not found.'
            ];
        }

        $client = new Client();

        try {
            $response = $client->request('POST', self::API_ENDPOINT, [
                'multipart' => [
                    [
                        'name'     => 'files',
                        'contents' => fopen($sourceImagePath, 'r')
                    ],
                    [
                        'name'     => 'qlty',
                        'contents' => $quality
                    ]
                ]
            ]);

            if ($response->getStatusCode() === 200) {
                $result = json_decode($response->getBody()->getContents());

                if (isset($result->error)) {
                    return [
                        'success' => false,
                        'error' => 'API error: ' . $result->error_long
                    ];
                }

                $optimizedImageContents = file_get_contents($result->dest);
                if ($optimizedImageContents === false) {
                    return [
                        'success' => false,
                        'error' => 'Failed to download optimized image from ' . $result->dest
                    ];
                }

                $outputFileName = basename($sourceImagePath);
                $outputPath = $outputDir . '/' . $outputFileName;
                file_put_contents($outputPath, $optimizedImageContents);

                return [
                    'success' => true,
                    'original_size' => $result->src_size,
                    'optimized_size' => $result->dest_size,
                    'percent_saved' => $result->percent,
                    'path' => $outputPath
                ];
            }
        } catch (RequestException $e) {
            return [
                'success' => false,
                'error' => 'HTTP request failed: ' . $e->getMessage()
            ];
        }

        return [
            'success' => false,
            'error' => 'Unknown error occurred.'
        ];
    }
}
