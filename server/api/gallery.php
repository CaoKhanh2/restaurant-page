<?php
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Cache-Control: public, max-age=60');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$db = getDB();
$stmt = $db->query("
    SELECT id, image_path, alt_text, display_order
    FROM gallery
    WHERE is_active = 1
    ORDER BY display_order ASC, id ASC
");

echo json_encode(['images' => $stmt->fetchAll()]);
