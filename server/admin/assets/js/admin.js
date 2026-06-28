// Shared admin utilities. Loaded after Vue/Chart.js and before page scripts.

async function api(url, opts = {}) {
  const headers = { ...(opts.headers || {}) };

  if (!(opts.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, { ...opts, headers });

  if (res.status === 401) {
    location.href = '/index.php';
    return null;
  }

  if (res.status === 204) {
    return null;
  }

  const type = res.headers.get('content-type') || '';
  const data = type.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof data === 'object' && data && data.error ? data.error : `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

async function adminLogout() {
  try {
    await api('/api/auth.php', { method: 'DELETE' });
  } finally {
    location.href = '/index.php';
  }
}

function openModal(title, bodyHtml, footerHtml = '') {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  document.getElementById('modal-footer').innerHTML = footerHtml;
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `alert alert-${type} toast`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function confirmDelete(msg, callback) {
  openModal('Confirm Delete',
    `<p>${escapeHtml(msg)}</p>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
     <button class="btn btn-danger" onclick="closeModal();(${callback.toString()})()">Delete</button>`
  );
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[char]));
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCurrency(value) {
  const number = Number(value || 0);
  return `CHF ${number.toFixed(2)}`;
}

function statusLabel(value) {
  return value ? String(value).charAt(0).toUpperCase() + String(value).slice(1) : '-';
}

// Simple table search filter kept for legacy markup and fallbacks.
function filterTable(inputEl, tableId) {
  const q = inputEl.value.toLowerCase();
  document.querySelectorAll(`#${tableId} tbody tr`).forEach(tr => {
    tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

window.adminApi = api;
window.adminToast = toast;
window.adminEscapeHtml = escapeHtml;
window.adminFormatDate = formatDate;
window.adminFormatDateTime = formatDateTime;
window.adminFormatCurrency = formatCurrency;
window.adminStatusLabel = statusLabel;
