Sistem dokumentasi yang saya sarankan
1. Di GitHub repo — 2 file utama
mireng/
├── CLAUDE.md      ← Konteks teknis untuk Claude (sudah ada)
└── ROADMAP.md     ← Yang baru dibuat ini
Cara pasang ke repo:
bashcp ~/Downloads/ROADMAP.md ~/mireng/ROADMAP.md
cd ~/mireng
git add ROADMAP.md
git commit -m "docs: add project roadmap"
git push

2. Cara pakai di sesi Claude berikutnya
Setiap kali mulai sesi baru, paste ini di awal chat:
Baca CLAUDE.md dan ROADMAP.md di repo mireng.
Lanjutkan dari: [sebutkan fitur terakhir yang dikerjakan]
Saya akan ingat konteks dari memory + baca kedua file itu.

3. Aturan update ROADMAP.md
Setiap kali fitur selesai:

- [ ] → - [x] untuk yang selesai
Update tanggal di bawah
Commit dengan pesan docs: update roadmap - [nama fitur]


4. GitHub Issues (opsional tapi recommended)
Buat label di GitHub:

fase-1, fase-2, fase-3, fase-4
backend, frontend, database
bug, enhancement

Setiap fitur baru = 1 Issue. Ini memudahkan tracking progress secara visual.