<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'docs', 'docs/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => function () {
        $origins = [
            'http://localhost:3000',
            'http://localhost:3001',
        ];

        if ($frontendUrl = env('FRONTEND_URL')) {
            $origins[] = $frontendUrl;
        }

        // Add production domains from SANCTUM_STATEFUL_DOMAINS
        if ($statefulDomains = env('SANCTUM_STATEFUL_DOMAINS')) {
            $domains = explode(',', $statefulDomains);
            foreach ($domains as $domain) {
                $domain = trim($domain);
                $origins[] = 'https://' . $domain;
                $origins[] = 'http://' . $domain;
            }
        }

        return $origins;
    },

    'allowed_origins_patterns' => [
        '/^https:\/\/.*\.vercel\.app$/',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['X-XSRF-TOKEN'],

    'max_age' => 3600,

    'supports_credentials' => true,

];
