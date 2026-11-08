# Tunas Baik Indonesia — Landing Page

Situs statis satu halaman untuk Komunitas Tunas Baik Indonesia.

## Struktur

```text
.
├─ public/                 # Deploy root — hanya folder ini yang dipublikasikan
│  ├─ index.html
│  ├─ styles.css
│  ├─ script.js
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

- Arahkan **publish directory** hosting ke `public/`, bukan ke root proyek.
- Jangan mempublikasikan `docs/internal/` atau `AGENTS.md`.
- Setelah deploy, pastikan URL berikut mengembalikan **404/403**:
  - `/AGENTS.md`
  - `/Profil Komunitas Tunas Baik Indonesia.pdf`
- Tambahkan HTTPS, security headers, compression, dan caching di level hosting.

## Catatan

- `AGENTS.md` dan `docs/internal/` diabaikan oleh Git agar tidak masuk repo publik. Jika PDF perlu di-versioning, gunakan private repository + Git LFS, atau simpan di cloud storage privat.
- PDF profil komunitas berisi foto dan informasi kegiatan; lakukan review consent/privacy sebelum dipublikasikan dalam bentuk apa pun.
