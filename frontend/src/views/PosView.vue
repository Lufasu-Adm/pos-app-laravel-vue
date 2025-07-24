<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-brand">POS App</div>
      <ul class="navbar-menu">
        <li><RouterLink to="/">Kasir</RouterLink></li>
        <li><RouterLink to="/admin/products">Manajemen Produk</RouterLink></li>
        <li><RouterLink to="/dashboard">Dashboard</RouterLink></li>
        <li><RouterLink to="/history">Riwayat Transaksi</RouterLink></li>
      </ul>
    </nav>

    <div class="container">
      <section class="product-grid">
        <h2>Pilih Produk</h2>
        <div class="product-card-container">
            <div v-for="prod in products" :key="prod.id" class="product-card" @click="addToCart(prod)">
              <h3>{{ prod.name }}</h3>
              <p>Rp {{ prod.price.toLocaleString('id-ID') }}</p>
              <button class="btn btn-primary">Tambah</button>
            </div>
        </div>
      </section>

      <aside class="cart-sidebar">
        <h2>Keranjang</h2>
        <ul class="cart-items">
          <li v-for="item in cart" :key="item.id">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-qty">x {{ item.qty }}</span>
            <span class="item-price">Rp {{ (item.price * item.qty).toLocaleString('id-ID') }}</span>
            <button @click="removeFromCart(item.id)" class="btn btn-danger btn-sm">×</button>
          </li>
        </ul>
        <div v-if="cart.length">
          <strong class="total-price">Total: Rp {{ total.toLocaleString('id-ID') }}</strong>

          <div class="payment-section">
            <label>Metode Pembayaran:</label>
            <div class="payment-methods">
              <label>
                <input type="radio" v-model="metodePembayaran" value="Tunai" name="paymentMethod"> Tunai
              </label>
              <label>
                <input type="radio" v-model="metodePembayaran" value="Transfer Nanti" name="paymentMethod"> Transfer Nanti
              </label>
            </div>
          </div>

          <div v-if="metodePembayaran === 'Tunai'" class="payment-section">
            <label>Uang Dibayar:</label>
            <input type="number" v-model="uangDiterima" class="input-payment" placeholder="Masukkan jumlah uang" />
            <p v-if="uangDiterima > 0">Kembalian: Rp {{ kembalian.toLocaleString('id-ID') }}</p>
          </div>

          <button class="btn btn-success btn-block" @click="checkout">Checkout</button>
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
const uangDiterima = ref(0)
const metodePembayaran = ref('Tunai') // <-- Pastikan ini ada

onMounted(async () => {
  try {
    const res = await axios.get(`${API}/products`)
    products.value = res.data
  } catch (error) {
    console.error('Gagal mengambil produk:', error)
  }
})

// Fungsi tambah produk ke keranjang (tidak diubah)
const addToCart = prod => {
  const existing = cart.value.find(i => i.id === prod.id)
  if (existing) {
    existing.qty++
  } else {
    cart.value.push({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      qty: 1
    })
  }
}

// Fungsi hapus produk dari keranjang (tidak diubah)
const removeFromCart = id => {
  const index = cart.value.findIndex(i => i.id === id);
  if (index !== -1) {
    if (cart.value[index].qty > 1) {
      cart.value[index].qty--;
    } else {
      cart.value.splice(index, 1);
    }
  }
}

// Total harga keranjang (tidak diubah)
const total = computed(() => cart.value.reduce((sum, i) => sum + i.price * i.qty, 0))

// Kembalian setelah uang diterima (tidak diubah)
const kembalian = computed(() => Math.max(0, uangDiterima.value - total.value))

const checkout = async () => {
  // Cek jika keranjang kosong
  if (!cart.value.length) {
    return alert('Keranjang kosong!');
  }
  
  // INI LOGIKA KUNCI YANG DIPERBAIKI:
  // Cek uang HANYA jika metode pembayaran adalah 'Tunai'
  if (metodePembayaran.value === 'Tunai' && uangDiterima.value < total.value) {
    return alert('Uang yang dibayarkan kurang dari total belanja.');
  }

  // Siapkan data untuk dikirim ke back-end
  const payload = {
    metode_pembayaran: metodePembayaran.value,
    bayar: uangDiterima.value,
    cart: cart.value.map(item => ({
      id: item.id,
      jumlah: item.qty
    }))
  };

  try {
    const response = await axios.post(`${API}/transaksi`, payload);
    alert(response.data.message);
    
    // Reset keranjang dan input setelah berhasil
    cart.value = [];
    uangDiterima.value = 0;
    metodePembayaran.value = 'Tunai';

  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Gagal menghubungi server.';
    alert(errorMessage);
    console.error(err);
  }
}
</script>

<style scoped>
/* STYLE ANDA TIDAK SAYA UBAH SAMA SEKALI */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #1f3a93, #2c82c9);
  padding: 15px 30px;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
.navbar-brand { font-weight: bold; font-size: 1.5rem; }
.navbar-menu { display: flex; gap: 20px; list-style: none; margin: 0; padding: 0; }
.navbar-menu li a { color: #fff; text-decoration: none; padding: 6px 12px; border-radius: 6px; transition: background 0.3s; }
.navbar-menu li a.router-link-exact-active,
.navbar-menu li a:hover { background: rgba(255, 255, 255, 0.2); }
.container { display: flex; gap: 25px; padding: 20px; background: #f4f6f8; height: calc(100vh - 78px); }
.product-grid { flex: 3; overflow-y: auto; padding-right: 15px; }
.product-grid h2 { margin-bottom: 20px; font-size: 1.8rem; color: #2c3e50; }
.product-card-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; }
.product-card { background: #fff; border: 1px solid #dcdfe3; border-radius: 12px; padding: 15px; text-align: center; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); transition: all 0.2s; cursor: pointer; }
.product-card:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
.product-card h3 { font-size: 1.1rem; margin-top:0; margin-bottom: 8px; color: #34495e; }
.product-card p { font-weight: bold; color: #27ae60; margin-bottom: 12px; }
.cart-sidebar { flex: 1; background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column; }
.cart-sidebar h2 { font-size: 1.5rem; margin-bottom: 15px; color: #2c3e50; text-align: center; }
.cart-items { list-style: none; padding-left: 0; margin-bottom: 15px; flex-grow: 1; overflow-y: auto; }
.cart-items li { display: grid; grid-template-columns: 1fr auto auto auto; gap: 10px; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee; }
.item-name { 
  font-weight: 600; 
  color: #333;
}
.item-qty { color: #7f8c8d; }
.item-price { 
  font-weight: bold; 
  color: #333;
}
.total-price { display: block; margin-top: auto; padding-top: 15px; border-top: 2px solid #34495e; font-size: 1.4rem; color: #2c3e50; text-align: right; }
.payment-section { 
  margin-top: 10px; 
  color: #333;
}
.input-payment { width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 6px; text-align: right; font-size: 1rem; }
.payment-section p { text-align: right; margin: 5px 0 0; }
.payment-methods {
  display: flex;
  gap: 20px;
  margin-top: 5px;
  margin-bottom: 10px;
}
.payment-methods label {
  display: flex;
  align-items: center;
  gap: 5px;
}
.btn { display: inline-block; padding: 8px 14px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.95rem; }
.btn-primary { background: #3498db; color: #fff; width: 100%; }
.btn-primary:hover { background: #2980b9; }
.btn-danger { background: #e74c3c; color: #fff; }
.btn-danger:hover { background: #c0392b; }
.btn-success { background: #2ecc71; color: #fff; }
.btn-success:hover { background: #27ae60; }
.btn-block { width: 100%; margin-top: 20px; padding: 12px; font-size: 1.1rem; }
.btn-sm { padding: 2px 8px; font-size: 0.8rem; }
</style>