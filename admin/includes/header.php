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
<title><?= htmlspecialchars($pageTitle ?? 'Admin') ?> - Restaurant Admin</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
<link rel="stylesheet" href="/assets/css/admin.css?v=3">
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
</head>
<body>
<div class="admin-layout">

  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-logo">
      <h2>Les 4 Saisons</h2>
      <p>Restaurant Admin</p>
    </div>
    <nav class="sidebar-nav">
      <a href="/dashboard.php" class="nav-item <?= isActive('dashboard', $currentPage, $currentDir) ?>">
        <span class="icon"><i class="fa-solid fa-gauge-high"></i></span> Dashboard
      </a>
      <a href="/pages/reservations.php" class="nav-item <?= isActive('reservations', $currentPage, $currentDir) ?>">
        <span class="icon"><i class="fa-solid fa-calendar-check"></i></span> Reservations
      </a>
      <a href="/pages/menu.php" class="nav-item <?= isActive('menu', $currentPage, $currentDir) ?>">
        <span class="icon"><i class="fa-solid fa-utensils"></i></span> Menu
      </a>
      <a href="/pages/gallery.php" class="nav-item <?= isActive('gallery', $currentPage, $currentDir) ?>">
        <span class="icon"><i class="fa-solid fa-images"></i></span> Gallery
      </a>
      <a href="/pages/banners.php" class="nav-item <?= isActive('banners', $currentPage, $currentDir) ?>">
        <span class="icon"><i class="fa-solid fa-bullhorn"></i></span> Banners
      </a>
      <a href="/pages/analytics.php" class="nav-item <?= isActive('analytics', $currentPage, $currentDir) ?>">
        <span class="icon"><i class="fa-solid fa-chart-line"></i></span> Analytics
      </a>
    </nav>
    <div class="sidebar-footer">
      <button class="btn-logout" onclick="adminLogout()">
        <span><i class="fa-solid fa-arrow-right-from-bracket"></i></span> Logout
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
