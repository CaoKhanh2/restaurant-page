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

function normalizeVisitorId($value): string
{
    if (!is_string($value)) {
        return '';
    }

    $value = substr(trim($value), 0, 128);
    return preg_match('/^[A-Za-z0-9_-]{16,128}$/', $value) ? $value : '';
}

function getClientIp(): string
{
    $forwardedFor = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if ($forwardedFor) {
        $parts = explode(',', $forwardedFor);
        return trim($parts[0]);
    }

    return $_SERVER['REMOTE_ADDR'] ?? '';
}

// Store a hash only. Same IP counts as one visitor; the anonymous browser id is
// a fallback for environments where the server cannot determine an IP.
$visitorId  = normalizeVisitorId($data['visitor_id'] ?? '');
$clientIp   = getClientIp();
$identifier = $clientIp !== '' ? 'ip:' . $clientIp : 'visitor:' . $visitorId;

if ($identifier === 'visitor:') {
    $identifier = 'ua:' . ($_SERVER['HTTP_USER_AGENT'] ?? 'unknown');
}

$visitorHash = hash('sha256', $identifier);

$db = getDB();
$stmt = $db->prepare("
    INSERT INTO analytics (page_url, referrer, ip_hash) VALUES (?, ?, ?)
");
$stmt->execute([$page, $referrer ?: null, $visitorHash]);

http_response_code(204);
