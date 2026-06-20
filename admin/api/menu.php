<?php
session_start();
if (!isset($_SESSION['admin'])) { http_response_code(401); echo json_encode(['error'=>'Unauthorized']); exit; }

require_once __DIR__ . '/../../config/db.php';
header('Content-Type: application/json; charset=utf-8');

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$data   = json_decode(file_get_contents('php://input'), true) ?? [];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;

if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT * FROM dishes WHERE id = ?");
        $stmt->execute([$id]);
        $dish = $stmt->fetch();
        echo json_encode($dish ?: null);
    } else {
        $rows = $db->query("
            SELECT d.*, c.category_key, c.title_fr as category_title
            FROM dishes d JOIN categories c ON d.category_id = c.id
            ORDER BY c.display_order, d.display_order, d.id
        ")->fetchAll();
        $cats = $db->query("SELECT * FROM categories ORDER BY display_order")->fetchAll();
        echo json_encode(['dishes' => $rows, 'categories' => $cats]);
    }
    exit;
}

if ($method === 'POST') {
    $stmt = $db->prepare("
        INSERT INTO dishes (category_id, name_fr, name_en, price, description_fr, image_path, is_featured, display_order, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        (int)($data['category_id'] ?? 0),
        $data['name_fr'] ?? '',
        $data['name_en'] ?? null,
        (float)($data['price'] ?? 0),
        $data['description_fr'] ?? null,
        $data['image_path'] ?? null,
        (int)($data['is_featured'] ?? 0),
        (int)($data['display_order'] ?? 0),
        (int)($data['is_active'] ?? 1),
    ]);
    http_response_code(201);
    echo json_encode(['id' => $db->lastInsertId()]);
    exit;
}

if ($method === 'PUT' && $id) {
    $stmt = $db->prepare("
        UPDATE dishes SET category_id=?, name_fr=?, name_en=?, price=?,
        description_fr=?, image_path=?, is_featured=?, display_order=?, is_active=?, updated_at=NOW()
        WHERE id=?
    ");
    $stmt->execute([
        (int)($data['category_id'] ?? 0),
        $data['name_fr'] ?? '',
        $data['name_en'] ?? null,
        (float)($data['price'] ?? 0),
        $data['description_fr'] ?? null,
        $data['image_path'] ?? null,
        (int)($data['is_featured'] ?? 0),
        (int)($data['display_order'] ?? 0),
        (int)($data['is_active'] ?? 1),
        $id,
    ]);
    echo json_encode(['success' => true]);
    exit;
}

if ($method === 'DELETE' && $id) {
    $stmt = $db->prepare("DELETE FROM dishes WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Bad request']);
