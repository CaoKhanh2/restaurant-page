<?php
session_start();
if (!isset($_SESSION['admin'])) {
    header('Location: /index.php');
    exit;
}

// Determine active nav item from current script path
$currentPage = basename($_SERVER['PHP_SELF'], '.php');
$currentDir  = basename(dirname($_SERVER['PHP_SELF']));
function isActive(string $match, string $page, string $dir): string {
    return ($page === $match || ($dir === 'pages' && $page === $match)) ? 'active' : '';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= htmlspecialchars($pageTitle ?? 'Admin') ?> — Restaurant Admin</title>
<link rel="stylesheet" href="/assets/css/admin.css?v=2">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
</head>
<body>
<div class="admin-layout">

  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-logo">
      <h2>🍜 Les 4 Saisons</h2>
      <p>Restaurant Admin</p>
    </div>
    <nav class="sidebar-nav">
      <a href="/dashboard.php" class="nav-item <?= isActive('dashboard', $currentPage, $currentDir) ?>">
        <span class="icon">🏠</span> Dashboard
      </a>
      <a href="/pages/reservations.php" class="nav-item <?= isActive('reservations', $currentPage, $currentDir) ?>">
        <span class="icon">📅</span> Reservations
      </a>
      <a href="/pages/menu.php" class="nav-item <?= isActive('menu', $currentPage, $currentDir) ?>">
        <span class="icon">🍜</span> Menu
      </a>
      <a href="/pages/gallery.php" class="nav-item <?= isActive('gallery', $currentPage, $currentDir) ?>">
        <span class="icon">🖼️</span> Gallery
      </a>
      <a href="/pages/banners.php" class="nav-item <?= isActive('banners', $currentPage, $currentDir) ?>">
        <span class="icon">📣</span> Banners
      </a>
      <a href="/pages/analytics.php" class="nav-item <?= isActive('analytics', $currentPage, $currentDir) ?>">
        <span class="icon">📊</span> Analytics
      </a>
    </nav>
    <div class="sidebar-footer">
      <button class="btn-logout" onclick="adminLogout()">
        <span>🚪</span> Logout
      </button>
    </div>
  </aside>

  <!-- Main content -->
  <main class="main-content">
    <div class="page-header">
      <h1><?= htmlspecialchars($pageTitle ?? 'Dashboard') ?></h1>
      <?php if (!empty($pageActions)): ?>
        <div class="flex gap-8"><?= $pageActions ?></div>
      <?php endif; ?>
    </div>
    <div class="page-body">
