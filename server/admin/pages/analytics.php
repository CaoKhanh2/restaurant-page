<?php
$pageTitle  = 'Analytics';
$pageScript = <<<'JS'
let chart;

async function loadAnalytics(period = 'week') {
  document.querySelectorAll('[data-period]').forEach(b => b.classList.toggle('active', b.dataset.period === period));
  const data = await api(`/admin/api/analytics.php?period=${period}`);
  if (!data) return;

  document.getElementById('stat-today').textContent = data.today;
  document.getElementById('stat-week').textContent  = data.this_week;
  document.getElementById('stat-res').textContent   = data.pending_res;

  // Timeline chart
  if (chart) chart.destroy();
  const ctx = document.getElementById('visitorChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.timeline.map(r => r.label),
      datasets: [{
        label: 'Visitors',
        data:  data.timeline.map(r => r.visits),
        backgroundColor: 'rgba(201,168,76,.7)',
        borderColor: '#c9a84c',
        borderWidth: 1,
        borderRadius: 4,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    },
  });

  // Top pages
  const tbody = document.getElementById('pages-tbody');
  if (!data.top_pages.length) {
    tbody.innerHTML = '<tr><td colspan="2" style="text-align:center;color:#999">No data yet</td></tr>';
    return;
  }
  const max = data.top_pages[0].visits;
  tbody.innerHTML = data.top_pages.map(p => `
    <tr>
      <td>
        <div style="font-family:monospace;font-size:.82rem">${p.page_url}</div>
        <div style="background:rgba(201,168,76,.25);height:4px;border-radius:2px;margin-top:4px;width:${Math.round(p.visits/max*100)}%"></div>
      </td>
      <td style="text-align:right;font-weight:600">${p.visits}</td>
    </tr>
  `).join('');
}

document.querySelectorAll('[data-period]').forEach(btn => {
  btn.addEventListener('click', () => loadAnalytics(btn.dataset.period));
});

loadAnalytics('week');
JS;
require_once __DIR__ . '/../includes/header.php';
?>

<div class="stats-grid" style="margin-bottom:24px">
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

<div class="card" style="margin-bottom:20px">
  <div class="flex-between" style="margin-bottom:16px">
    <div class="card-title" style="margin-bottom:0">Visitor Traffic</div>
    <div class="tab-bar" style="margin-bottom:0">
      <button class="tab" data-period="day">Today</button>
      <button class="tab active" data-period="week">7 Days</button>
      <button class="tab" data-period="month">30 Days</button>
    </div>
  </div>
  <div class="chart-container">
    <canvas id="visitorChart"></canvas>
  </div>
</div>

<div class="card">
  <div class="card-title">Top Pages</div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Page</th><th style="text-align:right">Visits</th></tr></thead>
      <tbody id="pages-tbody">
        <tr><td colspan="2" style="text-align:center;padding:24px;color:#999">Loading…</td></tr>
      </tbody>
    </table>
  </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
