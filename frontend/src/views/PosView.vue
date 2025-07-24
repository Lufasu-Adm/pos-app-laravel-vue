<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar-brand">POS App</div>
      <ul class="navbar-menu">
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><RouterLink to="/about">About</RouterLink></li>
        <li><RouterLink to="/pos" custom v-slot="{ isActive }">
          <a :class="[{ active: isActive }]">Pilih Produk</a>
        </RouterLink></li>
      </ul>
    </nav>

    <div class="container">
      <!-- Daftar Produk (Grid) -->
      <section class="product-grid">
        <h2>Pilih Produk</h2>
        <div v-for="prod in products" :key="prod.id" class="product-card">
          <h3>{{ prod.name }}</h3>
          <p>Rp {{ prod.price }}</p>
          <button @click="addToCart(prod)" class="btn btn-primary">Tambah</button>
        </div>
      </section>

      <!-- Sidebar Keranjang -->
      <aside class="cart-sidebar">
        <h2>Keranjang</h2>
        <ul>
          <li v-for="item in cart" :key="item.id">
            {{ item.name }} x {{ item.qty }}
            <button @click="removeFromCart(item.id)" class="btn btn-danger btn-sm">×</button>
          </li>
        </ul>
        <div v-if="cart.length">
          <strong>Total: Rp {{ total }}</strong>
          <button class="btn btn-success btn-block">Checkout</button>
        </div>
        <div v-else>
          <p>Keranjang kosong</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { RouterLink } from 'vue-router'

const API = 'http://127.0.0.1:8000/api'
const products = ref([])
const cart = ref([])

onMounted(async () => {
  const res = await axios.get(`${API}/products`)
  products.value = res.data
})

const addToCart = prod => {
  const existing = cart.value.find(i => i.id === prod.id)
  if (existing) existing.qty++
  else cart.value.push({ ...prod, qty: 1 })
}
const removeFromCart = id => {
  cart.value = cart.value.filter(i => i.id !== id)
}

const total = computed(() => cart.value.reduce((sum, i) => sum + i.price * i.qty, 0))
</script>

<style scoped>
/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #1f3a93, #2c82c9);
  padding: 15px 30px;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
.navbar-brand {
  font-weight: bold;
  font-size: 1.5rem;
}
.navbar-menu {
  display: flex;
  gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.navbar-menu li a {
  color: #fff;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background 0.3s;
}
.navbar-menu li a.active,
.navbar-menu li a:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Layout */
.container {
  display: flex;
  gap: 25px;
  padding: 30px;
  background: #f4f6f8;
  min-height: calc(100vh - 80px);
}

/* Product Grid */
.product-grid {
  flex: 3;
}
.product-grid h2 {
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #2c3e50;
}
.product-card {
  background: #fff;
  border: 1px solid #dcdfe3;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}
.product-card:hover {
  transform: translateY(-3px);
}
.product-card h3 {
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: #34495e;
}
.product-card p {
  font-weight: bold;
  color: #27ae60;
  margin-bottom: 12px;
}

/* Cart Sidebar */
.cart-sidebar {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
.cart-sidebar h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #2c3e50;
}
.cart-sidebar ul {
  list-style: none;
  padding-left: 0;
  margin-bottom: 15px;
}
.cart-sidebar li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
}
.cart-sidebar strong {
  display: block;
  margin-top: 10px;
  font-size: 1.2rem;
  color: #2c3e50;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
}
.btn-primary {
  background: #3498db;
  color: #fff;
}
.btn-primary:hover {
  background: #2980b9;
}
.btn-danger {
  background: #e74c3c;
  color: #fff;
}
.btn-danger:hover {
  background: #c0392b;
}
.btn-success {
  background: #2ecc71;
  color: #fff;
}
.btn-success:hover {
  background: #27ae60;
}
.btn-block {
  width: 100%;
  margin-top: 20px;
}
.btn-sm {
  padding: 4px 10px;
  font-size: 0.8rem;
}
</style>