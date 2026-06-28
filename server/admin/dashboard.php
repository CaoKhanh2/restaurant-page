<?php
$pageTitle   = 'Dashboard';
$pageActions = '';
$pageScript  = <<<'JS'
(() => {
  let visitorChart = null;

  Vue.createApp({
    data() {
      return {
        loading: true,
        refreshing: false,
        error: '',
        data: null,
        refreshedAt: '',
      };
    },
    computed: {
      todayCards() {
        const today = this.data?.today || {};
        return [
          { label: 'Pending requests', value: today.pending_reservations || 0, icon: 'fa-inbox', tone: 'warning' },
          { label: 'Confirmed today', value: today.confirmed_reservations || 0, icon: 'fa-circle-check', tone: 'success' },
          { label: 'Expected covers', value: today.expected_covers || 0, icon: 'fa-users', tone: 'accent' },
          { label: 'Visitors today', value: today.visitors || 0, icon: 'fa-eye', tone: 'neutral' },
        ];
      },
      healthItems() {
        const content = this.data?.content || {};
        return [
          { label: 'Active dishes', value: content.active_dishes || 0, detail: `${content.hidden_dishes || 0} hidden`, icon: 'fa-utensils' },
          { label: 'Featured dishes', value: content.featured_dishes || 0, detail: 'Shown as highlights', icon: 'fa-star' },
          { label: 'Live banners', value: content.active_banners || 0, detail: 'Visible announcements', icon: 'fa-bullhorn' },
          { label: 'Gallery images', value: content.gallery_images || 0, detail: 'Visible photos', icon: 'fa-images' },
        ];
      },
      pendingReservations() {
        return this.data?.reservations?.pending || [];
      },
      todayReservations() {
        return this.data?.reservations?.today || [];
      },
      warnings() {
        return this.data?.health || [];
      },
    },
    methods: {
      async loadDashboard(showRefresh = false) {
        this.error = '';
        this.refreshing = showRefresh;
        if (!showRefresh) this.loading = true;

        try {
          this.data = await adminApi('/api/dashboard.php');
          this.refreshedAt = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
          this.$nextTick(this.renderChart);
        } catch (error) {
          this.error = error.message || 'Could not load dashboard.';
        } finally {
          this.loading = false;
          this.refreshing = false;
        }
      },
      async setStatus(reservation, status) {
        try {
          await adminApi(`/api/reservations.php?id=${reservation.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
          });
          adminToast(`Reservation marked ${status}`);
          await this.loadDashboard(true);
        } catch (error) {
          adminToast(error.message || 'Could not update reservation', 'error');
        }
      },
      renderChart() {
        const canvas = document.getElementById('dashboardVisitorChart');
        if (!canvas || !window.Chart || !this.data) return;

        const timeline = this.data.traffic?.timeline || [];
        if (visitorChart) visitorChart.destroy();

        visitorChart = new Chart(canvas.getContext('2d'), {
          type: 'line',
          data: {
            labels: timeline.map(row => row.label),
            datasets: [{
              label: 'Unique visitors',
              data: timeline.map(row => row.visits),
              fill: true,
              tension: 0.35,
              borderColor: '#a0782f',
              backgroundColor: 'rgba(160, 120, 47, .12)',
              pointBackgroundColor: '#a0782f',
              pointRadius: 3,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
          },
        });
      },
      formatDate: window.adminFormatDate,
      formatDateTime: window.adminFormatDateTime,
      statusLabel: window.adminStatusLabel,
      initials(reservation) {
        return `${reservation.prenom || ''} ${reservation.nom || ''}`.trim().slice(0, 1).toUpperCase() || 'R';
      },
    },
    mounted() {
      this.loadDashboard();
    },
  }).mount('#dashboard-app');
})();
JS;
require_once __DIR__ . '/includes/header.php';
?>

<div id="dashboard-app" class="dashboard-app" v-cloak>
  <div class="ops-header">
    <div>
      <p class="eyebrow">Daily operations</p>
      <h2>Today at Les 4 Saisons</h2>
      <p class="text-muted">Manage reservations, service readiness, content health, and traffic from one place.</p>
    </div>
    <div class="ops-actions">
      <span class="refresh-note" v-if="refreshedAt">Updated {{ refreshedAt }}</span>
      <button class="btn btn-secondary" type="button" @click="loadDashboard(true)" :disabled="refreshing">
        <i class="fa-solid fa-rotate" :class="{ 'spin': refreshing }"></i>
        Refresh
      </button>
      <a href="/pages/reservations.php" class="btn btn-primary">
        <i class="fa-solid fa-calendar-check"></i>
        Reservations
      </a>
    </div>
  </div>

  <div v-if="loading" class="loading-panel">
    <i class="fa-solid fa-circle-notch spin"></i>
    Loading manager dashboard...
  </div>

  <div v-else-if="error" class="alert alert-error">{{ error }}</div>

  <template v-else>
    <div class="kpi-grid">
      <article class="kpi-card" v-for="card in todayCards" :key="card.label" :class="`tone-${card.tone}`">
        <div class="kpi-icon"><i class="fa-solid" :class="card.icon"></i></div>
        <div>
          <div class="kpi-value">{{ card.value }}</div>
          <div class="kpi-label">{{ card.label }}</div>
        </div>
      </article>
    </div>

    <div class="ops-layout">
      <section class="card attention-card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Needs attention</p>
            <h3>Pending reservations</h3>
          </div>
          <span class="badge badge-pending">{{ data.reservations.total_pending }} pending</span>
        </div>

        <div v-if="warnings.length" class="warning-stack">
          <div v-for="item in warnings" :key="item.message" class="inline-warning" :class="`warning-${item.type}`">
            <i class="fa-solid" :class="item.type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-info'"></i>
            {{ item.message }}
          </div>
        </div>

        <div v-if="!pendingReservations.length" class="empty-state">
          <i class="fa-solid fa-circle-check"></i>
          <strong>No pending reservation requests.</strong>
          <span>Everything urgent is handled for now.</span>
        </div>

        <div v-else class="reservation-stack">
          <article v-for="reservation in pendingReservations" :key="reservation.id" class="reservation-card">
            <div class="avatar">{{ initials(reservation) }}</div>
            <div class="reservation-main">
              <div class="reservation-title">
                <strong>{{ reservation.nom }} {{ reservation.prenom }}</strong>
                <span>{{ reservation.nb_personnes || '-' }} guests</span>
              </div>
              <div class="reservation-meta">
                <span><i class="fa-regular fa-calendar"></i> {{ formatDate(reservation.reservation_date) }}</span>
                <span><i class="fa-regular fa-clock"></i> Requested {{ formatDateTime(reservation.created_at) }}</span>
              </div>
              <p v-if="reservation.message" class="reservation-note">{{ reservation.message }}</p>
            </div>
            <div class="reservation-actions">
              <a class="icon-button" :href="`mailto:${reservation.email}`" title="Email guest"><i class="fa-solid fa-envelope"></i></a>
              <button class="icon-button success" type="button" title="Confirm" @click="setStatus(reservation, 'confirmed')"><i class="fa-solid fa-check"></i></button>
              <button class="icon-button danger" type="button" title="Cancel" @click="setStatus(reservation, 'cancelled')"><i class="fa-solid fa-xmark"></i></button>
            </div>
          </article>
        </div>
      </section>

      <section class="card service-card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Service view</p>
            <h3>Today's reservations</h3>
          </div>
          <span class="badge badge-active">{{ data.today.expected_covers }} covers</span>
        </div>

        <div v-if="!todayReservations.length" class="empty-state compact">
          <i class="fa-regular fa-calendar"></i>
          <strong>No reservations for today.</strong>
          <span>New requests will appear here when dated for today.</span>
        </div>

        <div v-else class="service-list">
          <article v-for="reservation in todayReservations" :key="reservation.id" class="service-row">
            <div>
              <strong>{{ reservation.nom }} {{ reservation.prenom }}</strong>
              <span>{{ reservation.nb_personnes || '-' }} guests</span>
            </div>
            <span class="badge" :class="`badge-${reservation.status}`">{{ statusLabel(reservation.status) }}</span>
          </article>
        </div>
      </section>
    </div>

    <div class="grid-2">
      <section class="card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Content health</p>
            <h3>Website readiness</h3>
          </div>
          <a href="/pages/menu.php" class="btn btn-sm btn-secondary">Manage menu</a>
        </div>
        <div class="health-grid">
          <article v-for="item in healthItems" :key="item.label" class="health-card">
            <i class="fa-solid" :class="item.icon"></i>
            <div>
              <strong>{{ item.value }}</strong>
              <span>{{ item.label }}</span>
              <small>{{ item.detail }}</small>
            </div>
          </article>
        </div>
      </section>

      <section class="card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Audience</p>
            <h3>Visitors - last 7 days</h3>
          </div>
          <a href="/pages/analytics.php" class="btn btn-sm btn-secondary">Full analytics</a>
        </div>
        <div class="chart-container compact-chart">
          <canvas id="dashboardVisitorChart"></canvas>
        </div>
      </section>
    </div>
  </template>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
