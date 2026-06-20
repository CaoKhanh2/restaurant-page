<?php
session_start();
if (!isset($_SESSION['admin'])) { http_response_code(401); echo json_encode(['error'=>'Unauthorized']); exit; }

require_once __DIR__ . '/../../config/db.php';
header('Content-Type: application/json; charset=utf-8');

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;

if ($method === 'GET') {
    $rows = $db->query("SELECT * FROM gallery ORDER BY display_order, id")->fetchAll();
    echo json_encode(['images' => $rows]);
    exit;
}

if ($method === 'POST') {
    // File upload
    if (!isset($_FILES['image'])) {
        http_response_code(422);
        echo json_encode(['error' => 'No file uploaded']);
        exit;
    }

    $file    = $_FILES['image'];
    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
    $finfo   = new finfo(FILEINFO_MIME_TYPE);
    $mime    = $finfo->file($file['tmp_name']);

    if (!isset($allowed[$mime])) {
        http_response_code(422);
        echo json_encode(['error' => 'Only JPG, PNG, WebP, GIF allowed']);
        exit;
    }

    $uploadDir = __DIR__ . '/../../uploads/gallery/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    $filename  = bin2hex(random_bytes(12)) . '.' . $allowed[$mime];
    $dest      = $uploadDir . $filename;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        http_response_code(500);
        echo json_encode(['error' => 'Upload failed']);
        exit;
    }

    $altText  = trim($_POST['alt_text'] ?? '');
    $order    = (int)($_POST['display_order'] ?? 0);
    $imgPath  = '/uploads/gallery/' . $filename;

    $stmt = $db->prepare("INSERT INTO gallery (image_path, alt_text, display_order) VALUES (?, ?, ?)");
    $stmt->execute([$imgPath, $altText ?: null, $order]);

    http_response_code(201);
    echo json_encode(['id' => $db->lastInsertId(), 'image_path' => $imgPath]);
    exit;
}

if ($method === 'PUT' && $id) {
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $stmt = $db->prepare("UPDATE gallery SET alt_text=?, display_order=?, is_active=? WHERE id=?");
    $stmt->execute([
        $data['alt_text'] ?? null,
        (int)($data['display_order'] ?? 0),
        (int)($data['is_active'] ?? 1),
        $id,
    ]);
    echo json_encode(['success' => true]);
    exit;
}

if ($method === 'DELETE' && $id) {
    $stmt = $db->prepare("SELECT image_path FROM gallery WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();

    if ($row) {
        $filePath = __DIR__ . '/../../' . ltrim($row['image_path'], '/');
        if (file_exists($filePath)) unlink($filePath);
    }

    $stmt = $db->prepare("DELETE FROM gallery WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Bad request']);
