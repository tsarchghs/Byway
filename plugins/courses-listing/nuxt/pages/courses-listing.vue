
<template>
  <Header/>
<section class="catalogue">
    <!-- Header -->
    <div class="catalogue-header">
      <h1 class="catalogue-title">All Courses</h1>
      <div class="catalogue-controls">
        <button class="btn-outline">Filter</button>
        <div class="sort">
          <span>Sort by</span>
          <button class="btn-outline">Popularity ▾</button>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="catalogue-body">
      <!-- Sidebar -->
      <aside class="filters">
        <div class="filter">
          <div class="filter-header">Ratings</div>
          <div class="stars">
            <div class="star-row">
              <span class="star full"></span>
              <span class="star full"></span>
              <span class="star full"></span>
              <span class="star full"></span>
              <span class="star empty"></span>
            </div>
            <div class="star-row">
              <span class="star full"></span>
              <span class="star full"></span>
              <span class="star full"></span>
              <span class="star empty"></span>
              <span class="star empty"></span>
            </div>
            <div class="star-row">
              <span class="star full"></span>
              <span class="star full"></span>
              <span class="star empty"></span>
              <span class="star empty"></span>
              <span class="star empty"></span>
            </div>
          </div>
        </div>

        <div class="filter">
          <div class="filter-header">Duration</div>
          <div class="filter-options">
            <label><input type="checkbox" /> 1–10</label>
            <label><input type="checkbox" /> 10–15</label>
            <label><input type="checkbox" checked /> 15–20</label>
            <label><input type="checkbox" /> 20–25</label>
          </div>
        </div>
      </aside>

      <!-- Product grid -->
      <div class="product-grid">
        <div class="product-card" v-for="n in 8" :key="n">
          <div class="product-image"></div>
          <div class="product-content">
            <h3 class="product-title">Beginner’s Guide to Design</h3>
            <p class="product-author">By Ronald Richards</p>
            <div class="rating">
              <span class="star full" v-for="i in 4" :key="i"></span>
              <span class="star empty"></span>
              <span class="rating-count">(1200 Ratings)</span>
            </div>
            <p class="product-meta">22 Total Hours · 155 Lectures · Beginner</p>
            <p class="product-price">€149.9</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button>&lt;</button>
      <button class="active">1</button>
      <button>2</button>
      <button>3</button>
      <button>&gt;</button>
    </div>
  </section>
</template>
<script setup>
import Header from '../../../../packages/shared-ui/src/components/Header.vue';
</script>
<style scoped>
.catalogue {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
  font-family: 'Inter', sans-serif;
  color: #0f172a;
}

/* HEADER */
.catalogue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.catalogue-title {
  font-size: 40px;
  font-weight: 700;
  line-height: 120%;
  color: #0f172a;
}

.catalogue-controls {
  display: flex;
  align-items: center;
  gap: 24px;
}

.btn-outline {
  padding: 10px 24px;
  background: #fff;
  border: 1px solid #0f172a;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  color: #0f172a;
}

.sort {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 16px;
}

/* BODY */
.catalogue-body {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 40px;
  width: 100%;
}

/* FILTER SIDEBAR */
.filters {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 305px;
  background: #fff;
}

.filter {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 12px;
}

.filter-header {
  font-size: 16px;
  font-weight: 500;
  color: #0f172a;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-options label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #0f172a;
}

/* Stars */
.stars, .star-row {
  display: flex;
  gap: 4px;
}
.star {
  width: 20px;
  height: 20px;
  border-radius: 3px;
}
.star.full {
  background: #eab308;
}
.star.empty {
  background: #cbd5e1;
}

/* PRODUCT GRID */
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: space-between;
  width: 100%;
}

.product-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  width: 298px;
  height: auto;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.12);
  padding: 16px;
  gap: 8px;
}

.product-image {
  width: 100%;
  height: 140px;
  background: #e0e7ff;
  border-radius: 8px;
}

.product-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.product-title {
  font-size: 18px;
  font-weight: 600;
}

.product-author,
.product-meta {
  font-size: 14px;
  color: #334155;
}

.product-price {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-count {
  font-size: 12px;
  font-weight: 600;
  color: #334155;
}

/* PAGINATION */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
}

.pagination button {
  width: 43px;
  height: 41px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
}

.pagination .active {
  color: #0f172a;
  font-weight: 700;
}

@media (max-width: 1024px) {
  .catalogue-body {
    flex-direction: column;
  }

  .filters {
    width: 100%;
    order: 2;
  }

  .product-grid {
    justify-content: center;
  }
}
/* === FIGMA PRECISION FIXES === */

/* General container tightening */
.catalogue {
  background: #fff;
  border-radius: 12px;
  padding: 40px 60px;
}

/* Title */
.catalogue-title {
  font-size: 42px;
  font-weight: 800;
  color: #0b1220;
  margin-bottom: 20px;
}

/* Filter & sort row */
.catalogue-header {
  align-items: flex-start;
  gap: 32px;
}

.catalogue-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.btn-outline {
  border: 1.5px solid #0b1220;
  border-radius: 10px;
  font-weight: 600;
  padding: 10px 28px;
  background-color: #fff;
  transition: all 0.2s ease;
}

.btn-outline:hover {
  background-color: #f1f5f9;
}

/* Sidebar filters */
.filters {
  min-width: 240px;
  border-right: 1px solid #e2e8f0;
  padding-right: 32px;
}

.filter-header {
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 12px;
}

.filter-options label {
  font-size: 15px;
  color: #1e293b;
}

.filter-options input[type='checkbox'] {
  width: 18px;
  height: 18px;
  accent-color: #0b1220;
}

/* Course grid layout fix */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 32px;
  width: 100%;
}

/* Card fidelity (Figma match) */
.product-card {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.25s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.product-image {
  background-color: #e2e8f0;
  border-radius: 8px;
  height: 180px;
}

.product-title {
  font-size: 17px;
  font-weight: 700;
  color: #0b1220;
}

.product-author {
  color: #334155;
  font-weight: 500;
}

/* Rating stars alignment */
.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star.full {
  background: #facc15;
  width: 14px;
  height: 14px;
  border-radius: 2px;
}

.star.empty {
  background: #e2e8f0;
  width: 14px;
  height: 14px;
  border-radius: 2px;
}

.rating-count {
  font-weight: 600;
  font-size: 13px;
  color: #475569;
}

/* Pagination */
.pagination {
  margin-top: 40px;
  justify-content: flex-start;
  gap: 6px;
  padding-left: 260px;
}

.pagination button {
  width: 36px;
  height: 36px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-weight: 600;
  color: #0b1220;
  background: #fff;
  transition: background 0.2s ease;
}

.pagination button:hover {
  background: #f1f5f9;
}

.pagination .active {
  background: #0b1220;
  color: #fff;
}

/* Responsive fixes */
@media (max-width: 1024px) {
  .catalogue {
    padding: 24px;
  }
  .catalogue-body {
    flex-direction: column;
  }
  .filters {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 16px;
    width: 100%;
  }
  .pagination {
    justify-content: center;
    padding-left: 0;
  }
}
/* === RESPONSIVE ADDITIONS === */

/* Large tablets (≤1280px) */
@media (max-width: 1280px) {
  .catalogue {
    padding: 32px 40px;
  }

  .catalogue-body {
    gap: 32px;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 24px;
  }

  .filters {
    min-width: 200px;
    padding-right: 24px;
  }
}

/* Tablets (≤1024px) */
@media (max-width: 1024px) {
  .catalogue {
    padding: 28px 24px;
  }

  .catalogue-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .catalogue-controls {
    width: 100%;
    justify-content: space-between;
  }

  .catalogue-body {
    flex-direction: column;
  }

  .filters {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 16px;
    margin-bottom: 16px;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    justify-content: center;
  }

  .pagination {
    justify-content: center;
    padding-left: 0;
  }
}

/* Mobile landscape (≤768px) */
@media (max-width: 768px) {
  .catalogue {
    padding: 20px;
  }

  .catalogue-title {
    font-size: 28px;
  }

  .btn-outline {
    padding: 8px 18px;
    font-size: 13px;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  .filter {
    flex: 1 1 calc(50% - 16px);
    border-bottom: none;
    padding-bottom: 0;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }

  .product-card {
    width: 100%;
    border-radius: 12px;
    padding: 16px;
  }

  .product-image {
    height: 150px;
  }

  .product-title {
    font-size: 16px;
  }

  .product-price {
    font-size: 18px;
  }
}

/* Mobile portrait (≤480px) */
@media (max-width: 480px) {
  .catalogue {
    padding: 16px;
  }

  .catalogue-header {
    flex-direction: column;
    align-items: stretch;
  }

  .catalogue-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .filters {
    flex-direction: column;
  }

  .filter {
    width: 100%;
  }

  .filter-header {
    font-size: 16px;
  }

  .filter-options label {
    font-size: 14px;
  }

  .product-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
  }

  .pagination button {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
}

/* Ultra-small devices (≤360px) */
@media (max-width: 360px) {
  .catalogue-title {
    font-size: 24px;
  }

  .btn-outline {
    font-size: 12px;
    padding: 6px 14px;
  }

  .product-image {
    height: 120px;
  }

  .product-price {
    font-size: 16px;
  }
}
/* === STAR STACKING FIX === */
.stars {
  display: flex;
  flex-direction: column;
  gap: 8px; /* space between each star row */
}

.star-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
}

.star-row + .star-row {
  margin-top: 4px;
}

/* optional: make sure stars are uniform size */
.star {
  width: 18px;
  height: 18px;
  border-radius: 3px;
}

</style>
