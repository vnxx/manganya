<?php

namespace Api;

class Http
{
    public static function get(String $url)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $source = curl_exec($ch);
        curl_close($ch);

        return $source;
    }
}
