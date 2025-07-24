<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// State untuk form tambah produk
const newProduct = ref({
  name: '',
  price: 0,
  stock: 0,
  category_id: null,
})

// State untuk menampung daftar produk & kategori
const products = ref([])
const categories = ref([])

// --- FUNGSI-FUNGSI ---

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/products')
    products.value = response.data
  } catch (error) {
    console.error('Gagal mengambil produk:', error)
  }
}

const fetchCategories = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/categories')
    categories.value = response.data
  } catch (error) {
    console.error('Gagal mengambil kategori:', error)
  }
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})

const addProduct = async () => {
  try {
    await axios.post('http://127.0.0.1:8000/api/products', newProduct.value)
    alert('Produk berhasil ditambahkan!')
    newProduct.value = { name: '', price: 0, stock: 0, category_id: null }
    fetchProducts()
  } catch (error) {
    alert('Gagal menambah produk.')
    console.error(error)
  }
}

const deleteProduct = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}`)
      alert('Produk berhasil dihapus!')
      fetchProducts()
    } catch (error) {
      alert('Gagal menghapus produk.')
      console.error(error)
    }
  }
}
</script>

<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar-brand">POS App</div>
      <ul class="navbar-menu">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="#" class="active">Manajemen Produk</a></li>
      </ul>
    </nav>

    <div class="content-container">
      <!-- Form tambah produk di kiri -->
      <aside class="sidebar">
        <h2>Tambah Produk Baru</h2>
        <form @submit.prevent="addProduct" class="add-product-form">
          <div class="form-group">
            <label for="name">Nama Produk:</label>
            <input id="name" v-model="newProduct.name" type="text" required>
          </div>
          <div class="form-group">
            <label for="price">Harga:</label>
            <input id="price" v-model="newProduct.price" type="number" required>
          </div>
          <div class="form-group">
            <label for="stock">Stok:</label>
            <input id="stock" v-model="newProduct.stock" type="number" required>
          </div>
          <div class="form-group">
            <label for="category">Kategori:</label>
            <select id="category" v-model="newProduct.category_id" required>
              <option :value="null" disabled>Pilih Kategori</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Simpan Produk</button>
        </form>
      </aside>

      <!-- Tabel daftar produk di kanan -->
      <main class="main-content">
        <h2>Daftar Produk</h2>
        <table class="product-table">
          <thead>
            <tr>
              <th>Nama Produk</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.name }}</td>
              <td>Rp {{ product.price }}</td>
              <td>{{ product.stock }}</td>
              <td>
                <button @click="deleteProduct(product.id)" class="btn btn-danger">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50;
  padding: 10px 20px;
  color: #ecf0f1;
}
.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
}
.navbar-menu {
  list-style: none;
  display: flex;
  gap: 20px;
}
.navbar-menu li a {
  color: #ecf0f1;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
}
.navbar-menu li a.active,
.navbar-menu li a:hover {
  background-color: #34495e;
}

.content-container {
  display: flex;
  gap: 20px;
  padding: 20px;
}
.sidebar {
  flex: 1;
  max-width: 350px;
}
.main-content {
  flex: 2;
}

.add-product-form {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #000000ff;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary {
  background-color: #27ae60;
  color: white;
}
.btn-primary:hover {
  background-color: #219150;
}
.btn-danger {
  background-color: #c0392b;
  color: white;
}
.btn-danger:hover {
  background-color: #962d22;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #000000ff;
}
.product-table th,
.product-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
  color: #2c3e50; /* buat teks terlihat */
}
.product-table th {
  background-color: #000000ff;
  color: #2c3e50;
}
</style>
