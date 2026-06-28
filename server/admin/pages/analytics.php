<?php
$pageTitle  = 'Analytics';
$pageScript = <<<'JS'
(() => {
  let analyticsChart = null;

  Vue.createApp({
    data() {
      return {
        loading: true,
        error: '',
        period: 'week',
        data: {
          timeline: [],
          top_pages: [],
          today: 0,
          this_week: 0,
          pending_res: 0,
        },
      };
    },
    computed: {
      periods() {
        return [
          { label: 'Today', value: 'day' },
          { label: '7 days', value: 'week' },
          { label: '30 days', value: 'month' },
        ];
      },
      maxPageVisits() {
        return Math.max(1, ...this.data.top_pages.map((page) => Number(page.visits || 0)));
      },
    },
    methods: {
      async loadAnalytics(period = this.period) {
        this.period = period;
        this.loading = true;
        this.error = '';
        try {
          this.data = await adminApi(`/api/analytics.php?period=${period}`);
          this.$nextTick(this.renderChart);
        } catch (error) {
          this.error = error.message || 'Could not load analytics.';
        } finally {
          this.loading = false;
        }
      },
      renderChart() {
        const canvas = document.getElementById('analyticsVisitorChart');
        if (!canvas || !window.Chart) return;
        if (analyticsChart) analyticsChart.destroy();

        analyticsChart = new Chart(canvas.getContext('2d'), {
          type: 'bar',
          data: {
            labels: this.data.timeline.map((row) => row.label),
            datasets: [{
              label: 'Unique visitors',
              data: this.data.timeline.map((row) => row.visits),
              backgroundColor: 'rgba(160, 120, 47, .72)',
              borderColor: '#a0782f',
              borderWidth: 1,
              borderRadius: 4,
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
      pageWidth(page) {
        return `${Math.round((Number(page.visits || 0) / this.maxPageVisits) * 100)}%`;
      },
    },
    mounted() {
      this.loadAnalytics('week');
    },
  }).mount('#analytics-app');
})();
JS;
require_once __DIR__ . '/../includes/header.php';
?>

<div id="analytics-app" class="admin-vue-page" v-cloak>
  <div class="toolbar">
    <div>
      <p class="eyebrow">Website demand</p>
      <h2>Analytics</h2>
    </div>
    <div class="tab-bar period-tabs">
      <button
        v-for="item in periods"
        :key="item.value"
        type="button"
        class="tab"
        :class="{ active: period === item.value }"
        @click="loadAnalytics(item.value)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>

  <div class="kpi-grid analytics-kpis">
    <article class="kpi-card tone-neutral">
      <div class="kpi-icon"><i class="fa-solid fa-eye"></i></div>
      <div><div class="kpi-value">{{ data.today }}</div><div class="kpi-label">Visitors today</div></div>
    </article>
    <article class="kpi-card tone-accent">
      <div class="kpi-icon"><i class="fa-solid fa-chart-line"></i></div>
      <div><div class="kpi-value">{{ data.this_week }}</div><div class="kpi-label">Visitors this week</div></div>
    </article>
    <article class="kpi-card tone-warning">
      <div class="kpi-icon"><i class="fa-solid fa-inbox"></i></div>
      <div><div class="kpi-value">{{ data.pending_res }}</div><div class="kpi-label">Pending reservations</div></div>
    </article>
  </div>

  <div v-if="error" class="alert alert-error">{{ error }}</div>
  <div v-if="loading" class="loading-panel"><i class="fa-solid fa-circle-notch spin"></i> Loading analytics...</div>

  <template v-else>
    <div class="card">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Traffic</p>
          <h3>Unique visitors</h3>
        </div>
        <span class="text-muted small">Based on distinct visitor hashes</span>
      </div>
      <div class="chart-container">
        <canvas id="analyticsVisitorChart"></canvas>
      </div>
    </div>

    <div class="card">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Page demand</p>
          <h3>Top pages</h3>
        </div>
        <span class="text-muted small">Page events, not unique visitors</span>
      </div>

      <div v-if="!data.top_pages.length" class="empty-state">
        <i class="fa-regular fa-chart-bar"></i>
        <strong>No analytics yet.</strong>
        <span>Traffic data will appear after public visitors browse the site.</span>
      </div>

      <div v-else class="table-wrap">
        <table>
          <thead><tr><th>Page</th><th class="text-right">Visits</th></tr></thead>
          <tbody>
            <tr v-for="page in data.top_pages" :key="page.page_url">
              <td>
                <code>{{ page.page_url }}</code>
                <div class="metric-bar"><span :style="{ width: pageWidth(page) }"></span></div>
              </td>
              <td class="text-right"><strong>{{ page.visits }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
