<?php
$pageTitle   = 'Banners & Announcements';
$pageActions = '';
$pageScript  = <<<'JS'
(() => {
  const emptyBanner = () => ({
    id: null,
    title: '',
    message: '',
    is_active: 1,
    starts_at: '',
    ends_at: '',
  });

  Vue.createApp({
    data() {
      return {
        loading: true,
        saving: false,
        error: '',
        banners: [],
        modalOpen: false,
        editing: emptyBanner(),
      };
    },
    computed: {
      activeCount() {
        return this.banners.filter((banner) => Number(banner.is_active) === 1).length;
      },
    },
    methods: {
      async loadBanners() {
        this.loading = true;
        this.error = '';
        try {
          const data = await adminApi('/api/banners.php');
          this.banners = data.banners || [];
        } catch (error) {
          this.error = error.message || 'Could not load banners.';
        } finally {
          this.loading = false;
        }
      },
      openBanner(banner = null) {
        this.editing = banner ? {
          ...banner,
          starts_at: banner.starts_at ? banner.starts_at.slice(0, 16) : '',
          ends_at: banner.ends_at ? banner.ends_at.slice(0, 16) : '',
        } : emptyBanner();
        this.modalOpen = true;
      },
      closeBanner() {
        this.modalOpen = false;
        this.editing = emptyBanner();
      },
      bannerPayload(banner) {
        return {
          title: banner.title || null,
          message: banner.message || '',
          is_active: Number(banner.is_active) === 1 ? 1 : 0,
          starts_at: banner.starts_at || null,
          ends_at: banner.ends_at || null,
        };
      },
      async saveBanner() {
        this.saving = true;
        try {
          const body = this.bannerPayload(this.editing);
          if (this.editing.id) {
            await adminApi(`/api/banners.php?id=${this.editing.id}`, { method: 'PUT', body: JSON.stringify(body) });
            adminToast('Banner updated');
          } else {
            await adminApi('/api/banners.php', { method: 'POST', body: JSON.stringify(body) });
            adminToast('Banner created');
          }
          this.closeBanner();
          await this.loadBanners();
        } catch (error) {
          adminToast(error.message || 'Could not save banner', 'error');
        } finally {
          this.saving = false;
        }
      },
      async toggleBanner(banner) {
        const previous = Number(banner.is_active) === 1 ? 1 : 0;
        banner.is_active = previous ? 0 : 1;
        try {
          await adminApi(`/api/banners.php?id=${banner.id}`, {
            method: 'PUT',
            body: JSON.stringify(this.bannerPayload(banner)),
          });
          adminToast(banner.is_active ? 'Banner activated' : 'Banner hidden');
        } catch (error) {
          banner.is_active = previous;
          adminToast(error.message || 'Could not update banner', 'error');
        }
      },
      deleteBanner(banner) {
        confirmDelete('Delete this banner?', async () => {
          try {
            await adminApi(`/api/banners.php?id=${banner.id}`, { method: 'DELETE' });
            this.banners = this.banners.filter((item) => item.id !== banner.id);
            adminToast('Banner deleted', 'error');
          } catch (error) {
            adminToast(error.message || 'Could not delete banner', 'error');
          }
        });
      },
      scheduleText(banner) {
        if (!banner.starts_at && !banner.ends_at) return 'No schedule';
        return `${window.adminFormatDateTime(banner.starts_at) || '-'} to ${window.adminFormatDateTime(banner.ends_at) || 'No end'}`;
      },
    },
    mounted() {
      this.loadBanners();
    },
  }).mount('#banners-app');
})();
JS;
require_once __DIR__ . '/../includes/header.php';
?>

<div id="banners-app" class="admin-vue-page" v-cloak>
  <div class="toolbar">
    <div>
      <p class="eyebrow">Public announcements</p>
      <h2>Banners</h2>
    </div>
    <div class="toolbar-actions">
      <span class="refresh-note">{{ activeCount }} active / {{ banners.length }} total</span>
      <button class="btn btn-primary" type="button" @click="openBanner()">
        <i class="fa-solid fa-plus"></i>
        New banner
      </button>
    </div>
  </div>

  <div v-if="error" class="alert alert-error">{{ error }}</div>
  <div v-if="loading" class="loading-panel"><i class="fa-solid fa-circle-notch spin"></i> Loading banners...</div>

  <div v-else class="card">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Website notices</p>
        <h3>Announcements shown on the public site</h3>
      </div>
      <button class="btn btn-sm btn-secondary" type="button" @click="loadBanners">Refresh</button>
    </div>

    <div v-if="!banners.length" class="empty-state">
      <i class="fa-solid fa-bullhorn"></i>
      <strong>No banners yet.</strong>
      <span>Create a banner for holiday hours, closures, or special notes.</span>
    </div>

    <div v-else class="banner-list">
      <article v-for="banner in banners" :key="banner.id" class="banner-row">
        <div class="banner-content">
          <div class="banner-title-line">
            <strong>{{ banner.title || 'Untitled announcement' }}</strong>
            <span class="badge" :class="Number(banner.is_active) === 1 ? 'badge-active' : 'badge-inactive'">{{ Number(banner.is_active) === 1 ? 'Active' : 'Inactive' }}</span>
          </div>
          <p>{{ banner.message }}</p>
          <small><i class="fa-regular fa-clock"></i> {{ scheduleText(banner) }}</small>
        </div>
        <div class="row-actions">
          <button class="switch-button" type="button" :class="{ on: Number(banner.is_active) === 1 }" @click="toggleBanner(banner)" :aria-pressed="Number(banner.is_active) === 1"></button>
          <button class="icon-button" type="button" title="Edit" @click="openBanner(banner)"><i class="fa-solid fa-pen"></i></button>
          <button class="icon-button danger" type="button" title="Delete" @click="deleteBanner(banner)"><i class="fa-solid fa-trash"></i></button>
        </div>
      </article>
    </div>
  </div>

  <div v-if="modalOpen" class="modal-overlay open" @click.self="closeBanner">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ editing.id ? 'Edit banner' : 'New banner' }}</h3>
        <button class="modal-close" type="button" @click="closeBanner" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <form @submit.prevent="saveBanner">
        <div class="modal-body">
          <div class="form-group">
            <label>Title</label>
            <input v-model.trim="editing.title" class="form-control" placeholder="Optional title">
          </div>
          <div class="form-group">
            <label>Message *</label>
            <textarea v-model.trim="editing.message" class="form-control" required></textarea>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label>Start date</label>
              <input v-model="editing.starts_at" type="datetime-local" class="form-control">
            </div>
            <div class="form-group">
              <label>End date</label>
              <input v-model="editing.ends_at" type="datetime-local" class="form-control">
            </div>
          </div>
          <label class="check-row">
            <input v-model="editing.is_active" true-value="1" false-value="0" type="checkbox">
            Active on public site
          </label>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" type="button" @click="closeBanner">Cancel</button>
          <button class="btn btn-primary" type="submit" :disabled="saving">
            <i v-if="saving" class="fa-solid fa-circle-notch spin"></i>
            Save banner
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
