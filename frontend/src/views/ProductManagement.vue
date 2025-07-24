<template>
  <div class="management-container">
    <div class="form-section">
      <form @submit.prevent="isEditing ? updateProduct() : addProduct()" class="product-form">
        <h2>{{ isEditing ? 'Edit Produk' : 'Tambah Produk Baru' }}</h2>
        <div class="form-group">
          <label for="name">Nama Produk:</label>
          <input id="name" v-model="form.name" type="text" required>
        </div>
        <div class="form-group">
          <label for="price">Harga:</label>
          <input id="price" v-model.number="form.price" type="number" required>
        </div>
        <div class="form-group">
          <label for="stock">Stok:</label>
          <input id="stock" v-model.number="form.stock" type="number" required>
        </div>
        <div class="form-group">
          <label for="category">Kategori:</label>
          <select id="category" v-model="form.category_id" required>
            <option :value="null" disabled>-- Pilih Kategori --</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            {{ isEditing ? 'Simpan Perubahan' : 'Simpan Produk' }}
          </button>
          <button v-if="isEditing" type="button" @click="resetForm" class="btn btn-secondary">
            Batal
          </button>
        </div>
      </form>
    </div>

    <div class="table-section">
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
          <tr v-if="products.length === 0">
            <td colspan="4" style="text-align: center;">Tidak ada produk.</td>
          </tr>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.name }}</td>
            <td>Rp {{ product.price.toLocaleString('id-ID') }}</td>
            <td>{{ product.stock }}</td>
            <td class="action-buttons">
              <button @click="editProduct(product)" class="btn btn-warning">Edit</button>
              <button @click="deleteProduct(product.id)" class="btn btn-danger">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const products = ref([])
const categories = ref([])

// Menggunakan satu 'ref' untuk form agar lebih mudah di-reset
const form = ref({
  name: '',
  price: 0,
  stock: 0,
  category_id: null
})

const isEditing = ref(false)
const editProductId = ref(null)

const API_URL = 'http://127.0.0.1:8000/api'

const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`)
    products.value = response.data
  } catch (error) { console.error('Gagal mengambil produk:', error) }
}

const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`)
    categories.value = response.data
  } catch (error) { console.error('Gagal mengambil kategori:', error) }
}

const resetForm = () => {
  form.value = { name: '', price: 0, stock: 0, category_id: null }
  isEditing.value = false
  editProductId.value = null
}

const addProduct = async () => {
  try {
    await axios.post(`${API_URL}/products`, form.value)
    alert('Produk berhasil ditambahkan!')
    resetForm()
    fetchProducts()
  } catch (error) {
    alert('Gagal menambahkan produk.')
    console.error(error)
  }
}

const editProduct = (product) => {
  isEditing.value = true
  editProductId.value = product.id
  form.value = { ...product } // Salin data produk ke form
}

const updateProduct = async () => {
  try {
    await axios.put(`${API_URL}/products/${editProductId.value}`, form.value)
    alert('Produk berhasil diperbarui!')
    resetForm()
    fetchProducts()
  } catch (error) {
    alert('Gagal memperbarui produk.')
    console.error(error)
  }
}

const deleteProduct = async (id) => {
  // Menambahkan konfirmasi sebelum menghapus
  if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
    try {
      await axios.delete(`${API_URL}/products/${id}`)
      alert('Produk berhasil dihapus!')
      fetchProducts()
    } catch (error) {
      alert('Gagal menghapus produk.')
      console.error(error)
    }
  }
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>

<style scoped>
.management-container {
  display: flex;
  gap: 30px;
  padding: 20px;
  font-family: sans-serif;
}
.form-section {
  flex: 1;
  max-width: 400px;
}
.table-section {
  flex: 2;
}
.product-form {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #ddd;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-weight: bold;
}
.btn-primary { background-color: #28a745; }
.btn-primary:hover { background-color: #218838; }
.btn-secondary { background-color: #6c757d; }
.btn-secondary:hover { background-color: #5a6268; }
.btn-warning { background-color: #ffc107; color: #212529; }
.btn-warning:hover { background-color: #e0a800; }
.btn-danger { background-color: #dc3545; }
.btn-danger:hover { background-color: #c82333; }
.product-table {
  width: 100%;
  border-collapse: collapse;
}
.product-table th,
.product-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}
.product-table th {
  background-color: #f2f2f2;
}
.action-buttons button {
  margin-right: 5px;
}
</style>