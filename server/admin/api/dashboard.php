<?php
session_start();
if (!isset($_SESSION['admin'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

require_once __DIR__ . '/../../config/db.php';
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$db = getDB();

function fetchCount(PDO $db, string $sql, array $params = []): int
{
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    return (int)$stmt->fetchColumn();
}

function fetchRows(PDO $db, string $sql, array $params = []): array
{
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

$todayStatus = fetchRows($db, "
    SELECT status, COUNT(*) AS total
    FROM reservations
    WHERE reservation_date = CURDATE()
    GROUP BY status
");

$todayCounts = ['pending' => 0, 'confirmed' => 0, 'cancelled' => 0];
foreach ($todayStatus as $row) {
    if (isset($todayCounts[$row['status']])) {
        $todayCounts[$row['status']] = (int)$row['total'];
    }
}

$expectedCovers = fetchCount($db, "
    SELECT COALESCE(SUM(nb_personnes), 0)
    FROM reservations
    WHERE reservation_date = CURDATE()
      AND status <> 'cancelled'
");

$visitorsToday = fetchCount($db, "
    SELECT COUNT(DISTINCT ip_hash)
    FROM analytics
    WHERE visited_at >= CURDATE()
");

$pendingReservations = fetchRows($db, "
    SELECT id, nom, prenom, email, objet, message, nb_personnes, reservation_date, status, created_at
    FROM reservations
    WHERE status = 'pending'
    ORDER BY
      CASE WHEN reservation_date IS NULL THEN 1 ELSE 0 END,
      reservation_date ASC,
      created_at DESC
    LIMIT 8
");

$todayReservations = fetchRows($db, "
    SELECT id, nom, prenom, email, objet, message, nb_personnes, reservation_date, status, created_at
    FROM reservations
    WHERE reservation_date = CURDATE()
    ORDER BY FIELD(status, 'pending', 'confirmed', 'cancelled'), created_at DESC
    LIMIT 12
");

$trafficTimeline = fetchRows($db, "
    SELECT DATE_FORMAT(first_seen, '%Y-%m-%d') AS label, COUNT(*) AS visits
    FROM (
        SELECT ip_hash, MIN(visited_at) AS first_seen
        FROM analytics
        WHERE visited_at >= NOW() - INTERVAL 7 DAY
        GROUP BY ip_hash
    ) unique_visitors
    GROUP BY label
    ORDER BY label ASC
");

$topPages = fetchRows($db, "
    SELECT page_url, COUNT(*) AS visits
    FROM analytics
    WHERE visited_at >= NOW() - INTERVAL 7 DAY
    GROUP BY page_url
    ORDER BY visits DESC
    LIMIT 5
");

$activeBanners = fetchCount($db, "
    SELECT COUNT(*)
    FROM banners
    WHERE is_active = 1
      AND (starts_at IS NULL OR starts_at <= NOW())
      AND (ends_at IS NULL OR ends_at >= NOW())
");

$content = [
    'active_dishes' => fetchCount($db, "SELECT COUNT(*) FROM dishes WHERE is_active = 1"),
    'hidden_dishes' => fetchCount($db, "SELECT COUNT(*) FROM dishes WHERE is_active = 0"),
    'featured_dishes' => fetchCount($db, "SELECT COUNT(*) FROM dishes WHERE is_featured = 1 AND is_active = 1"),
    'active_banners' => $activeBanners,
    'gallery_images' => fetchCount($db, "SELECT COUNT(*) FROM gallery WHERE is_active = 1"),
];

$health = [];
if (count($pendingReservations) > 0) {
    $health[] = ['type' => 'warning', 'message' => count($pendingReservations) . ' pending reservation request(s) need review.'];
}
if ($content['active_banners'] === 0) {
    $health[] = ['type' => 'info', 'message' => 'No active announcement banner is currently visible.'];
}
if ($content['hidden_dishes'] > 0) {
    $health[] = ['type' => 'info', 'message' => $content['hidden_dishes'] . ' menu item(s) are hidden from the public site.'];
}

echo json_encode([
    'generated_at' => date(DATE_ATOM),
    'today' => [
        'date' => date('Y-m-d'),
        'pending_reservations' => $todayCounts['pending'],
        'confirmed_reservations' => $todayCounts['confirmed'],
        'cancelled_reservations' => $todayCounts['cancelled'],
        'expected_covers' => $expectedCovers,
        'visitors' => $visitorsToday,
    ],
    'reservations' => [
        'pending' => $pendingReservations,
        'today' => $todayReservations,
        'total_pending' => fetchCount($db, "SELECT COUNT(*) FROM reservations WHERE status = 'pending'"),
    ],
    'content' => $content,
    'traffic' => [
        'timeline' => $trafficTimeline,
        'top_pages' => $topPages,
    ],
    'health' => $health,
]);
