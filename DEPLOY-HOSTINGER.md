# Deploy ke Hostinger — Checklist

Situs ini statis. Tidak perlu PHP, MySQL, atau build step.

## 1. Prasyarat

- Domain sudah mengarah ke Hostinger.
- SSL/HTTPS aktif di hPanel (Let's Encrypt).
- Akses File Manager atau FTP/SFTP ke `public_html`.
- Backup file lama di `public_html` sebelum menimpa.

## 2. Yang di-upload

Upload **isi** folder `public/` ke `public_html`:

```text
public_html/
├─ index.html
├─ 404.html
├─ styles.css
├─ script.js
├─ robots.txt
├─ .htaccess
└─ assets/
```

Jangan upload:

- `AGENTS.md`
- `docs/internal/`
- PDF profil komunitas
- `.git/`
- `.gitignore`
- `README.md`
- `DEPLOY-HOSTINGER.md`

> `.htaccess` adalah file tersembunyi. Aktifkan "Show hidden files" di File Manager atau upload lewat FTP.

## 3. Aktifkan HTTPS

1. hPanel → SSL → pasang SSL gratis untuk domain.
2. Aktifkan **Force HTTPS**.
3. Baru setelah HTTPS aktif, `.htaccess` akan mengarahkan HTTP → HTTPS dengan aman.

Jika SSL belum aktif, redirect HTTPS di `.htaccess` bisa membuat situs tidak bisa dibuka.

## 4. Setelah upload

Tes halaman utama:

```bash
curl -I https://domain-anda.com/
```

Pastikan muncul:

- `HTTP/2` atau `HTTP/1.1 200`
- `content-security-policy`
- `strict-transport-security`
- `x-content-type-options: nosniff`
- `x-frame-options: DENY`
- `referrer-policy`
- `permissions-policy`
- `cache-control`
- `content-encoding: br` atau `gzip`

Tes file privat harus **404**:

```bash
curl -I https://domain-anda.com/AGENTS.md
curl -I https://domain-anda.com/docs/internal/Profil%20Komunitas%20Tunas%20Baik%20Indonesia.pdf
curl -I https://domain-anda.com/.git/config
```

Tes 404:

```bash
curl -I https://domain-anda.com/halaman-tidak-ada
```

Harus mengembalikan `404` dan menampilkan `404.html`.

## 5. Tes manual

- Buka di mobile, tablet, desktop.
- Menu mobile bisa dibuka/ditutup, Escape berfungsi.
- Lightbox galeri bisa dibuka, next/prev, Escape.
- Link WhatsApp, email, dan Instagram berfungsi.
- Semua gambar dan font tampil.
- Buka DevTools → Console, pastikan tidak ada CSP violation.

## 6. CSP

CSP di `.htaccess` memakai hash untuk:

- inline script `document.documentElement.classList.add('js');`
- inline JSON-LD
- inline `<style>` di dalam `<noscript>`

Jika salah satu blok inline di `public/index.html` diubah, hash CSP harus dihitung ulang. Jika tidak, browser akan memblokir blok tersebut.

Cek console browser setelah deploy. Pesan seperti `Refused to execute inline script` berarti hash perlu diperbarui.

## 7. SEO setelah domain final

Belum dikerjakan karena domain final belum diketahui:

- Ganti `og:image` menjadi URL absolut 1200×630 (JPEG/PNG).
- Tambahkan `canonical`.
- Tambahkan `og:url`.
- Tambahkan `twitter:image`.
- Tambahkan `url` di JSON-LD.
- Buat `sitemap.xml`.
- Tambahkan baris `Sitemap:` di `robots.txt`.
- Tentukan canonical `www` vs non-`www`.

## 8. HSTS

Saat ini:

```text
Strict-Transport-Security: max-age=31536000
```

Jangan langsung menambahkan `includeSubDomains; preload` kecuali semua subdomain sudah HTTPS. Setelah stabil, baru pertimbangkan:

```text
max-age=31536000; includeSubDomains; preload
```

## 9. Cache dan update

- HTML: `no-cache`.
- CSS/JS: 1 hari.
- Gambar/font: 30 hari.

Jika mengubah `styles.css` atau `script.js`, pertimbangkan menambahkan versi di HTML, misalnya:

```html
<link rel="stylesheet" href="styles.css?v=20261108">
<script src="script.js?v=20261108" defer></script>
```

Tanpa versioning, pengunjung bisa melihat versi lama hingga cache 1 hari.

## 10. Rollback

- Simpan backup `public_html` sebelum deploy.
- Simpan PDF dan `AGENTS.md` hanya di lokal/private storage.
- Jangan upload ulang seluruh root proyek.

## 11. Troubleshooting

- **500 Internal Server Error setelah upload**  
  Biasanya karena direktif `.htaccess` tidak diizinkan. Coba comment `Options -Indexes` atau blok `mod_brotli` terlebih dahulu, lalu hubungi support Hostinger jika masih 500.

- **Redirect loop**  
  Pastikan SSL aktif. Jika memakai Cloudflare/proxy, cek header `X-Forwarded-Proto`.

- **Header security tidak muncul**  
  Pastikan `mod_headers` aktif. Di LiteSpeed, `.htaccess` tetap didukung, tetapi beberapa direktif bisa berbeda.

- **CSP violation di console**  
  Perbarui hash inline script/style di `.htaccess` setelah mengubah blok inline di `index.html`.

- **Halaman 404 tidak tampil**  
  Pastikan `404.html` ada di `public_html` dan `ErrorDocument 404 /404.html` tidak terhapus.

## 12. Opsional: deploy otomatis

Jika ingin otomatis dari GitHub:

- Gunakan GitHub Actions + FTP/SFTP ke Hostinger.
- Simpan kredensial FTP di GitHub Secrets.
- Deploy hanya isi `public/`, bukan root repo.
