<?php

namespace api;

include __DIR__ . '/Services/EnvParser.php';

use api\Services\EnvParser;

(new EnvParser(__DIR__ . '/../.env'))->load();

if (getenv("APP_ENV") != 'production') {
    header('Access-Control-Allow-Origin: *');
}

include_once __DIR__ . '/routes.php';

$html = file_get_contents('../dist/index.html');

//  remove google tag if not in production
if (getenv("APP_ENV") != 'production') {
    $html = preg_replace('/\n.<!-- Start Global.*[^*]*<!.*End.*\n/', '', $html);
}

echo $html;
