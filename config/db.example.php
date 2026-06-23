<?php

function getDB(): PDO
{
    static $db = null;

    if ($db === null) {
        $db = new PDO(
            'mysql:host=localhost;port=3306;dbname=YOUR_HOSTINGER_DB_NAME;charset=utf8mb4',
            'YOUR_HOSTINGER_DB_USER',
            'YOUR_HOSTINGER_DB_PASSWORD',
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
    }

    return $db;
}
