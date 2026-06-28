<?php
$pageTitle   = 'Gallery';
$pageActions = '';
$pageScript  = <<<'JS'
(() => {
  Vue.createApp({
    data() {
      return {
        loading: true,
        uploading: false,
        dragging: false,
        error: '',
        images: [],
      };
    },
    computed: {
      activeCount() {
        return this.images.filter((image) => Number(image.is_active) === 1).length;
      },
    },
    methods: {
      async loadGallery() {
        this.loading = true;
        this.error = '';
        try {
          const data = await adminApi('/api/gallery.php');
          this.images = data.images || [];
        } catch (error) {
          this.error = error.message || 'Could not load gallery.';
        } finally {
          this.loading = false;
        }
      },
      chooseFiles() {
        this.$refs.fileInput.click();
      },
      handleDrop(event) {
        this.dragging = false;
        this.uploadFiles(event.dataTransfer.files);
      },
      async handleInput(event) {
        await this.uploadFiles(event.target.files);
        event.target.value = '';
      },
      async uploadFiles(fileList) {
        const files = Array.from(fileList || []);
        if (!files.length) return;

        this.uploading = true;
        for (const file of files) {
          if (!file.type.startsWith('image/')) {
            adminToast('Only image files are allowed', 'error');
            continue;
          }

          const form = new FormData();
          form.append('image', file);
          form.append('alt_text', file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));

          try {
            await adminApi('/api/gallery.php', { method: 'POST', body: form });
            adminToast(`Uploaded ${file.name}`);
          } catch (error) {
            adminToast(error.message || `Could not upload ${file.name}`, 'error');
          }
        }
        this.uploading = false;
        await this.loadGallery();
      },
      async toggleImage(image) {
        const previous = Number(image.is_active) === 1 ? 1 : 0;
        image.is_active = previous ? 0 : 1;
        try {
          await adminApi(`/api/gallery.php?id=${image.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              alt_text: image.alt_text || null,
              display_order: Number(image.display_order || 0),
              is_active: image.is_active ? 1 : 0,
            }),
          });
          adminToast(image.is_active ? 'Image visible' : 'Image hidden');
        } catch (error) {
          image.is_active = previous;
          adminToast(error.message || 'Could not update image', 'error');
        }
      },
      deleteImage(image) {
        confirmDelete('Remove this image from the gallery?', async () => {
          try {
            await adminApi(`/api/gallery.php?id=${image.id}`, { method: 'DELETE' });
            this.images = this.images.filter((item) => item.id !== image.id);
            adminToast('Image removed', 'error');
          } catch (error) {
            adminToast(error.message || 'Could not delete image', 'error');
          }
        });
      },
    },
    mounted() {
      this.loadGallery();
    },
  }).mount('#gallery-app');
})();
JS;
require_once __DIR__ . '/../includes/header.php';
?>

<div id="gallery-app" class="admin-vue-page" v-cloak>
  <div class="toolbar">
    <div>
      <p class="eyebrow">Public gallery</p>
      <h2>Restaurant photos</h2>
    </div>
    <div class="toolbar-actions">
      <span class="refresh-note">{{ activeCount }} visible / {{ images.length }} total</span>
      <button class="btn btn-secondary" type="button" @click="loadGallery">
        <i class="fa-solid fa-rotate"></i>
        Refresh
      </button>
    </div>
  </div>

  <div class="card upload-card">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Upload</p>
        <h3>Add gallery images</h3>
      </div>
      <span class="text-muted small">JPG, PNG, WebP, GIF</span>
    </div>
    <div
      class="upload-zone"
      :class="{ dragover: dragging }"
      @click="chooseFiles"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="handleDrop"
    >
      <input ref="fileInput" type="file" accept="image/*" multiple @change="handleInput">
      <i class="fa-solid fa-cloud-arrow-up upload-icon"></i>
      <strong>{{ uploading ? 'Uploading images...' : 'Drop images here or click to browse' }}</strong>
      <span>Multiple files supported</span>
    </div>
  </div>

  <div v-if="error" class="alert alert-error">{{ error }}</div>
  <div v-if="loading" class="loading-panel"><i class="fa-solid fa-circle-notch spin"></i> Loading gallery...</div>

  <div v-else class="card">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Gallery</p>
        <h3>Visible website imagery</h3>
      </div>
      <span class="badge badge-active">{{ images.length }} images</span>
    </div>

    <div v-if="!images.length" class="empty-state">
      <i class="fa-regular fa-images"></i>
      <strong>No images yet.</strong>
      <span>Upload restaurant photos to populate the public gallery.</span>
    </div>

    <div v-else class="img-grid admin-gallery-grid">
      <article v-for="image in images" :key="image.id" class="img-item">
        <img :src="image.image_path" :alt="image.alt_text || ''">
        <div class="img-actions">
          <button class="icon-button" type="button" :class="{ success: Number(image.is_active) === 1 }" :title="Number(image.is_active) === 1 ? 'Hide image' : 'Show image'" @click="toggleImage(image)">
            <i class="fa-solid" :class="Number(image.is_active) === 1 ? 'fa-eye' : 'fa-eye-slash'"></i>
          </button>
          <button class="icon-button danger" type="button" title="Delete" @click="deleteImage(image)">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
        <div class="image-caption">{{ image.alt_text || 'Untitled image' }}</div>
      </article>
    </div>
  </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
