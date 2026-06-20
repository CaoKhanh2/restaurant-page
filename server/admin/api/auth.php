<?php
require_once __DIR__ . '/../../config/db.php';

session_start();
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$data   = json_decode(file_get_contents('php://input'), true) ?? [];

if ($method === 'POST') {
    // Login
    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';

    if (!$username || !$password) {
        http_response_code(422);
        echo json_encode(['error' => 'Username and password required']);
        exit;
    }

    $db   = getDB();
    $stmt = $db->prepare("SELECT id, password_hash FROM admin_users WHERE username = ? LIMIT 1");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['admin'] = $user['id'];
        echo json_encode(['success' => true]);
    } else {
        // Constant-time to prevent timing attacks
        password_verify('dummy', '$2y$12$dummy.hash.to.waste.time.aaaaaaaaaaaaaaaaaaaaaaaaaa');
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }
    exit;
}

if ($method === 'DELETE') {
    // Logout
    session_destroy();
    echo json_encode(['success' => true]);
    exit;
}

if ($method === 'GET') {
    // Check session
    echo json_encode(['authenticated' => isset($_SESSION['admin'])]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
