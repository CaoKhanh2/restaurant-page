<?php
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$page     = substr(trim($data['page'] ?? ''), 0, 500);
$referrer = substr(trim($data['referrer'] ?? ''), 0, 500);

if (!$page) {
    http_response_code(400);
    echo json_encode(['error' => 'page is required']);
    exit;
}

// Hash IP for privacy — store hash only, not raw IP
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
$ipHash = hash('sha256', $ip . date('Y-m-d')); // salted by day so it resets daily

$db = getDB();
$stmt = $db->prepare("
    INSERT INTO analytics (page_url, referrer, ip_hash) VALUES (?, ?, ?)
");
$stmt->execute([$page, $referrer ?: null, $ipHash]);

http_response_code(204);
