# PRD — EXAPOS (Point of Sale)

## Original Problem Statement
Aplikasi kasir web bernama **EXAPOS** dari **PT Exano Technology Solution** dengan halaman login, berisi menu:
1. **Dashboard** — rekap omset (dapat diunduh Excel/CSV) + histori penjualan terbaru untuk cetak ulang struk.
2. **Kasir** — Product (fisik), Product Digital (pulsa/data/PLN), Product Online (e-commerce).
3. **Setting** — kontrol akses akun, kontrol barang & stok, pengaturan info aplikasi POS (nama toko, alamat, watermark "Powered by PT Exano Technology Solution").

Spesifikasi detail: mock authentication, dummy state management (localStorage), Tailwind CSS, sidebar navigation, responsive, Bahasa Indonesia, mata uang Rupiah, struk format thermal, checkout dengan metode Tunai/QRIS/Transfer + kalkulasi kembalian.

## Arsitektur
- **Frontend-only** React 19 + Tailwind CSS (create-react-app via craco). Tidak ada panggilan backend — sesuai permintaan user (dummy state).
- State global: `src/context/PosContext.jsx` (products, transactions, users, settings, currentUser) dengan persistensi `localStorage` (key `exapos_*`).
- Mock auth: validasi username/password terhadap daftar users di context; route protection via `<Protected>`.
- Struk thermal: `src/components/ReceiptModal.jsx` + CSS `@media print` di `App.css` (hanya area struk yang tercetak, lebar 80mm).
- Ekspor CSV: `src/utils/format.js` → `downloadRecapCSV` (dengan BOM agar terbaca rapi di Excel).
- Design system: `/app/design_guidelines.json` — Royal Cobalt #1E40AF, dark slate sidebar #0F172A, font Outfit/Inter/JetBrains Mono.

## User Personas & Kredensial (lihat /app/memory/test_credentials.md)
- **Admin** (admin@exapos.id / admin123) — akses penuh.
- **Manager** (manager@exapos.id / manager123) — akses penuh.
- **Kasir** (kasir@exapos.id / kasir123) — Dashboard + Kasir saja; Setting terkunci (akses ditolak).

## Yang Sudah Diimplementasikan (12 Sep 2026)
- Login page: branding EXAPOS, preset role demo, toggle password, error state, loading state.
- Global layout: sidebar dark slate (Dashboard/Kasir/Setting), header (nama toko, badge shift, jam live), watermark "Powered by PT Exano Technology Solution" di sidebar + footer + struk + login.
- Dashboard: kartu Omset Hari Ini (dengan tren vs kemarin), Omset Bulan Ini, Total Transaksi; tombol Unduh Rekap (CSV); tabel histori penjualan + Cetak Ulang Struk (modal struk thermal).
- Kasir: 3 tab kategori, pencarian, grid produk dengan badge stok (Menipis/Habis), input No. HP/ID Pelanggan untuk produk digital, keranjang (stepper qty, hapus, diskon Rp, toggle PPN 11% — nonaktif otomatis untuk produk digital), checkout modal (Tunai/QRIS/Transfer, quick cash pills, kembalian real-time), cetak struk setelah bayar, stok fisik/online berkurang otomatis.
- Setting: Akses Akun (CRUD user, role, toggle status aktif); Barang & Stok (CRUD produk lintas kategori, harga, stok, min. stok, alert stok menipis); Info Aplikasi POS (nama toko, alamat, telepon, footer struk, teks watermark) — perubahan langsung ter-reflect di header/footer/struk.
- Testing agent iteration_1: ~95% pass (39/41). Diperbaiki: duplikasi data-testid sidebar mobile/desktop (suffix `-mobile`), overflow horizontal mobile (overflow-x-hidden + min-w-0 pada shell).
- Watermark di Setting dijadikan read-only (tidak bisa diubah, selalu "Powered by PT Exano Technology Solution").
- Role Kasir dibatasi hanya ke menu Kasir (sidebar filter + route guard + redirect login ke /kasir).
- Panel "5 Transaksi Terakhir" di Kasir dengan cetak ulang struk.
- Logo diganti file resmi `public/exano-logo.webp` (sidebar + login).
- Panel demo login dihapus; akun live: exanoadm@gmail.com (Admin/Owner), migrasi seed v2 di PosContext.
- Inventory (Setting → Barang & Stok): pencarian barang + sortable headers (nama abjad, tipe grouping, stok, min. stok).
- **PWA offline** (12 Sep 2026): `public/manifest.json`, `public/sw.js` (cache-first + precache app shell), ikon PNG 192/512/maskable dari logo, registrasi SW di `index.js`. Installable dari browser & berjalan offline penuh.
- **Portable Windows app** (12 Sep 2026): Electron wrapper di `/app/desktop/` (main.js + package.json), frontend di-build dengan `homepage: "./"` lalu dipaket via `@electron/packager@18` + `electron@33` (pinned karena Node 20). Output: `frontend/public/EXAPOS-portable-win64.zip` (~116 MB) — dapat diunduh di `/EXAPOS-portable-win64.zip`, ekstrak lalu jalankan `EXAPOS.exe` (tanpa installer, offline penuh, data di localStorage Electron).
- **Bug fix layar putih Electron** (12 Sep 2026): BrowserRouter crash di file:// (replaceState SecurityError, origin null) → `App.js` memakai HashRouter saat `protocol === 'file:'`. Terverifikasi testing_agent iterasi 2 (file:// build render + login OK).
- **PWA install button** (12 Sep 2026): `components/InstallPWA.jsx` (beforeinstallprompt) di halaman Login + sidebar. Catatan: di headless Chromium tombol tidak muncul (beforeinstallprompt tidak ter-fire) — normal; di Chrome/Edge desktop asli muncul.
- **Scan barcode di Kasir** (12 Sep 2026): input pencarian menerima scan barcode/kode + Enter → item langsung masuk keranjang; field `barcode` ditambahkan ke semua produk (seed + migrasi by-id tanpa mengubah stok) dan form produk.
- **Barang & Stok v2** (12 Sep 2026): kolom Kode diganti Barcode; badge stok menipis bisa diklik untuk filter; upload massal CSV (template + parser, upsert by code); centang item + Hapus Terpilih. Iterasi 2 testing agent: 100% pass.
- PENTING build portable: jangan letakkan zip di `public/` sebelum `yarn build` (zip ikut ter-copy ke build → zip-dalam-zip). Alur benar: build → bersihkan zip dari public/build → packager → zip → baru copy ke public/.

## Backlog Prioritas
- **P1**: Persistensi backend nyata (FastAPI + MongoDB) jika multi-perangkat dibutuhkan; autentikasi JWT sesungguhnya.
- **P1**: Laporan omset dengan filter rentang tanggal + grafik (recharts sudah terpasang).
- **P2**: Mode barcode/SKU scanner, manajemen pelanggan, shift kasir (buka/tutup kas).
- **P2**: Ekspor .xlsx native (library xlsx) selain CSV.
- **P2**: PWA / mode offline penuh.

## Next Tasks
1. Verifikasi ulang mobile 390px setelah perbaikan overflow (sedang divalidasi).
2. Konfirmasi ke user apakah perlu backend nyata (multi-device sync) atau tetap dummy state.
