<?php
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Cache-Control: public, max-age=30');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$db = getDB();
$now = date('Y-m-d H:i:s');

$stmt = $db->prepare("
    SELECT id, title, message
    FROM banners
    WHERE is_active = 1
      AND (starts_at IS NULL OR starts_at <= ?)
      AND (ends_at   IS NULL OR ends_at   >= ?)
    ORDER BY id DESC
    LIMIT 5
");
$stmt->execute([$now, $now]);

echo json_encode(['banners' => $stmt->fetchAll()]);
