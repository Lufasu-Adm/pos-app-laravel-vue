<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const totalRevenue = ref(0);
const totalTransactions = ref(0);
const chartData = ref(null); // Mulai dengan null

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Grafik Penjualan Harian',
    },
  },
};

onMounted(async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/dashboard/sales-report');
    const data = response.data;

    totalRevenue.value = data.total_revenue;
    totalTransactions.value = data.total_transactions;

    // Siapkan data untuk grafik
    chartData.value = {
      labels: data.sales_data.map(item => item.date), // Sumbu X (Tanggal)
      datasets: [
        {
          label: 'Total Penjualan',
          backgroundColor: '#42A5F5',
          data: data.sales_data.map(item => item.total_sales), // Sumbu Y (Jumlah Penjualan)
        },
      ],
    };
  } catch (error) {
    console.error('Gagal mengambil data dashboard:', error);
  }
});
</script>

<template>
  <div class="dashboard-container">
    <h1>Dashboard Laporan</h1>

    <div class="stats-container">
      <div class="stat-card">
        <h3>Total Pendapatan</h3>
        <p>Rp {{ Number(totalRevenue).toLocaleString('id-ID') }}</p>
      </div>
      <div class="stat-card">
        <h3>Total Transaksi</h3>
        <p>{{ totalTransactions }}</p>
      </div>
    </div>

    <div class="chart-container">
      <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
      <div v-else>
        Memuat data grafik...
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 30px;
  font-family: sans-serif;
  background-color: #f4f6f8;
  min-height: 100vh;
}

h1 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.stats-container {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 10px 0;
  font-size: 1rem;
  color: #7f8c8d;
}

.stat-card p {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
}

.chart-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: 400px;
}
</style>