# Pendapatan di Laporan, Pendapatan Lain-lain & Kode Inventaris

## 1. Pendapatan masuk ke halaman Laporan
Tambah tab/section baru "Pendapatan" di halaman Laporan yang memakai filter periode yang sudah ada (rentang tanggal atau bulan):
- Kartu ringkasan: total pendapatan kos, total pendapatan lain-lain, total gabungan, jumlah transaksi.
- Tabel **rekap per penghuni**: nama, kamar, jumlah pembayaran, total dibayar, periode terakhir sampai kapan.
- Tabel **rekap per periode** (per bulan pembayaran): total kos, total lain-lain, total.
- Rincian per cara bayar (QRIS / Transfer Bank / Tunai).
- Ikut terekspor lewat tombol ekspor yang sudah ada (Excel/CSV/PDF) sebagai sheet/section pendapatan.

## 2. Edit & hapus pendapatan
Tombol edit dan hapus (dengan dialog konfirmasi) sudah ada di halaman Pendapatan. Yang dilengkapi:
- Saat periode diubah di mode edit, tanggal selesai dihitung ulang otomatis dari tanggal mulai + jumlah bulan, dan ditampilkan sebagai teks bantu sebelum disimpan.
- Teks konfirmasi hapus diperjelas (nama penghuni, tanggal bayar, nominal) dan hapus tidak bisa terjadi tanpa konfirmasi.
- Sama untuk pendapatan lain-lain.

## 3. Validasi & pratinjau bukti transfer
Di form pendapatan:
- Hanya JPG/PNG/WEBP/HEIC dan PDF diterima; file lain ditolak dengan pesan jelas.
- Ukuran maksimum 10MB per file sebelum kompresi; lebih dari itu ditolak.
- Pratinjau: gambar tampil sebagai thumbnail, PDF tampil sebagai kartu berlabel halaman.
- Indikator status per file: menunggu, mengunggah (spinner + nama file), berhasil, gagal + tombol coba lagi.

## 4. Section "Pendapatan lain-lain"
Section terpisah di halaman Pendapatan dengan field: nama/judul, tanggal, keterangan, nama pembayar, jumlah, cara pembayaran (QRIS/Transfer Bank/Tunai), dan upload tanda terima. Lengkap dengan daftar, pencarian, edit, dan hapus berkonfirmasi. Nilainya ikut dijumlahkan ke total pendapatan di Laporan.

## 5. Kode unik inventaris
Setiap barang (kamar & fasilitas) punya kode unik dibuat otomatis saat input, format `KSR-210826-01`:
- 3 huruf pertama dari singkatan nama barang (huruf besar, spasi/tanda baca dibuang).
- Tanggal beli `ddmmyy`.
- Nomor urut 2 digit untuk kode yang kembar.
Kalau tanggal beli belum diisi, kode dibiarkan kosong dan otomatis terbentuk begitu tanggal beli disimpan. Kode ditampilkan di form (read-only), kartu barang, detail kamar, halaman fasilitas, dan tersedia sebagai kolom di Laporan/ekspor.

## Catatan teknis
- Migrasi database: tabel baru `other_incomes` (nama, tanggal, keterangan, pembayar, jumlah, cara bayar, lampiran) dengan GRANT + RLS mengikuti pola tabel lain; kolom `code text` pada `room_items` dan `shared_items` plus backfill kode untuk baris yang sudah punya tanggal beli.
- Pembuatan kode di helper `src/lib/item-code.ts`, dipakai saat insert/update di `src/lib/item-payload.ts`; urutan diambil dari kode yang sudah ada dengan prefix sama.
- `src/lib/income.ts` ditambah query/mutasi `other_incomes` dan helper agregasi per penghuni/periode; `src/lib/report.ts` + `report-export.ts` dipakai untuk section pendapatan di Laporan.
- Validasi/pratinjau unggahan ditangani di komponen uploader bukti pendapatan (varian dari `AttachmentUploader`) tanpa mengubah alur unggahan pengeluaran.
