<?php
$pageTitle   = 'Gallery';
$pageScript  = <<<'JS'
async function loadGallery() {
  const data = await api('/api/gallery.php');
  if (!data) return;
  const grid = document.getElementById('img-grid');
  document.getElementById('img-count').textContent = `${data.images.length} images`;
  if (!data.images.length) {
    grid.innerHTML = '<p class="text-muted">No images yet. Upload one below.</p>';
    return;
  }
  grid.innerHTML = data.images.map(img => `
    <div class="img-item" id="img-${img.id}">
      <img src="${img.image_path}" alt="${img.alt_text || ''}">
      <div class="img-actions">
        <button class="btn btn-sm btn-danger" onclick="deleteImg(${img.id})">🗑 Delete</button>
      </div>
    </div>
  `).join('');
}

async function deleteImg(id) {
  confirmDelete('Remove this image from the gallery?', async () => {
    await api(`/api/gallery.php?id=${id}`, { method: 'DELETE' });
    document.getElementById(`img-${id}`).remove();
    toast('Image removed', 'error');
  });
}

// Upload
const zone  = document.getElementById('upload-zone');
const input = document.getElementById('file-input');

zone.addEventListener('click', () => input.click());
zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
zone.addEventListener('dragleave', ()  => zone.classList.remove('dragover'));
zone.addEventListener('drop', e => {
  e.preventDefault();
  zone.classList.remove('dragover');
  handleFiles(e.dataTransfer.files);
});
input.addEventListener('change', () => handleFiles(input.files));

async function handleFiles(files) {
  for (const file of files) {
    if (!file.type.startsWith('image/')) { toast('Only image files allowed', 'error'); continue; }
    await uploadFile(file);
  }
  loadGallery();
}

async function uploadFile(file) {
  const fd = new FormData();
  fd.append('image', file);
  fd.append('alt_text', file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));

  const res = await fetch('/api/gallery.php', { method: 'POST', body: fd });
  if (res.ok) {
    toast(`Uploaded: ${file.name}`);
  } else {
    const err = await res.json();
    toast(err.error || 'Upload failed', 'error');
  }
}

loadGallery();
JS;
require_once __DIR__ . '/../includes/header.php';
?>

<div class="card" style="margin-bottom:20px">
  <div class="flex-between" style="margin-bottom:16px">
    <div class="card-title" style="margin-bottom:0">Upload Images</div>
    <span class="text-muted" style="font-size:.82rem">JPG, PNG, WebP, GIF — max 10MB</span>
  </div>
  <div class="upload-zone" id="upload-zone">
    <input type="file" id="file-input" accept="image/*" multiple>
    <p style="font-size:1.8rem;margin-bottom:8px">☁️</p>
    <p><strong>Drag & drop images here</strong> or click to browse</p>
    <p class="text-muted" style="font-size:.82rem;margin-top:4px">Multiple files supported</p>
  </div>
</div>

<div class="card">
  <div class="flex-between" style="margin-bottom:16px">
    <div class="card-title" style="margin-bottom:0">Gallery Images</div>
    <span class="text-muted" style="font-size:.82rem" id="img-count">Loading…</span>
  </div>
  <div class="img-grid" id="img-grid">
    <p class="text-muted">Loading…</p>
  </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
