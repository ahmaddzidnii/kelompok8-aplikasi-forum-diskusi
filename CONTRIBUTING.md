# 📘 STANDARISASI WORKFLOW GITHUB

Dokumen ini menjelaskan standar alur kerja (workflow), penamaan branch, format commit, serta aturan kontribusi untuk menjaga konsistensi dan kualitas kode di repository ini.

---

## 🗂️ STRUKTUR BRANCH

Branch `main` adalah branch utama untuk versi produksi/stabil.

### Jenis-jenis branch:

| Jenis Branch | Format | Deskripsi |
|--------------|--------|-----------|
| Fitur        | `feature/nama-fitur` | Untuk pengembangan fitur baru |
| Perbaikan Bug | `bugfix/nama-bug`   | Untuk memperbaiki bug |
| Perbaikan Mendesak | `hotfix/nama-hotfix` | Untuk perbaikan langsung di production |
| Dokumentasi  | `docs/nama-dokumen` | Untuk perubahan dokumentasi |
| Eksperimen   | `experiment/nama`   | Untuk percobaan atau prototipe (opsional) |

### Contoh:
- `feature/user-authentication`
- `bugfix/fix-login-error`
- `docs/update-api-guide`

---

## 🔄 ALUR KERJA (WORKFLOW)

1. **Clone** repository ke lokal.
2. **Buat branch baru** sesuai fitur/perubahan yang akan dikerjakan.
3. Lakukan perubahan dan **uji coba lokal** jika diperlukan.
4. **Commit** dengan format pesan yang sesuai.
5. **Push** ke remote branch pribadi.
6. **Buka Pull Request (PR)** ke branch `main`.
7. Tunggu proses **review dan approval** sebelum merge.

---

## ✅ FORMAT PESAN COMMIT

Gunakan format berikut:
[type]: deskripsi singkat perubahan

### Jenis commit yang disarankan:

| Tipe | Deskripsi |
|------|-----------|
| `feat` | Penambahan fitur baru |
| `fix` | Perbaikan bug |
| `docs` | Perubahan dokumentasi |
| `style` | Perubahan tampilan / format kode tanpa mengubah logika |
| `refactor` | Perubahan struktur kode tanpa mengubah fungsionalitas |
| `test` | Penambahan atau pembaruan unit/integration test |
| `chore` | Perubahan non-fungsional seperti konfigurasi build tools |

### Contoh commit:
- feat: add login and register page
- fix: resolve crash when opening profile
- docs: update API usage section
- style: format code with Prettier
- refactor: simplify user data fetching


---

## 🔍 REVIEW DAN PULL REQUEST

- Semua perubahan harus melalui **Pull Request** (PR).
- **Minimal 1 reviewer** harus menyetujui sebelum merge.
- Jangan melakukan merge jika:
  - Masih ada komentar yang belum diselesaikan
  - Masih ada konflik yang belum dibereskan
- Gunakan label dan deskripsi PR yang **jelas dan informatif**.

---

## 📄 DOKUMENTASI

- Tambahkan dokumentasi pada setiap fitur atau fungsi baru (jika diperlukan).
- Update README atau dokumentasi lain jika perubahan kamu memengaruhi penggunaan aplikasi oleh user atau developer lain.

---

## ⚠️ PENTING UNTUK DIPERHATIKAN

- Jangan commit langsung ke `main`, kecuali maintainer yang memiliki izin.
- Hindari commit dengan pesan tidak jelas seperti:
  - `update`, `fix bug`, `coba-coba`, `oke`, dll.
- Pastikan tidak ada **data sensitif** yang ikut di-commit (seperti password, token, dsb).
- Usahakan perubahanmu bersih, fokus pada 1 topik per PR.

---

## 💬 BERTANYA ATAU DISKUSI

Jika ada hal yang belum jelas:
- Gunakan fitur **Issue** untuk melaporkan bug atau pertanyaan.
- Gunakan **Discussion** (jika diaktifkan) untuk berdiskusi lebih terbuka.

---

Terima kasih telah mengikuti standarisasi ini dan menjaga kualitas project bersama! 🙌
