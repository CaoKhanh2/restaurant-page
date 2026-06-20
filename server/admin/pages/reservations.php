<?php
$pageTitle   = 'Reservations';
$pageActions = '<input type="text" class="form-control" style="width:220px" placeholder="Search…" oninput="filterTable(this,\'res-table\')">';
$pageScript  = <<<'JS'
let reservations = [];

async function loadReservations(status = '') {
  const url = '/admin/api/reservations.php' + (status ? `?status=${status}` : '');
  const data = await api(url);
  if (!data) return;
  reservations = data.reservations;
  renderTable();
  document.getElementById('total-count').textContent = `${data.total} total`;
}

function renderTable() {
  const tbody = document.getElementById('res-tbody');
  if (!reservations.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#999;padding:32px">No reservations found</td></tr>';
    return;
  }
  tbody.innerHTML = reservations.map(r => `
    <tr>
      <td><strong>${r.nom} ${r.prenom}</strong></td>
      <td><a href="mailto:${r.email}">${r.email}</a></td>
      <td>${r.objet || '—'}</td>
      <td>${r.reservation_date || '—'}</td>
      <td>${r.nb_personnes || '—'}</td>
      <td><span class="badge badge-${r.status}">${r.status}</span></td>
      <td>
        <div class="flex gap-8">
          ${r.status !== 'confirmed'  ? `<button class="btn btn-sm btn-success" onclick="setStatus(${r.id},'confirmed')">✓</button>` : ''}
          ${r.status !== 'cancelled'  ? `<button class="btn btn-sm btn-danger"  onclick="setStatus(${r.id},'cancelled')">✗</button>` : ''}
          ${r.status !== 'pending'    ? `<button class="btn btn-sm btn-secondary" onclick="setStatus(${r.id},'pending')">↩</button>` : ''}
          <button class="btn btn-sm btn-danger" onclick="deleteRes(${r.id})">🗑</button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function setStatus(id, status) {
  const res = await api(`/admin/api/reservations.php?id=${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  if (res) { toast(`Marked as ${status}`); loadReservations(); }
}

function deleteRes(id) {
  confirmDelete('Delete this reservation?', async () => {
    const res = await api(`/admin/api/reservations.php?id=${id}`, { method: 'DELETE' });
    if (res) { toast('Deleted', 'error'); loadReservations(); }
  });
}

// Filter tabs
document.querySelectorAll('[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadReservations(btn.dataset.filter);
  });
});

loadReservations();
JS;
require_once __DIR__ . '/../includes/header.php';
?>

<div class="flex-between" style="margin-bottom:20px">
  <div class="tab-bar" style="margin-bottom:0">
    <button class="tab active" data-filter="">All</button>
    <button class="tab" data-filter="pending">Pending</button>
    <button class="tab" data-filter="confirmed">Confirmed</button>
    <button class="tab" data-filter="cancelled">Cancelled</button>
  </div>
  <span class="text-muted" style="font-size:.82rem" id="total-count"></span>
</div>

<div class="card">
  <div class="table-wrap">
    <table id="res-table">
      <thead>
        <tr>
          <th>Name</th><th>Email</th><th>Subject</th>
          <th>Date</th><th>Persons</th><th>Status</th><th>Actions</th>
        </tr>
      </thead>
      <tbody id="res-tbody">
        <tr><td colspan="7" style="text-align:center;padding:32px;color:#999">Loading…</td></tr>
      </tbody>
    </table>
  </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
