<?php

namespace api;

include __DIR__ . '/Services/EnvParser.php';
include_once __DIR__ . '/routes.php';

use api\Services\EnvParser;

(new EnvParser(__DIR__ . '/../.env'))->load();

$html = file_get_contents('../public/index.html');

//  add asset versioning
$html = str_replace('bundle.js', 'bundle.js?version=' . filemtime('../public/build/bundle.js'), $html);
$html = str_replace('bundle.css', 'bundle.css?version=' . filemtime('../public/build/bundle.css'), $html);

//  remove google tag if not in production
if (getenv("APP_ENV") != 'production') {
    $html = preg_replace('/\n.<!-- Start Global.*[^*]*<!.*End.*\n/', '', $html);
}

echo $html;
