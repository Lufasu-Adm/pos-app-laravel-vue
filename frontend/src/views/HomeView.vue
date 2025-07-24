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
  background: #2c3e50;
  padding: 10px 20px;
  color: #000000ff;
}
.navbar-menu { display: flex; gap: 15px; }
.navbar-menu li a { color: #000000ff; text-decoration: none; padding: 5px 10px; border-radius: 4px; }
.navbar-menu li a.active,
.navbar-menu li a:hover { background: #34495e; }

/* Layout */
.container { display: flex; gap: 20px; padding: 20px; }
.product-grid { flex: 3; display: grid; gap: 20px; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
.cart-sidebar { flex: 1; background: #fff; color: #333; padding: 20px; border-radius: 8px; }

/* Product Cards */
.product-card { background: #fff; padding: 15px; border-radius: 8px; text-align: center; color: #333; }
.product-card h3 { margin-bottom: 10px; }
.product-card p { margin-bottom: 15px; }
.btn { display: inline-block; padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; }
.btn-primary { background: #27ae60; color: #fff; }
.btn-primary:hover { background: #219150; }
.btn-danger { background: #e74c3c; color: #fff; }
.btn-danger:hover { background: #c0392b; }
.btn-success { background: #2ecc71; color: #fff; }
.btn-success:hover { background: #27ae60; }
.btn-block { width: 100%; margin-top: 15px; }
.btn-sm { padding: 4px 8px; font-size: 0.8rem; }
</style>
