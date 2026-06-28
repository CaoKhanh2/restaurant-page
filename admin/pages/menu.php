<?php
$pageTitle   = 'Menu Management';
$pageActions = '';
$pageScript  = <<<'JS'
(() => {
  const emptyDish = () => ({
    id: null,
    category_id: '',
    name_fr: '',
    name_en: '',
    price: '',
    description_fr: '',
    image_path: '',
    is_featured: 0,
    is_active: 1,
    display_order: 0,
  });

  Vue.createApp({
    data() {
      return {
        loading: true,
        saving: false,
        error: '',
        dishes: [],
        categories: [],
        category: '',
        search: '',
        modalOpen: false,
        editing: emptyDish(),
      };
    },
    computed: {
      categoryTabs() {
        return [
          { id: '', title_fr: 'All dishes', count: this.dishes.length },
          ...this.categories.map((category) => ({
            ...category,
            count: this.dishes.filter((dish) => Number(dish.category_id) === Number(category.id)).length,
          })),
        ];
      },
      filteredDishes() {
        const q = this.search.trim().toLowerCase();
        return this.dishes.filter((dish) => {
          const matchesCategory = !this.category || Number(dish.category_id) === Number(this.category);
          const haystack = [dish.name_fr, dish.name_en, dish.category_title, dish.description_fr, dish.price].join(' ').toLowerCase();
          return matchesCategory && (!q || haystack.includes(q));
        });
      },
      activeCount() {
        return this.dishes.filter((dish) => Number(dish.is_active) === 1).length;
      },
      hiddenCount() {
        return this.dishes.filter((dish) => Number(dish.is_active) === 0).length;
      },
      featuredCount() {
        return this.dishes.filter((dish) => Number(dish.is_featured) === 1).length;
      },
    },
    methods: {
      async loadMenu() {
        this.loading = true;
        this.error = '';
        try {
          const data = await adminApi('/api/menu.php');
          this.dishes = data.dishes || [];
          this.categories = data.categories || [];
        } catch (error) {
          this.error = error.message || 'Could not load menu.';
        } finally {
          this.loading = false;
        }
      },
      categoryName(id) {
        return this.categories.find((category) => Number(category.id) === Number(id))?.title_fr || '-';
      },
      dishPayload(dish) {
        return {
          category_id: Number(dish.category_id || 0),
          name_fr: dish.name_fr || '',
          name_en: dish.name_en || null,
          price: Number(dish.price || 0),
          description_fr: dish.description_fr || null,
          image_path: dish.image_path || null,
          is_featured: dish.is_featured ? 1 : 0,
          display_order: Number(dish.display_order || 0),
          is_active: dish.is_active ? 1 : 0,
        };
      },
      openDish(dish = null) {
        this.editing = dish ? { ...dish } : { ...emptyDish(), category_id: this.categories[0]?.id || '' };
        this.modalOpen = true;
      },
      closeDish() {
        this.modalOpen = false;
        this.editing = emptyDish();
      },
      async saveDish() {
        this.saving = true;
        try {
          const body = this.dishPayload(this.editing);
          if (this.editing.id) {
            await adminApi(`/api/menu.php?id=${this.editing.id}`, { method: 'PUT', body: JSON.stringify(body) });
            adminToast('Dish updated');
          } else {
            await adminApi('/api/menu.php', { method: 'POST', body: JSON.stringify(body) });
            adminToast('Dish added');
          }
          this.closeDish();
          await this.loadMenu();
        } catch (error) {
          adminToast(error.message || 'Could not save dish', 'error');
        } finally {
          this.saving = false;
        }
      },
      async toggleDish(dish, field) {
        const previous = Number(dish[field]) === 1 ? 1 : 0;
        dish[field] = previous ? 0 : 1;
        try {
          await adminApi(`/api/menu.php?id=${dish.id}`, {
            method: 'PUT',
            body: JSON.stringify(this.dishPayload(dish)),
          });
          adminToast(field === 'is_active' ? (dish[field] ? 'Dish visible' : 'Dish hidden') : 'Featured status updated');
        } catch (error) {
          dish[field] = previous;
          adminToast(error.message || 'Could not update dish', 'error');
        }
      },
      deleteDish(dish) {
        confirmDelete(`Delete "${dish.name_fr}"?`, async () => {
          try {
            await adminApi(`/api/menu.php?id=${dish.id}`, { method: 'DELETE' });
            this.dishes = this.dishes.filter((item) => item.id !== dish.id);
            adminToast('Dish deleted', 'error');
          } catch (error) {
            adminToast(error.message || 'Could not delete dish', 'error');
          }
        });
      },
      money: window.adminFormatCurrency,
    },
    mounted() {
      this.loadMenu();
    },
  }).mount('#menu-app');
})();
JS;
require_once __DIR__ . '/../includes/header.php';
?>

<div id="menu-app" class="admin-vue-page" v-cloak>
  <div class="toolbar">
    <div>
      <p class="eyebrow">Public menu</p>
      <h2>Menu catalogue</h2>
    </div>
    <div class="toolbar-actions">
      <input v-model="search" type="search" class="form-control search-input" placeholder="Search dishes...">
      <button class="btn btn-primary" type="button" @click="openDish()">
        <i class="fa-solid fa-plus"></i>
        Add dish
      </button>
    </div>
  </div>

  <div class="summary-strip">
    <div><strong>{{ dishes.length }}</strong><span>Total dishes</span></div>
    <div><strong>{{ activeCount }}</strong><span>Visible</span></div>
    <div><strong>{{ hiddenCount }}</strong><span>Hidden</span></div>
    <div><strong>{{ featuredCount }}</strong><span>Featured</span></div>
  </div>

  <div class="tab-bar category-tabs">
    <button
      v-for="tab in categoryTabs"
      :key="tab.id || 'all'"
      type="button"
      class="tab"
      :class="{ active: String(category) === String(tab.id) }"
      @click="category = tab.id"
    >
      {{ tab.title_fr }} <span>{{ tab.count }}</span>
    </button>
  </div>

  <div v-if="error" class="alert alert-error">{{ error }}</div>
  <div v-if="loading" class="loading-panel"><i class="fa-solid fa-circle-notch spin"></i> Loading menu...</div>

  <div v-else class="card">
    <div v-if="!filteredDishes.length" class="empty-state">
      <i class="fa-solid fa-utensils"></i>
      <strong>No dishes found.</strong>
      <span>Try another category or search term.</span>
    </div>
    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Dish</th>
            <th>Category</th>
            <th>Price</th>
            <th>Visible</th>
            <th>Featured</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dish in filteredDishes" :key="dish.id">
            <td>
              <img v-if="dish.image_path" :src="dish.image_path" class="dish-img" alt="" @error="$event.target.style.display='none'">
              <span v-else class="image-placeholder"><i class="fa-regular fa-image"></i></span>
            </td>
            <td>
              <strong>{{ dish.name_fr }}</strong>
              <div v-if="dish.name_en" class="text-muted small">{{ dish.name_en }}</div>
            </td>
            <td>{{ dish.category_title || categoryName(dish.category_id) }}</td>
            <td><strong>{{ money(dish.price) }}</strong></td>
            <td>
              <button class="switch-button" type="button" :class="{ on: Number(dish.is_active) === 1 }" @click="toggleDish(dish, 'is_active')" :aria-pressed="Number(dish.is_active) === 1"></button>
            </td>
            <td>
              <button class="badge-button" type="button" :class="{ active: Number(dish.is_featured) === 1 }" @click="toggleDish(dish, 'is_featured')">
                <i class="fa-solid fa-star"></i>
                {{ Number(dish.is_featured) === 1 ? 'Featured' : 'Normal' }}
              </button>
            </td>
            <td>
              <div class="row-actions">
                <button class="icon-button" type="button" title="Edit" @click="openDish(dish)"><i class="fa-solid fa-pen"></i></button>
                <button class="icon-button danger" type="button" title="Delete" @click="deleteDish(dish)"><i class="fa-solid fa-trash"></i></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="modalOpen" class="modal-overlay open" @click.self="closeDish">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ editing.id ? 'Edit dish' : 'Add dish' }}</h3>
        <button class="modal-close" type="button" @click="closeDish" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <form @submit.prevent="saveDish">
        <div class="modal-body">
          <div class="grid-2">
            <div class="form-group">
              <label>Name (French) *</label>
              <input v-model.trim="editing.name_fr" class="form-control" required>
            </div>
            <div class="form-group">
              <label>Name (English)</label>
              <input v-model.trim="editing.name_en" class="form-control">
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label>Category *</label>
              <select v-model.number="editing.category_id" class="form-control" required>
                <option v-for="category in categories" :key="category.id" :value="Number(category.id)">{{ category.title_fr }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Price (CHF) *</label>
              <input v-model.number="editing.price" type="number" step="0.5" min="0" class="form-control" required>
            </div>
          </div>
          <div class="form-group">
            <label>Description (French)</label>
            <textarea v-model.trim="editing.description_fr" class="form-control"></textarea>
          </div>
          <div class="form-group">
            <label>Image path</label>
            <input v-model.trim="editing.image_path" class="form-control" placeholder="/images/food/example.webp">
          </div>
          <div class="grid-2">
            <label class="check-row">
              <input v-model="editing.is_active" true-value="1" false-value="0" type="checkbox">
              Visible on site
            </label>
            <label class="check-row">
              <input v-model="editing.is_featured" true-value="1" false-value="0" type="checkbox">
              Featured dish
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" type="button" @click="closeDish">Cancel</button>
          <button class="btn btn-primary" type="submit" :disabled="saving">
            <i v-if="saving" class="fa-solid fa-circle-notch spin"></i>
            Save dish
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
