<?php

namespace Api;

class Http
{
    private static $instance;
    public static $source;
    public static $status;

    public static function get(String $url)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        self::$source = curl_exec($ch);
        self::$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close($ch);

        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public static function response()
    {
        return self::$source;
    }

    public static function getStatus()
    {
        return self::$status;
    }

    public static function isSuccess()
    {
        return self::$status == 200;
    }

    public static function showError()
    {
        $error_message = 'Terjadi kesalahan';

        if (self::$status >= 500) {
            $error_message = 'Server Error';
        } else if (self::$status == 404) {
            $error_message = 'Data tidak ditemukan';
        } else if (self::$status >= 400) {
            $error_message = 'Client Error';
        }

        return [
            'status' => strtoupper(str_replace(' ', '_', $error_message)),
            'status_code' => self::$status,
            'message' => $error_message,
        ];
    }
}
