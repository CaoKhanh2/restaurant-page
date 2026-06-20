<?php
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Cache-Control: public, max-age=60');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$db = getDB();
$category = $_GET['category'] ?? null;

if ($category) {
    // Single category
    $stmt = $db->prepare("
        SELECT d.id, d.name_fr, d.name_en, d.price, d.description_fr,
               d.image_path, d.is_featured, d.display_order,
               c.category_key, c.title_fr, c.title_en
        FROM dishes d
        JOIN categories c ON d.category_id = c.id
        WHERE c.category_key = ? AND d.is_active = 1
        ORDER BY d.display_order ASC, d.id ASC
    ");
    $stmt->execute([$category]);
    $dishes = $stmt->fetchAll();
    echo json_encode(['dishes' => $dishes]);
} else {
    // All categories with their dishes
    $cats = $db->query("SELECT * FROM categories ORDER BY display_order ASC")->fetchAll();
    $stmt = $db->prepare("
        SELECT d.id, d.name_fr, d.name_en, d.price, d.description_fr,
               d.image_path, d.is_featured, d.display_order, d.category_id
        FROM dishes d
        WHERE d.is_active = 1
        ORDER BY d.display_order ASC, d.id ASC
    ");
    $stmt->execute();
    $allDishes = $stmt->fetchAll();

    // Group dishes by category
    $byCategory = [];
    foreach ($allDishes as $dish) {
        $byCategory[$dish['category_id']][] = $dish;
    }

    $result = [];
    foreach ($cats as $cat) {
        $result[] = [
            'key'      => $cat['category_key'],
            'title_fr' => $cat['title_fr'],
            'title_en' => $cat['title_en'],
            'order'    => (int) $cat['display_order'],
            'dishes'   => $byCategory[$cat['id']] ?? [],
        ];
    }

    echo json_encode(['categories' => $result]);
}
