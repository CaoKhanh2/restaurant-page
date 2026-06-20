<?php
session_start();
if (!isset($_SESSION['admin'])) { http_response_code(401); echo json_encode(['error'=>'Unauthorized']); exit; }

require_once __DIR__ . '/../../config/db.php';
header('Content-Type: application/json; charset=utf-8');

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;
$data   = json_decode(file_get_contents('php://input'), true) ?? [];

if ($method === 'GET') {
    echo json_encode(['banners' => $db->query("SELECT * FROM banners ORDER BY id DESC")->fetchAll()]);
    exit;
}

if ($method === 'POST') {
    $stmt = $db->prepare("INSERT INTO banners (title, message, is_active, starts_at, ends_at) VALUES (?,?,?,?,?)");
    $stmt->execute([
        $data['title']    ?? null,
        $data['message']  ?? '',
        (int)($data['is_active'] ?? 1),
        $data['starts_at'] ?: null,
        $data['ends_at']   ?: null,
    ]);
    http_response_code(201);
    echo json_encode(['id' => $db->lastInsertId()]);
    exit;
}

if ($method === 'PUT' && $id) {
    $stmt = $db->prepare("UPDATE banners SET title=?, message=?, is_active=?, starts_at=?, ends_at=? WHERE id=?");
    $stmt->execute([
        $data['title']    ?? null,
        $data['message']  ?? '',
        (int)($data['is_active'] ?? 1),
        $data['starts_at'] ?: null,
        $data['ends_at']   ?: null,
        $id,
    ]);
    echo json_encode(['success' => true]);
    exit;
}

if ($method === 'DELETE' && $id) {
    $stmt = $db->prepare("DELETE FROM banners WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Bad request']);
