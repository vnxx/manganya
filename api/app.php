<?php

namespace api;

include_once __DIR__ . '/routes.php';

$html = file_get_contents('../public/index.html');

//  add asset versioning
$html = str_replace('bundle.js', 'bundle.js?version=' . filemtime('../public/build/bundle.js'), $html);
$html = str_replace('bundle.css', 'bundle.css?version=' . filemtime('../public/build/bundle.css'), $html);

echo $html;
