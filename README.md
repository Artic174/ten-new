# ten-new - Kelas Management (Next.js + MongoDB)

Project minimal untuk:
- Otentikasi akun (username format `10-<absen>`)
- Role-based access: student, bendahara, kerohanian, admin
- CRUD jadwal (bendahara)
- CRUD catatan shalat Dzuhur (kerohanian)
- Statistik per-bulan / per-siswa

Stack:
- Next.js (Pages Router) — cocok untuk Vercel
- MongoDB (Mongoose)
- JWT (cookie httpOnly)
- bcryptjs

Setup:
1. Clone repo.
2. Buat file `.env.local` berdasarkan `.env.example`.
3. Install dependencies:
   ```
   npm install
   ```
4. Jalankan dev:
   ```
   npm run dev
   ```
5. Untuk deploy ke Vercel: hubungkan repo, set environment variables, deploy.

Environment variables (lihat .env.example):
- MONGODB_URI
- JWT_SECRET
- NEXT_PUBLIC_API_BASE (opsional)

Catatan:
- Default pages & API minimal, perlu finishing UI/ux dan validasi tambahan untuk produksi.
- Pastikan MongoDB Atlas whitelist IP (atau gunakan 0.0.0.0/0 saat testing).