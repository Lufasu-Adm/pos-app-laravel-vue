<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const transactions = ref([]);
const isLoading = ref(true);
const selectedTransaction = ref(null);
const API_URL = 'http://127.0.0.1:8000/api';

const fetchTransactions = async () => {
  try {
    const response = await axios.get(`${API_URL}/transaksi`);
    transactions.value = response.data;
  } catch (error) {
    console.error('Gagal mengambil riwayat transaksi:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchTransactions);

const markAsPaid = async (transactionId) => {
  event.stopPropagation();
  
  if (confirm('Apakah Anda yakin ingin menandai transaksi ini sebagai Lunas?')) {
    try {
      await axios.patch(`${API_URL}/transaksi/${transactionId}/lunas`);
      alert('Status transaksi berhasil diperbarui!');
      fetchTransactions();
    } catch (error) {
      alert('Gagal memperbarui status transaksi.');
      console.error(error);
    }
  }
};

const formatRupiah = (number) => {
  if (number === null || number === undefined) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const showDetails = (transaction) => {
  selectedTransaction.value = transaction;
};
</script>

<template>
  <div class="history-container">
    <h1>Riwayat Transaksi</h1>

    <div v-if="isLoading">Memuat data...</div>
    <div v-else-if="transactions.length === 0">Tidak ada riwayat transaksi.</div>
    <div v-else class="transaction-list">
      <div v-for="trx in transactions" :key="trx.id" class="transaction-card" @click="showDetails(trx)">
        <div class="card-header">
          <span>ID Transaksi: {{ trx.id }}</span>
          <span :class="['status-badge', trx.status_pembayaran === 'Lunas' ? 'status-lunas' : 'status-belum-lunas']">
            {{ trx.status_pembayaran }}
          </span>
        </div>
        <div class="card-body">
          <div class="card-info">
            <span>Total: {{ formatRupiah(trx.total) }}</span>
            <span>Metode: {{ trx.metode_pembayaran }}</span>
          </div>
          <div class="card-actions">
            <button v-if="trx.status_pembayaran === 'Belum Lunas'" @click="markAsPaid(trx.id)" class="btn btn-success">
              Tandai Lunas
            </button>
          </div>
        </div>
        <div class="card-footer">
          {{ formatDate(trx.created_at) }}
        </div>
      </div>
    </div>

    <div v-if="selectedTransaction" class="modal-overlay" @click.self="selectedTransaction = null">
      <div class="modal-content">
        <h2>Detail Transaksi #{{ selectedTransaction.id }}</h2>
        <p><strong>Waktu:</strong> {{ formatDate(selectedTransaction.created_at) }}</p>
        <p><strong>Metode Pembayaran:</strong> {{ selectedTransaction.metode_pembayaran }}</p>
        <p><strong>Status:</strong> {{ selectedTransaction.status_pembayaran }}</p>
        <table class="detail-table">
          <thead>
            <tr>
              <th>Produk</th>
              <th>Jumlah</th>
              <th>Harga Satuan</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in selectedTransaction.items" :key="item.id">
              <td>{{ item.nama_produk }}</td>
              <td>{{ item.jumlah }}</td>
              <td>{{ formatRupiah(item.harga_satuan) }}</td>
              <td>{{ formatRupiah(item.jumlah * item.harga_satuan) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="summary">
          <p><strong>Total Belanja:</strong> {{ formatRupiah(selectedTransaction.total) }}</p>
          <p><strong>Uang Dibayar:</strong> {{ formatRupiah(selectedTransaction.bayar) }}</p>
          <p><strong>Kembalian:</strong> {{ formatRupiah(selectedTransaction.kembalian) }}</p>
        </div>
        <button @click="selectedTransaction = null" class="close-button">Tutup</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-container { padding: 30px; font-family: sans-serif; }
h1 { margin-bottom: 20px; }
.transaction-list { display: grid; gap: 15px; }
.transaction-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
}
.transaction-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.card-header, .card-body, .card-footer { padding: 10px 15px; }
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  font-size: 0.9rem;
  color: #6c757d;
}
.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
}
.status-lunas { background-color: #28a745; }
.status-belum-lunas { background-color: #dc3545; }
.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
}
.card-info { display: flex; flex-direction: column; gap: 5px; }
.card-info span:first-child { font-weight: bold; font-size: 1.2rem; color: #333; }
.card-info span:last-child { font-size: 0.9rem; color: #6c757d; }
.card-footer {
  font-size: 0.8rem;
  color: #6c757d;
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
  text-align: right;
}
.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  margin-left: 10px;
  font-weight: 600;
}
.btn-success { background-color: #28a745; }
.btn-success:hover { background-color: #218838; }

/* Modal */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0,0,0,0.6);
  display: flex; justify-content: center; align-items: center; z-index: 1000;
}
.modal-content {
  background: white; padding: 25px; border-radius: 8px;
  width: 90%; max-width: 600px; color: #333;
}
.modal-content h2 { color: #333; margin-top: 0; }
.modal-content p { margin: 10px 0; }
.detail-table {
  width: 100%; border-collapse: collapse; margin: 20px 0;
}
.detail-table th, .detail-table td {
  border: 1px solid #ddd; padding: 10px; text-align: left; color: #333;
}
.detail-table th { background-color: #f2f2f2; }
.summary {
  text-align: right; margin-top: 15px;
  border-top: 1px solid #ccc; padding-top: 15px;
}
.summary p { margin: 5px 0; font-size: 1.1rem; }
.summary strong { font-weight: bold; }
.close-button {
  margin-top: 20px; padding: 10px 15px; background-color: #6c757d;
  color: white; border: none; border-radius: 5px; cursor: pointer; float: right;
}
.close-button:hover { background-color: #5a6268; }
</style>