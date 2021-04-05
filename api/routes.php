<?php

namespace api;

use Api\MangaController;

require_once 'Services/Route.php';
require_once 'Controllers/MangaController.php';

$route = new Route;

$route->get('/', MangaController::class, 'index');
$route->get('/manga/search', MangaController::class, 'search');
$route->get('/manga/{slug}', MangaController::class, 'show');
$route->get('/manga/{slug}/{chapter}', MangaController::class, 'showChapter');
