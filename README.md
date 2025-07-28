# 🚀 Aplikasi Point of Sale (POS) Sederhana

Aplikasi **POS (Point of Sale)** full-stack sederhana yang dibangun dengan **Laravel** dan **Vue.js**. Proyek ini mencakup fitur-fitur inti dari sistem kasir, mulai dari **manajemen produk** hingga **pencatatan dan pelaporan transaksi**.

---

## ✨ Fitur Utama

### **1. Manajemen Produk & Kategori**
- Tambah, Edit, Hapus, dan Lihat (CRUD) produk.
- Pengelompokan produk berdasarkan kategori.

### **2. Antarmuka Kasir (Point of Sale)**
- Tampilan grid produk yang mudah dipilih.
- Keranjang belanja (cart) yang dinamis.
- Perhitungan total belanja otomatis.

### **3. Sistem Transaksi**
- Mendukung pembayaran **Tunai** dan **Transfer Nanti (terutang)**.
- Pengurangan stok produk otomatis setelah transaksi berhasil.

### **4. Riwayat & Laporan**
- Halaman riwayat untuk melihat semua transaksi yang pernah terjadi.
- Fitur untuk menandai transaksi terutang sebagai **"Lunas"**.
- Dashboard visual dengan ringkasan total pendapatan dan grafik penjualan harian.

---

## 📸 Screenshot

> **PENTING:** Ganti `link-ke-screenshot-kasir.png` di bawah ini dengan screenshot aplikasi Anda.  
> Anda bisa drag & drop gambar ke GitHub untuk mendapatkan link-nya.

- **Halaman Kasir:**  
  ![Kasir](https://github.com/Lufasu-Adm/pos-app-laravel-vue/blob/main/image/POS%20APP.png)

- **Halaman Manajemen Produk:**  
  ![Produk](https://github.com/Lufasu-Adm/pos-app-laravel-vue/blob/main/image/manajemen%20produk.png)

- **Halaman Riwayat:**  
  ![Dashboard](https://github.com/Lufasu-Adm/pos-app-laravel-vue/blob/main/image/riwayat%20transaksi.png)

- **Dashboard Laporan:**  
  ![Dashboard](https://github.com/Lufasu-Adm/pos-app-laravel-vue/blob/main/image/dashboard%20laporan.png)  

---

## ⚙️ Teknologi yang Digunakan

### Back-End:
- **PHP 8+ / Laravel 11+**
- **MySQL**

### Front-End:
- **Vue.js 3 (Composition API)**
- **Vite**
- **Vue Router & Pinia** (tidak digunakan secara eksplisit, tetapi terinstall)
- **Axios**
- **Chart.js & vue-chartjs**

### Development:
- **Git & GitHub**

---

## 📦 Instalasi & Setup

Berikut adalah cara untuk menjalankan proyek ini di komputer lokal Anda.

### 1. Prasyarat
- PHP 8.1+ & Composer
- Node.js & NPM
- Git
- Database Server (misalnya XAMPP atau Laragon)

### 2. Clone Repository

```bash
git clone https://github.com/NAMA_USER_ANDA/NAMA_REPO_ANDA.git
cd nama-repo-anda
```

### 3. Setup Back-End (Laravel)

Buka terminal baru dan jalankan perintah berikut dari folder utama.

```bash
# Masuk ke folder backend
cd backend

# Install dependensi PHP
composer install

# Salin file .env.example menjadi .env
cp .env.example .env

# Buat kunci aplikasi
php artisan key:generate

# Buka file .env dan sesuaikan konfigurasi database (DB_DATABASE, DB_USERNAME, DB_PASSWORD)
# ...

# Buat tabel dan isi data awal dengan seeder
php artisan migrate:fresh --seed
```

### 4. Setup Front-End (Vue.js)

Buka terminal lain dan jalankan perintah berikut dari folder utama.

```bash
# Masuk ke folder frontend
cd frontend

# Install dependensi JavaScript
npm install
```

### 5. Menjalankan Aplikasi

Anda perlu menjalankan dua server secara bersamaan di dua terminal terpisah.

#### Terminal 1 (untuk Back-end):

```bash
cd backend
php artisan serve
# Server akan berjalan di http://127.0.0.1:8000
```

#### Terminal 2 (untuk Front-end):

```bash
cd frontend
npm run dev
# Server akan berjalan di http://localhost:5173
```

Buka [http://localhost:5173](http://localhost:5173) di browser Anda untuk menggunakan aplikasi.
