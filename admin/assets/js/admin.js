// ── Shared admin utilities ──

async function api(url, opts = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  if (res.status === 401) { location.href = '/index.php'; return null; }
  if (res.status === 204) return null;
  return res.json();
}

async function adminLogout() {
  await api('/api/auth.php', { method: 'DELETE' });
  location.href = '/index.php';
}

// Modal
function openModal(title, bodyHtml, footerHtml = '') {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  document.getElementById('modal-footer').innerHTML = footerHtml;
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

// Toast notification
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `alert alert-${type}`;
  el.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;min-width:240px;animation:fadeIn .2s';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// Confirm delete
function confirmDelete(msg, callback) {
  openModal('Confirm Delete',
    `<p>${msg}</p>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
     <button class="btn btn-danger" onclick="closeModal();(${callback.toString()})()">Delete</button>`
  );
}

// Toggle active status via API
async function toggleActive(url, id, field, currentVal, onDone) {
  const val = currentVal ? 0 : 1;
  const res = await api(`${url}?id=${id}`, { method: 'PUT', body: JSON.stringify({ [field]: val }) });
  if (res) { toast('Updated'); if (onDone) onDone(val); }
}

// Simple table search filter
function filterTable(inputEl, tableId) {
  const q = inputEl.value.toLowerCase();
  document.querySelectorAll(`#${tableId} tbody tr`).forEach(tr => {
    tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}
