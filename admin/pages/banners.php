<?php
$pageTitle   = 'Banners & Announcements';
$pageActions = '<button class="btn btn-primary" onclick="openBannerModal()">+ New Banner</button>';
$pageScript  = <<<'JS'
let banners = [];

async function loadBanners() {
  const data = await api('/api/banners.php');
  if (!data) return;
  banners = data.banners;
  renderBanners();
}

function renderBanners() {
  const list = document.getElementById('banner-list');
  if (!banners.length) {
    list.innerHTML = '<p class="text-muted" style="padding:16px">No banners yet.</p>';
    return;
  }
  list.innerHTML = banners.map(b => `
    <div class="flex-between" style="padding:16px;border-bottom:1px solid var(--border)">
      <div style="flex:1">
        <div class="flex gap-8" style="margin-bottom:4px">
          <strong>${b.title || '(no title)'}</strong>
          <span class="badge badge-${b.is_active ? 'active' : 'inactive'}">${b.is_active ? 'Active' : 'Inactive'}</span>
        </div>
        <div class="text-muted" style="font-size:.85rem">${b.message}</div>
        ${b.starts_at ? `<div class="text-muted" style="font-size:.78rem;margin-top:4px">📅 ${b.starts_at} → ${b.ends_at || '∞'}</div>` : ''}
      </div>
      <div class="flex gap-8" style="margin-left:16px">
        <label class="toggle" title="Toggle active">
          <input type="checkbox" ${b.is_active ? 'checked' : ''} onchange="toggleBanner(${b.id}, this.checked)">
          <span class="toggle-slider"></span>
        </label>
        <button class="btn btn-sm btn-secondary" onclick="openBannerModal(${b.id})">✏️</button>
        <button class="btn btn-sm btn-danger"    onclick="deleteBanner(${b.id})">🗑</button>
      </div>
    </div>
  `).join('');
}

async function toggleBanner(id, active) {
  const b = banners.find(x => x.id == id);
  if (!b) return;
  await api(`/api/banners.php?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...b, is_active: active ? 1 : 0 }),
  });
  b.is_active = active ? 1 : 0;
  toast(active ? 'Banner activated' : 'Banner hidden');
}

function openBannerModal(id = null) {
  const b = id ? banners.find(x => x.id == id) : null;
  openModal(b ? 'Edit Banner' : 'New Banner', `
    <form id="banner-form">
      <input type="hidden" name="id" value="${b?.id || ''}">
      <div class="form-group">
        <label>Title (optional)</label>
        <input name="title" class="form-control" value="${b?.title || ''}">
      </div>
      <div class="form-group">
        <label>Message *</label>
        <textarea name="message" class="form-control" required>${b?.message || ''}</textarea>
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label>Start date (optional)</label>
          <input type="datetime-local" name="starts_at" class="form-control" value="${b?.starts_at?.slice(0,16) || ''}">
        </div>
        <div class="form-group">
          <label>End date (optional)</label>
          <input type="datetime-local" name="ends_at" class="form-control" value="${b?.ends_at?.slice(0,16) || ''}">
        </div>
      </div>
      <div class="form-group">
        <label>Active</label>
        <label class="toggle" style="margin-top:8px">
          <input type="checkbox" name="is_active" ${b?.is_active !== 0 ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
      </div>
    </form>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="saveBanner()">Save</button>
  `);
}

async function saveBanner() {
  const form = document.getElementById('banner-form');
  const fd   = new FormData(form);
  const id   = fd.get('id');
  const body = {
    title:     fd.get('title') || null,
    message:   fd.get('message'),
    is_active: form.querySelector('[name=is_active]').checked ? 1 : 0,
    starts_at: fd.get('starts_at') || null,
    ends_at:   fd.get('ends_at')   || null,
  };
  const res = id
    ? await api(`/api/banners.php?id=${id}`, { method: 'PUT',  body: JSON.stringify(body) })
    : await api(`/api/banners.php`,           { method: 'POST', body: JSON.stringify(body) });
  if (res) { closeModal(); toast(id ? 'Banner updated' : 'Banner created'); loadBanners(); }
}

function deleteBanner(id) {
  confirmDelete('Delete this banner?', async () => {
    await api(`/api/banners.php?id=${id}`, { method: 'DELETE' });
    toast('Deleted', 'error');
    loadBanners();
  });
}

loadBanners();
JS;
require_once __DIR__ . '/../includes/header.php';
?>

<div class="card">
  <div class="card-title">Active banners appear on the restaurant website automatically</div>
  <div id="banner-list"><p class="text-muted">Loading…</p></div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
