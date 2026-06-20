<?php
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json; charset=utf-8');

// ── 1) Siết CORS: chỉ cho origin của site (bỏ '*') ──────────────
$allowedOrigins = [
    'https://les-4saisonsgeneve.ch',
    'https://www.les-4saisonsgeneve.ch',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// ── 2) Giới hạn kích thước payload thô (chống body khổng lồ) ─────
$raw = file_get_contents('php://input');
if (strlen($raw) > 8000) {
    http_response_code(413);
    echo json_encode(['error' => 'Payload too large']);
    exit;
}
$data = json_decode($raw, true);
if (!is_array($data)) { $data = $_POST; }

// ── 3) Honeypot: field ẩn 'website' — người thật để trống, bot hay điền ──
if (trim((string)($data['website'] ?? '')) !== '') {
    http_response_code(201);                 // giả thành công để bot không dò ra
    echo json_encode(['success' => true]);
    exit;
}

// ── 4) Time-trap nhẹ: submit < 2s sau khi mở form ⇒ nghi bot ────
$formTime = isset($data['form_time']) ? (int)$data['form_time'] : null; // ms kể từ lúc load
if ($formTime !== null && $formTime >= 0 && $formTime < 2000) {
    http_response_code(201);                 // giả thành công
    echo json_encode(['success' => true]);
    exit;
}

// ── 5) Rate-limit per IP: tối đa 5 lần / giờ (file-based, có khoá) ──
function rate_limit_ok(string $key, int $max, int $windowSec): bool {
    $dir = sys_get_temp_dir() . '/r4s_rl';
    if (!is_dir($dir)) { @mkdir($dir, 0700, true); }
    $file = $dir . '/' . hash('sha256', $key) . '.json';
    $now  = time();
    $fp = @fopen($file, 'c+');
    if (!$fp) { return true; }                // không ghi được → đừng chặn oan
    @flock($fp, LOCK_EX);
    $content = stream_get_contents($fp);
    $hits = $content ? (json_decode($content, true) ?: []) : [];
    $hits = array_values(array_filter($hits, fn($t) => $t > $now - $windowSec));
    $ok = count($hits) < $max;
    if ($ok) {
        $hits[] = $now;
        @ftruncate($fp, 0); @rewind($fp); @fwrite($fp, json_encode($hits));
    }
    @flock($fp, LOCK_UN);
    @fclose($fp);
    return $ok;
}

$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ip = trim(explode(',', $ip)[0]); // lấy IP client đầu tiên nếu có chuỗi proxy
if (!rate_limit_ok('resv:' . $ip, 5, 3600)) {
    http_response_code(429);
    header('Retry-After: 3600');
    echo json_encode(['error' => 'Trop de demandes. Réessayez plus tard ou appelez-nous.']);
    exit;
}

// ── 6) Validate + giới hạn độ dài từng field ───────────────────
$nom    = mb_substr(trim((string)($data['nom']     ?? '')), 0, 80);
$prenom = mb_substr(trim((string)($data['prenom']  ?? '')), 0, 80);
$email  = mb_substr(trim((string)($data['email']   ?? '')), 0, 120);
$objet  = mb_substr(trim((string)($data['objet']   ?? '')), 0, 150);
$msg    = mb_substr(trim((string)($data['message'] ?? '')), 0, 2000);
$nbp    = isset($data['nb_personnes']) && $data['nb_personnes'] !== '' ? (int)$data['nb_personnes'] : null;
$date   = $data['reservation_date'] ?? null;

if (!$nom || !$prenom || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['error' => 'Nom, prénom et un e-mail valide sont requis']);
    exit;
}
if ($nbp !== null && ($nbp < 1 || $nbp > 50)) { $nbp = null; }
if ($date && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) { $date = null; }

// ── 7) Lưu (prepared statement) ────────────────────────────────
$db = getDB();
$stmt = $db->prepare("
    INSERT INTO reservations (nom, prenom, email, objet, message, nb_personnes, reservation_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
");
$stmt->execute([$nom, $prenom, $email, $objet ?: null, $msg ?: null, $nbp, $date]);

http_response_code(201);
echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
