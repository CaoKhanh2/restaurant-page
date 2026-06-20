<?php
session_start();
if (!isset($_SESSION['admin'])) { http_response_code(401); echo json_encode(['error'=>'Unauthorized']); exit; }

require_once __DIR__ . '/../../config/db.php';
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') { http_response_code(405); exit; }

$db     = getDB();
$period = $_GET['period'] ?? 'week'; // day | week | month

$intervals = [
    'day'   => ['days' => 1,  'group' => '%H:00',    'label' => 'hour'],
    'week'  => ['days' => 7,  'group' => '%Y-%m-%d', 'label' => 'date'],
    'month' => ['days' => 30, 'group' => '%Y-%m-%d', 'label' => 'date'],
];
$cfg = $intervals[$period] ?? $intervals['week'];

// Visitors over time
$stmt = $db->prepare("
    SELECT DATE_FORMAT(visited_at, ?) AS label, COUNT(*) AS visits
    FROM analytics
    WHERE visited_at >= NOW() - INTERVAL ? DAY
    GROUP BY label
    ORDER BY label ASC
");
$stmt->execute([$cfg['group'], $cfg['days']]);
$timeline = $stmt->fetchAll();

// Top pages
$stmt2 = $db->prepare("
    SELECT page_url, COUNT(*) AS visits
    FROM analytics
    WHERE visited_at >= NOW() - INTERVAL ? DAY
    GROUP BY page_url
    ORDER BY visits DESC
    LIMIT 10
");
$stmt2->execute([$cfg['days']]);
$topPages = $stmt2->fetchAll();

// Today total
$todayCount = $db->query("SELECT COUNT(*) FROM analytics WHERE DATE(visited_at) = CURDATE()")->fetchColumn();

// This week total
$weekCount = $db->query("SELECT COUNT(*) FROM analytics WHERE visited_at >= NOW() - INTERVAL 7 DAY")->fetchColumn();

// Pending reservations
$pendingRes = $db->query("SELECT COUNT(*) FROM reservations WHERE status = 'pending'")->fetchColumn();

echo json_encode([
    'timeline'    => $timeline,
    'top_pages'   => $topPages,
    'today'       => (int)$todayCount,
    'this_week'   => (int)$weekCount,
    'pending_res' => (int)$pendingRes,
]);
