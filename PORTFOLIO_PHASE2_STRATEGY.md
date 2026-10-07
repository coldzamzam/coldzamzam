# PORTFOLIO WUTHERING WAVES — PHASE 2
## Dokumen Strategi & Arsitektur Situs (Lengkap)

> Dokumen ini adalah peta besar Phase 2 — bukan untuk dieksekusi sekaligus oleh Antigravity.
> Eksekusi tetap dipecah bertahap (lihat Bagian 5: Roadmap Incremental). File prompt terpisah
> (`PORTFOLIO_PHASE2_PROMPT_ANTIGRAVITY_STEP1_HERO_NAVBAR.md`) berisi eksekusi untuk langkah
> PERTAMA saja: Hero Section + Navbar + kerangka arsitektur halaman.

---

## 0. Konteks — Status Phase 1 (sudah selesai)

Berdasarkan laporan penyelesaian Anda, aset berikut sudah ada dan HARUS dipertahankan/dipakai
ulang secara konsisten di Phase 2:
- `useLoadingSequence` (state machine Splash), `NameTitle` dengan `layoutId` Framer Motion
  (morph nama dari Splash → Landing)
- Font Lagu Sans & Solaris Script via `next/font/local`
- `SceneBackground` — grid + efek "falling rain" cyan bermasking
- Loading bar & text cycler yang sudah diposisikan ulang
- `CustomCursor` — kursor JS custom (`CursorHi.png`), performa 120fps-ready
- **Catatan:** splash gate (`sessionStorage`) dinonaktifkan atas permintaan Anda saat eksekusi —
  splash sekarang selalu diputar tiap refresh. Ini di luar scope Phase 2 dokumen ini; saya
  anggap sebagai keputusan final saat ini kecuali Anda bilang sebaliknya.

Semua elemen di atas (terutama `SceneBackground` dan `CustomCursor`) harus tetap aktif/konsisten
begitu masuk ke halaman utama (Hero dst.), bukan cuma di Splash/Landing.

---

## 1. Arsitektur Navigasi Keseluruhan

```
Splash Screen
    ↓ (morph)
Landing Page ("Tap to Start")
    ↓ (klik)
┌─────────────────────────────────────────────┐
│  HALAMAN UTAMA "/"  (single scrolling page)  │
│                                               │
│  [Navbar transparan — muncul setelah Hero]   │
│                                               │
│  ── Hero Section                             │
│  ── Projects Section  (Journey Log style)    │
│  ── Experience Section                       │
│  ── Tech Stack Section                       │
│  ── About Section                            │
│  ── Contact Section                          │
└─────────────────────────────────────────────┘
    ↓ (klik project tertentu, opsional)
/projects/[slug]  → halaman detail penuh (rute terpisah)
```

**Keputusan yang sudah dikonfirmasi Anda:**
- Tidak ada hub Terminal-style. Navigasi = scroll biasa di satu halaman.
- 4 ikon menu di Landing Page (Exit/Bulletin/Tools/Account) TIDAK dipakai — dihapus dari
  fungsi navigasi, karena navigasi baru relevan setelah masuk ke halaman utama.
- Navbar TRANSPARAN (tanpa balok/background solid), muncul setelah scroll lewat Hero (belum
  ada gambaran pasti dari Anda — detail rancangan navbar saya isi di Bagian 2).
- Section bisa discroll, tapi boleh punya rute detail terpisah untuk konten yang lebih dalam.

---

## 2. Rancangan per Section (mengisi bagian yang belum Anda tentukan)

### 2.1 Navbar Transparan
| Aspek | Rancangan | Status |
|---|---|---|
| Visibilitas | Tersembunyi/transparan penuh di Hero, fade-in muncul begitu user mulai scroll ke Projects | Saran — perlu validasi setelah dilihat langsung |
| Style | Tanpa background/balok solid, teks/ikon link mengambang di atas konten, mirip elemen HUD pojok game (lihat referensi #1/#2/#8 — watermark & ikon pojok yang mengambang tanpa container tebal) | Saran |
| Isi | Link ke tiap section: Projects · Experience · Tech Stack · About · Contact | Sesuai instruksi Anda (5 section ini) |
| Highlight aktif | Section yang sedang di-scroll ditandai (underline tipis/glow), ala highlight tab aktif di referensi (#1/#2, tab "Highlights/Info/News" yang berubah warna saat aktif) | Saran |
| Elemen tambahan opsional | Logo/nama kecil pojok kiri sebagai **lanjutan morph** dari `NameTitle` (`layoutId` yang sama dipakai lagi, mengecil ke pojok navbar) — kontinuitas visual dari Splash→Landing→Navbar | Saran kreatif, opsional, bukan wajib |

### 2.2 Hero Section
Konten: perkenalan nama, role (reuse dua nilai role dari Landing atau versi lebih panjang),
ringkasan singkat/tagline, tombol resume/CV (download atau link), mungkin indikator "scroll
untuk lihat lebih lanjut". Ini section pertama yang dilihat user SETELAH klik "Tap to Start" —
harus terasa sebagai kelanjutan natural dari Landing, bukan reset total.

### 2.3 Projects Section — gaya Journey Log
- Path/jalur bercahaya horizontal (ala #9/#10) menghubungkan node — tiap node = 1 project.
- Tiap node menampilkan: nama project (nickname), tahun, indikator progres/status (bisa
  reinterpretasi kreatif dari "16/16" di referensi — mis. jumlah tech stack dipakai, atau
  status "completed/ongoing").
- Klik node → **expand dua tingkat** seperti referensi #10 (Journey Log yang di-klik membuka
  sub-list chapter): tampilkan ringkasan (desc, contribution, techstack, gambar) inline DULU;
  sediakan tombol "Lihat detail lengkap" yang mengarah ke `/projects/[slug]` untuk konten
  lebih panjang (dokumentasi, galeri gambar lebih banyak, link GitHub).
- Path harus scrollable secara horizontal DI DALAM section vertikal (nested scroll) — atau
  alternatif: path tetap horizontal visual tapi urutannya tetap mengikuti scroll vertikal
  halaman (path "muncul" bertahap saat section masuk viewport). **Ini butuh keputusan Anda
  nanti saat masuk ke Step khusus Projects** — saya tandai sebagai open point untuk prompt
  Projects terpisah, tidak perlu diputuskan sekarang.

### 2.4 Experience Section
Karena motif timeline horizontal sudah dipakai Projects, Experience saya rancang BEDA supaya
tidak monoton:
- **Vertical timeline sederhana**: garis vertikal tipis dengan titik per entry, deskripsi di
  samping, urutan kronologis (terbaru di atas atau bawah — perlu keputusan nanti).
- Alternatif jika ingin tetap ada nuansa "stat card" ala Resonator Overview (#5): tiap entry
  bisa punya mini-card dengan "role", "timeline", dan badge kecil untuk skill/tanggung jawab
  (meniru tag "Support and Healer", "Main Damage Dealer" di #11/#12 sebagai badge peran).
- Rekomendasi saya: mulai dari vertical timeline sederhana dulu (lebih cepat dibangun, tidak
  bentrok visual dengan Projects), badge/stat-card bisa jadi polish di iterasi berikutnya.

### 2.5 Tech Stack Section
- Grid tile ikon+label, ala grid menu Terminal (#7) atau tile besar ala Featured Event (#8).
- Dikelompokkan per `type` (bahasa, framework, tool, dsb.) dengan tab/segmented control
  sederhana — TIDAK perlu modal filter kompleks ala #11 (itu berlebihan untuk jumlah tech
  stack yang biasanya terbatas di portofolio personal, kecuali Anda punya >20 item).
- Hover pada tile → subtle glow + tooltip nama lengkap (untuk ikon yang mungkin ambigu).

### 2.6 About Section
- Gaya Resonator Showcase (#6): foto besar di satu sisi, teks bio/resume di sisi lain.
- Elemen dekoratif dari referensi yang bisa diadaptasi:
  - "User ID" → bisa jadi elemen dekoratif fun, mis. tagline kecil ala signature.
  - "Union Level" / EXP bar → bisa direinterpretasi jadi indikator lucu (mis. "Level" =
    tahun pengalaman, bar = progress skill utama) — **ini gimmick opsional**, jangan
    dipaksakan kalau terasa berlebihan saat dilihat langsung.
- Konten inti tetap: nama, role, resume, background, foto — sesuai schema JSON `me` yang
  sudah Anda tentukan di awal.

### 2.7 Contact Section
- Baris ikon horizontal sederhana (GitHub, Email, LinkedIn, dst.), gaya monoline mengambang
  tanpa container tebal — meniru row ikon utility di bagian bawah Terminal (#7: mail, clock,
  chat, camera, settings).
- Hover → subtle glow, klik → buka link terkait (`mailto:`, external link, dsb.).

---

## 3. Strategi Routing

| Rute | Isi | Prioritas |
|---|---|---|
| `/` | Semua section (Hero → Contact) dalam satu scroll page | Wajib, dibangun duluan |
| `/projects/[slug]` | Detail penuh 1 project (deskripsi panjang, galeri gambar, link) | Opsional, dibangun setelah Projects section overview jadi |
| Rute detail lain (Experience/Tech Stack) | Belum diperlukan kecuali kontennya ternyata terlalu panjang untuk inline | Belum prioritas, evaluasi nanti |

---

## 4. Data & Konten yang Perlu Difinalisasi

- **Duplikat "ardana"** muncul 2 kali di daftar project awal Anda — mohon dicek, kemungkinan
  salah satu seharusnya nama project lain. (notes: emang duplikat, salah satu dihapus aja)
- Skema JSON `project`, `tech_stack`, `experience`, `me`, `contact` dari brief awal Anda tetap
  dipakai sebagai struktur data — belum ada perubahan yang saya usulkan di sana.
- Gambar/screenshot tiap project belum ada — perlu disiapkan sebelum eksekusi Projects section.

---

## 5. Roadmap Incremental (bertahap, sesuai preferensi Anda)

1. **[SEKARANG]** Hero Section + Navbar transparan + kerangka arsitektur halaman (scroll
   container, anchor per section, stub routing `/projects/[slug]`) — lihat file prompt terpisah.
2. Projects Section (Journey Log timeline, 2-tingkat expand)
3. Experience Section (vertical timeline)
4. Tech Stack Section (grid tile + grouping)
5. About Section (Resonator Showcase style)
6. Contact Section (icon row)
7. Polish: transisi antar-section, penyesuaian `CustomCursor` & `SceneBackground` agar
   konsisten di semua section, rute detail project penuh

---

## 6. Hal yang Masih Terbuka (jangan diputuskan sekarang, tunggu sampai step-nya tiba)

- Detail interaksi horizontal-scroll-di-dalam-vertical-scroll untuk Projects path — diputuskan
  saat masuk Step 2.
- Urutan kronologis Experience (terbaru di atas/bawah) — diputuskan saat Step 3.
- Apakah gimmick "Union Level/EXP bar" di About dipakai atau tidak — diputuskan saat Step 5,
  setelah lihat hasil visual awal.
