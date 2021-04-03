<?php

namespace api;

class Route
{

    protected $path;

    public function __construct()
    {
        $this->path = $_SERVER['REQUEST_URI'];
    }

    public function get($path = null, $callback, $target)
    {
        $path = $path == '/' ? '/api' : '/api' . $path;
        $params = [];
        $match = 0;

        $current_path = array_values(array_filter(explode('/', $this->path)));
        $current_route = array_values(array_filter(explode('/', $path)));

        if (count($current_path) == 0 || $current_path[0] != 'api') {
            return null;
        }

        foreach ($current_route as $key => $routeVal) {
            if ($routeVal[0] == '{') {
                array_push($params, $current_path[$key]);
                continue;
            } else {
                if ($routeVal == $current_path[$key]) {
                    $match++;
                } else {
                    break;
                }
            }
        }

        if (count($current_path) - count($params) == $match) {
            $controller = new $callback;
            header('Content-Type: application/json');
            http_response_code(200);
            echo json_encode($controller->$target(...$params));
            exit();
        };
    }
}
