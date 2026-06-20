<?php
$pageTitle   = 'Menu Management';
$pageActions = '<button class="btn btn-primary" onclick="openDishModal()">+ Add Dish</button>';
$pageScript  = <<<'JS'
let allDishes = [], categories = [], currentCat = '';

async function loadMenu() {
  const data = await api('/admin/api/menu.php');
  if (!data) return;
  allDishes  = data.dishes;
  categories = data.categories;
  buildTabs();
  renderDishes();
}

function buildTabs() {
  const bar = document.getElementById('cat-tabs');
  bar.innerHTML = `<button class="tab active" onclick="filterCat('',this)">All (${allDishes.length})</button>`;
  categories.forEach(c => {
    const count = allDishes.filter(d => d.category_id == c.id).length;
    bar.innerHTML += `<button class="tab" onclick="filterCat('${c.id}',this)">${c.title_fr} (${count})</button>`;
  });
}

function filterCat(catId, btn) {
  currentCat = catId;
  document.querySelectorAll('#cat-tabs .tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderDishes();
}

function renderDishes() {
  const list = currentCat ? allDishes.filter(d => d.category_id == currentCat) : allDishes;
  const tbody = document.getElementById('dish-tbody');
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#999;padding:32px">No dishes found</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(d => `
    <tr>
      <td>${d.image_path ? `<img src="${d.image_path}" class="dish-img" onerror="this.style.display='none'">` : '—'}</td>
      <td>
        <strong>${d.name_fr}</strong>
        ${d.is_featured ? '<span style="color:#c9a84c;font-size:.75rem"> ⭐</span>' : ''}
        ${d.name_en ? `<div class="text-muted" style="font-size:.78rem">${d.name_en}</div>` : ''}
      </td>
      <td>${d.category_title || '—'}</td>
      <td><strong>CHF ${parseFloat(d.price).toFixed(2)}</strong></td>
      <td>
        <label class="toggle">
          <input type="checkbox" ${d.is_active ? 'checked' : ''} onchange="toggleDish(${d.id}, this.checked)">
          <span class="toggle-slider"></span>
        </label>
      </td>
      <td><span class="badge badge-${d.is_featured ? 'confirmed' : 'inactive'}">${d.is_featured ? 'Featured' : 'Normal'}</span></td>
      <td>
        <div class="flex gap-8">
          <button class="btn btn-sm btn-secondary" onclick="openDishModal(${d.id})">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="deleteDish(${d.id}, '${d.name_fr.replace(/'/g,"\\'")}')">🗑</button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function toggleDish(id, active) {
  const dish = allDishes.find(d => d.id == id);
  if (!dish) return;
  await api(`/admin/api/menu.php?id=${id}`, { method: 'PUT', body: JSON.stringify({ ...dish, is_active: active ? 1 : 0 }) });
  dish.is_active = active ? 1 : 0;
  toast(active ? 'Dish enabled' : 'Dish hidden');
}

function openDishModal(id = null) {
  const dish = id ? allDishes.find(d => d.id == id) : null;
  const catOptions = categories.map(c =>
    `<option value="${c.id}" ${dish?.category_id == c.id ? 'selected' : ''}>${c.title_fr}</option>`
  ).join('');

  const body = `
    <form id="dish-form">
      <input type="hidden" name="id" value="${dish?.id || ''}">
      <div class="grid-2">
        <div class="form-group">
          <label>Name (French) *</label>
          <input name="name_fr" class="form-control" value="${dish?.name_fr || ''}" required>
        </div>
        <div class="form-group">
          <label>Name (English)</label>
          <input name="name_en" class="form-control" value="${dish?.name_en || ''}">
        </div>
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label>Category *</label>
          <select name="category_id" class="form-control" required>${catOptions}</select>
        </div>
        <div class="form-group">
          <label>Price (CHF) *</label>
          <input name="price" type="number" step="0.5" min="0" class="form-control" value="${dish?.price || ''}" required>
        </div>
      </div>
      <div class="form-group">
        <label>Description (French)</label>
        <textarea name="description_fr" class="form-control">${dish?.description_fr || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Image path (e.g. /images/food/food1.jpg)</label>
        <input name="image_path" class="form-control" value="${dish?.image_path || ''}">
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label>Featured (⭐ signature dish)</label>
          <label class="toggle" style="margin-top:8px">
            <input type="checkbox" name="is_featured" ${dish?.is_featured ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="form-group">
          <label>Active (visible on site)</label>
          <label class="toggle" style="margin-top:8px">
            <input type="checkbox" name="is_active" ${dish?.is_active !== 0 ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
    </form>`;

  const footer = `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="saveDish()">Save</button>`;

  openModal(dish ? 'Edit Dish' : 'Add Dish', body, footer);
}

async function saveDish() {
  const form = document.getElementById('dish-form');
  const fd   = new FormData(form);
  const id   = fd.get('id');
  const body = {
    category_id:    parseInt(fd.get('category_id')),
    name_fr:        fd.get('name_fr'),
    name_en:        fd.get('name_en') || null,
    price:          parseFloat(fd.get('price')),
    description_fr: fd.get('description_fr') || null,
    image_path:     fd.get('image_path') || null,
    is_featured:    form.querySelector('[name=is_featured]').checked ? 1 : 0,
    is_active:      form.querySelector('[name=is_active]').checked   ? 1 : 0,
  };
  const res = id
    ? await api(`/admin/api/menu.php?id=${id}`, { method: 'PUT',  body: JSON.stringify(body) })
    : await api(`/admin/api/menu.php`,           { method: 'POST', body: JSON.stringify(body) });
  if (res) { closeModal(); toast(id ? 'Dish updated' : 'Dish added'); loadMenu(); }
}

function deleteDish(id, name) {
  confirmDelete(`Delete "${name}"?`, async () => {
    await api(`/admin/api/menu.php?id=${id}`, { method: 'DELETE' });
    toast('Deleted', 'error');
    loadMenu();
  });
}

// Table search
document.querySelector('[data-search]').addEventListener('input', function() {
  filterTable(this, 'dish-table');
});

loadMenu();
JS;
require_once __DIR__ . '/../includes/header.php';
?>

<div class="flex-between" style="margin-bottom:16px">
  <input type="text" data-search class="form-control" style="width:240px" placeholder="Search dishes…">
</div>

<div class="tab-bar" id="cat-tabs" style="margin-bottom:16px">
  <span class="text-muted" style="font-size:.82rem">Loading categories…</span>
</div>

<div class="card">
  <div class="table-wrap">
    <table id="dish-table">
      <thead>
        <tr><th>Photo</th><th>Name</th><th>Category</th><th>Price</th><th>Active</th><th>Tag</th><th>Actions</th></tr>
      </thead>
      <tbody id="dish-tbody">
        <tr><td colspan="7" style="text-align:center;padding:32px;color:#999">Loading…</td></tr>
      </tbody>
    </table>
  </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
