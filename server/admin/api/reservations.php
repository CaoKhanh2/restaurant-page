<?php
session_start();
if (!isset($_SESSION['admin'])) { http_response_code(401); echo json_encode(['error'=>'Unauthorized']); exit; }

require_once __DIR__ . '/../../config/db.php';
header('Content-Type: application/json; charset=utf-8');

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;

if ($method === 'GET') {
    $status = $_GET['status'] ?? null;
    $limit  = min((int)($_GET['limit'] ?? 50), 200);
    $offset = (int)($_GET['offset'] ?? 0);

    if ($status) {
        $stmt = $db->prepare("SELECT * FROM reservations WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?");
        $stmt->execute([$status, $limit, $offset]);
    } else {
        $stmt = $db->prepare("SELECT * FROM reservations ORDER BY created_at DESC LIMIT ? OFFSET ?");
        $stmt->execute([$limit, $offset]);
    }

    $total = $db->query("SELECT COUNT(*) FROM reservations")->fetchColumn();
    echo json_encode(['reservations' => $stmt->fetchAll(), 'total' => (int)$total]);
    exit;
}

if ($method === 'PATCH' && $id) {
    $data   = json_decode(file_get_contents('php://input'), true) ?? [];
    $status = $data['status'] ?? null;

    if (!in_array($status, ['pending', 'confirmed', 'cancelled'])) {
        http_response_code(422);
        echo json_encode(['error' => 'Invalid status']);
        exit;
    }

    $stmt = $db->prepare("UPDATE reservations SET status = ? WHERE id = ?");
    $stmt->execute([$status, $id]);
    echo json_encode(['success' => true]);
    exit;
}

if ($method === 'DELETE' && $id) {
    $stmt = $db->prepare("DELETE FROM reservations WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Bad request']);
