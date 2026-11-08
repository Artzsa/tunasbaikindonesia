# Tunas Baik Indonesia — Landing Page

Situs statis satu halaman untuk Komunitas Tunas Baik Indonesia.

## Struktur

```text
.
├─ public/                 # Deploy root — hanya folder ini yang dipublikasikan
│  ├─ index.html
│  ├─ 404.html
│  ├─ styles.css
│  ├─ script.js
│  ├─ robots.txt
│  ├─ .htaccess
│  └─ assets/
├─ docs/
│  └─ internal/            # Dokumen privat — JANGAN di-deploy
│     └─ Profil Komunitas Tunas Baik Indonesia.pdf
├─ AGENTS.md               # Instruksi internal, di-ignore (tidak di-commit)
└─ .gitignore
```

## Menjalankan secara lokal

Tidak ada build step. Jalankan static server dengan root `public/`:

```bash
npx serve public
```

Atau buka `public/index.html` langsung di browser.

## Deploy

Panduan langkah demi langkah untuk Hostinger ada di **[DEPLOY-HOSTINGER.md](DEPLOY-HOSTINGER.md)**.

Ringkasnya:
- Arahkan **publish directory** hosting ke `public/`, bukan ke root proyek.
- Upload **isi** `public/` ke `public_html`.
- `.htaccess`, `404.html`, dan `robots.txt` sudah disiapkan di `public/`.
- Jangan mempublikasikan `docs/internal/` atau `AGENTS.md`.
- Setelah deploy, pastikan URL berikut mengembalikan **404/403**:
  - `/AGENTS.md`
  - `/Profil Komunitas Tunas Baik Indonesia.pdf`
- Aktifkan HTTPS/SSL sebelum mengandalkan redirect dan HSTS di `.htaccess`.

## Catatan

- `AGENTS.md` dan `docs/internal/` diabaikan oleh Git agar tidak masuk repo publik. Jika PDF perlu di-versioning, gunakan private repository + Git LFS, atau simpan di cloud storage privat.
- PDF profil komunitas berisi foto dan informasi kegiatan; lakukan review consent/privacy sebelum dipublikasikan dalam bentuk apa pun.
