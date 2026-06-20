<?php
$pageTitle   = 'Dashboard';
$pageActions = '';
$pageScript  = <<<'JS'
(async () => {
  // Load stats
  const data = await api('/admin/api/analytics.php?period=week');
  if (!data) return;

  document.getElementById('stat-today').textContent = data.today;
  document.getElementById('stat-week').textContent  = data.this_week;
  document.getElementById('stat-res').textContent   = data.pending_res;

  // Chart — visitors last 7 days
  const ctx = document.getElementById('visitorChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.timeline.map(r => r.label),
      datasets: [{
        label: 'Visitors',
        data:  data.timeline.map(r => r.visits),
        fill: true,
        tension: 0.4,
        borderColor: '#c9a84c',
        backgroundColor: 'rgba(201,168,76,.12)',
        pointBackgroundColor: '#c9a84c',
        pointRadius: 4,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    },
  });

  // Recent reservations
  const rData = await api('/admin/api/reservations.php?limit=5');
  if (!rData) return;
  const tbody = document.getElementById('res-tbody');
  if (!rData.reservations.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#999">No reservations yet</td></tr>';
    return;
  }
  tbody.innerHTML = rData.reservations.map(r => `
    <tr>
      <td>${r.nom} ${r.prenom}</td>
      <td>${r.email}</td>
      <td>${r.reservation_date || '—'}</td>
      <td><span class="badge badge-${r.status}">${r.status}</span></td>
      <td>${new Date(r.created_at).toLocaleDateString()}</td>
    </tr>
  `).join('');
})();
JS;
require_once __DIR__ . '/includes/header.php';
?>

<!-- Stats -->
<div class="stats-grid">
  <div class="stat-card accent">
    <div class="stat-icon">👁️</div>
    <div class="stat-value" id="stat-today">—</div>
    <div class="stat-label">Visitors today</div>
  </div>
  <div class="stat-card accent">
    <div class="stat-icon">📈</div>
    <div class="stat-value" id="stat-week">—</div>
    <div class="stat-label">Visitors this week</div>
  </div>
  <div class="stat-card accent">
    <div class="stat-icon">📅</div>
    <div class="stat-value" id="stat-res">—</div>
    <div class="stat-label">Pending reservations</div>
  </div>
</div>

<div class="grid-2">
  <!-- Visitor chart -->
  <div class="card">
    <div class="card-title">Visitors — Last 7 days</div>
    <div class="chart-container">
      <canvas id="visitorChart"></canvas>
    </div>
  </div>

  <!-- Quick links -->
  <div class="card">
    <div class="card-title">Quick Actions</div>
    <div style="display:flex;flex-direction:column;gap:10px;margin-top:8px">
      <a href="/admin/pages/reservations.php" class="btn btn-secondary">📅 View all reservations</a>
      <a href="/admin/pages/menu.php"         class="btn btn-secondary">🍜 Manage menu</a>
      <a href="/admin/pages/gallery.php"      class="btn btn-secondary">🖼️ Manage gallery</a>
      <a href="/admin/pages/banners.php"      class="btn btn-secondary">📣 Manage banners</a>
      <a href="/admin/pages/analytics.php"    class="btn btn-secondary">📊 Full analytics</a>
    </div>
  </div>
</div>

<!-- Recent reservations -->
<div class="card">
  <div class="flex-between" style="margin-bottom:16px">
    <div class="card-title" style="margin-bottom:0">Recent Reservations</div>
    <a href="/admin/pages/reservations.php" class="btn btn-sm btn-secondary">View all →</a>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Name</th><th>Email</th><th>Date</th><th>Status</th><th>Received</th></tr></thead>
      <tbody id="res-tbody">
        <tr><td colspan="5" style="text-align:center;color:#999">Loading…</td></tr>
      </tbody>
    </table>
  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
