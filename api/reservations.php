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
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    $data = $_POST;
}

$nom    = trim($data['nom']    ?? '');
$prenom = trim($data['prenom'] ?? '');
$email  = trim($data['email']  ?? '');
$objet  = trim($data['objet']  ?? '');
$msg    = trim($data['message'] ?? '');
$nbp    = isset($data['nb_personnes']) ? (int)$data['nb_personnes'] : null;
$date   = $data['reservation_date'] ?? null;

if (!$nom || !$prenom || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['error' => 'Nom, prénom and valid email are required']);
    exit;
}

if ($date && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    $date = null;
}

$db = getDB();
$stmt = $db->prepare("
    INSERT INTO reservations (nom, prenom, email, objet, message, nb_personnes, reservation_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
");
$stmt->execute([$nom, $prenom, $email, $objet ?: null, $msg ?: null, $nbp, $date]);

http_response_code(201);
echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
