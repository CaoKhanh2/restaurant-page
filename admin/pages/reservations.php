<?php
$pageTitle   = 'Reservations';
$pageActions = '';
$pageScript  = <<<'JS'
(() => {
  Vue.createApp({
    data() {
      return {
        loading: true,
        error: '',
        reservations: [],
        total: 0,
        status: '',
        search: '',
      };
    },
    computed: {
      filters() {
        return [
          { label: 'All', value: '', count: this.reservations.length },
          { label: 'Pending', value: 'pending', count: this.countByStatus('pending') },
          { label: 'Confirmed', value: 'confirmed', count: this.countByStatus('confirmed') },
          { label: 'Cancelled', value: 'cancelled', count: this.countByStatus('cancelled') },
        ];
      },
      filteredReservations() {
        const q = this.search.trim().toLowerCase();
        return this.reservations.filter((reservation) => {
          const matchesStatus = !this.status || reservation.status === this.status;
          const haystack = [
            reservation.nom,
            reservation.prenom,
            reservation.email,
            reservation.objet,
            reservation.message,
            reservation.reservation_date,
          ].join(' ').toLowerCase();
          return matchesStatus && (!q || haystack.includes(q));
        });
      },
    },
    methods: {
      async loadReservations() {
        this.loading = true;
        this.error = '';
        try {
          const data = await adminApi('/api/reservations.php?limit=200');
          this.reservations = data.reservations || [];
          this.total = data.total || this.reservations.length;
        } catch (error) {
          this.error = error.message || 'Could not load reservations.';
        } finally {
          this.loading = false;
        }
      },
      countByStatus(status) {
        return this.reservations.filter((reservation) => reservation.status === status).length;
      },
      async setStatus(reservation, status) {
        try {
          await adminApi(`/api/reservations.php?id=${reservation.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
          });
          reservation.status = status;
          adminToast(`Reservation marked ${status}`);
        } catch (error) {
          adminToast(error.message || 'Could not update reservation', 'error');
        }
      },
      deleteReservation(reservation) {
        confirmDelete(`Delete reservation for ${reservation.nom} ${reservation.prenom}?`, async () => {
          try {
            await adminApi(`/api/reservations.php?id=${reservation.id}`, { method: 'DELETE' });
            this.reservations = this.reservations.filter((item) => item.id !== reservation.id);
            this.total = Math.max(0, this.total - 1);
            adminToast('Reservation deleted', 'error');
          } catch (error) {
            adminToast(error.message || 'Could not delete reservation', 'error');
          }
        });
      },
      formatDate: window.adminFormatDate,
      formatDateTime: window.adminFormatDateTime,
      statusLabel: window.adminStatusLabel,
    },
    mounted() {
      this.loadReservations();
    },
  }).mount('#reservations-app');
})();
JS;
require_once __DIR__ . '/../includes/header.php';
?>

<div id="reservations-app" class="admin-vue-page" v-cloak>
  <div class="toolbar">
    <div>
      <p class="eyebrow">Guest requests</p>
      <h2>Reservation queue</h2>
    </div>
    <div class="toolbar-actions">
      <input v-model="search" type="search" class="form-control search-input" placeholder="Search guest, email, message...">
      <button class="btn btn-secondary" type="button" @click="loadReservations">
        <i class="fa-solid fa-rotate"></i>
        Refresh
      </button>
    </div>
  </div>

  <div class="tab-bar status-tabs">
    <button
      v-for="filter in filters"
      :key="filter.value"
      type="button"
      class="tab"
      :class="{ active: status === filter.value }"
      @click="status = filter.value"
    >
      {{ filter.label }} <span>{{ filter.count }}</span>
    </button>
  </div>

  <div v-if="error" class="alert alert-error">{{ error }}</div>
  <div v-if="loading" class="loading-panel"><i class="fa-solid fa-circle-notch spin"></i> Loading reservations...</div>

  <div v-else class="card">
    <div class="table-summary">
      <strong>{{ filteredReservations.length }}</strong>
      <span>shown from {{ total }} total reservation request(s)</span>
    </div>
    <div v-if="!filteredReservations.length" class="empty-state">
      <i class="fa-regular fa-calendar-check"></i>
      <strong>No reservations found.</strong>
      <span>Try another status filter or search term.</span>
    </div>
    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Guest</th>
            <th>Contact</th>
            <th>Request</th>
            <th>Date</th>
            <th>Guests</th>
            <th>Status</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reservation in filteredReservations" :key="reservation.id">
            <td>
              <strong>{{ reservation.nom }} {{ reservation.prenom }}</strong>
              <div class="text-muted small">Received {{ formatDateTime(reservation.created_at) }}</div>
            </td>
            <td><a :href="`mailto:${reservation.email}`">{{ reservation.email }}</a></td>
            <td>
              <div>{{ reservation.objet || '-' }}</div>
              <div v-if="reservation.message" class="text-muted small truncate">{{ reservation.message }}</div>
            </td>
            <td>{{ formatDate(reservation.reservation_date) }}</td>
            <td>{{ reservation.nb_personnes || '-' }}</td>
            <td><span class="badge" :class="`badge-${reservation.status}`">{{ statusLabel(reservation.status) }}</span></td>
            <td>
              <div class="row-actions">
                <button v-if="reservation.status !== 'confirmed'" class="icon-button success" type="button" title="Confirm" @click="setStatus(reservation, 'confirmed')"><i class="fa-solid fa-check"></i></button>
                <button v-if="reservation.status !== 'cancelled'" class="icon-button danger" type="button" title="Cancel" @click="setStatus(reservation, 'cancelled')"><i class="fa-solid fa-xmark"></i></button>
                <button v-if="reservation.status !== 'pending'" class="icon-button" type="button" title="Return to pending" @click="setStatus(reservation, 'pending')"><i class="fa-solid fa-arrow-rotate-left"></i></button>
                <button class="icon-button danger" type="button" title="Delete" @click="deleteReservation(reservation)"><i class="fa-solid fa-trash"></i></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
