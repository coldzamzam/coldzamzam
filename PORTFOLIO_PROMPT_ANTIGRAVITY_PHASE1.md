# PORTFOLIO WUTHERING WAVES — PHASE 1 (Revisi 2)
## Prompt Eksekusi untuk Antigravity: Splash Screen & Landing Page

> **Cara pakai dokumen ini:** Lampirkan file ini SEKALIGUS 2 screenshot referensi
> (`Screenshot_2026-07-08_114659.png` = splash/loading screen,
> `Screenshot_2026-07-08_114338.png` = landing/login screen) ke chat Antigravity dalam satu pesan.
> Screenshot dipakai HANYA untuk referensi *layout, tipografi, dan mood UI* (posisi elemen,
> bentuk tombol, gaya teks) — BUKAN untuk background/ilustrasi. Lihat Bagian 3 soal ini.

> **Perubahan dari revisi sebelumnya:** dokumen ini menggantikan draft Phase 1 sebelumnya
> secara keseluruhan. Perubahan utama: sistem parallax DIHAPUS dari scope (dipindah ke
> backlog Phase 2/fitur terpisah), background dikunci memakai grid/kotak-kotak statis untuk
> kedua layar, splash memakai session-gate, dan role memakai dua nilai.

---

## 1. ROLE

Anda adalah senior frontend engineer yang mengerjakan **Phase 1** dari rebuild total portofolio
Next.js bertema game *Wuthering Waves*. Direktori project Next.js dasar sudah ada dari eksekusi
prompt sebelumnya — isinya masih kerangka awal dan akan dirombak ulang. Fokus Phase 1 **hanya**
pada dua layar: Splash Screen dan Landing Page. Bagian lain (Projects, About, Tech Stack,
Experience, Contact, dan sistem parallax) BELUM dirancang/di luar scope — jangan berasumsi atau
membangun bagian tersebut di luar dokumen ini.

---

## 2. TASK

Bangun ulang (rombak total, bukan tambal) dua komponen berikut sesuai spesifikasi di Bagian 5:

1. `SplashScreen` — layar pembuka: black screen → loading screen bergaya game → transisi morph
   ke Landing Page. Tampil **sekali per sesi browser** (lihat 5.3).
2. `LandingPage` — layar "menu login" gaya game, menampilkan nama, role, dan tombol masuk.

Kedua layar TIDAK memiliki scroll vertikal — perlakukan sebagai fixed full-viewport screen.
Kedua layar TIDAK memiliki parallax/mouse-tracking di Phase 1 — background statis dulu.

---

## 3. CONTEXT

**Referensi visual:** 2 screenshot dari game Wuthering Waves. Dipakai HANYA untuk acuan posisi
elemen UI (letak logo, menu, tombol, watermark, teks) dan gaya tipografi/mood — **bukan** untuk
background maupun ilustrasi karakter. Background asli belum ditentukan Anda, jadi Phase 1
memakai placeholder grid/kotak-kotak (dijelaskan di 5.3) untuk KEDUA layar, konsisten.

**Tech stack (rekomendasi, mohon konfirmasi bila project existing sudah punya pilihan lain):**
- Next.js (App Router)
- Tailwind CSS untuk styling
- Framer Motion untuk animasi morph & fade (parallax TIDAK dipakai di Phase 1)
- `next/font/local` untuk self-host font kustom

**Font:**
- **Lagu Sans** — font utama untuk judul nama & UI, unduh dari https://font.download/font/lagu-sans.
  Cek lisensi filenya sebelum commit ke repo — saya tidak bisa memastikan lisensi persisnya.
- **Solaris-3-Script** — font aksen, dipakai TERBATAS untuk elemen kecil dekoratif (mis. teks
  ornamen di bawah tombol "Tap to Start"), jangan dipakai untuk teks panjang/body.

**Konten identitas:**
- Nama: **Aqsa Zamzami** — tampil 2 baris pada judul.
- Role: dua nilai — **"Fullstack Developer"** dan **"Software Engineer"** (lihat 4.2 & 5.4 untuk
  cara presentasinya).

---

## 4. REASONING

### 4.1 Splash Screen
| Elemen | Keputusan | Status |
|---|---|---|
| Black screen awal | 300–500ms full black sebelum render apa pun | Rekomendasi |
| Transisi ke loading screen | fade + slight blur, ~400ms | Rekomendasi |
| Background loading screen | grid/kotak-kotak statis tipis di atas gradient navy-gelap, TANPA parallax/gerak berbasis mouse | **Dikonfirmasi** |
| Watermark pojok kanan atas | teks versi build project, mis. `Portfolio_v{version}_{buildhash}`, boleh statis dulu | Rekomendasi, opsional dynamic |
| Ikon "Notice" & "Repair" kanan atas | dekoratif saja, non-interaktif di Phase 1 | Rekomendasi |
| Judul nama tengah | "Aqsa Zamzami" 2 baris, font Lagu Sans, ukuran medium | Sesuai instruksi |
| Teks loading kiri bawah | cycle beberapa frasa custom, ganti tiap ~500–700ms | Rekomendasi |
| Progress bar | width penuh, fill kiri→kanan, total durasi splash ±1.5–2.5 detik | Rekomendasi |
| Gate tampil splash | **hanya sekali per sesi browser**, pakai `sessionStorage`; navigasi internal berikutnya skip splash | **Dikonfirmasi** |
| Transisi keluar splash | shared-element morph nama (Framer Motion `layoutId`) menuju posisi di Landing Page | Sesuai instruksi |

### 4.2 Landing Page
| Elemen | Keputusan | Status |
|---|---|---|
| Background | grid/kotak-kotak statis, SAMA seperti splash (konsisten), TANPA ilustrasi gunung/karakter/komet, TANPA parallax | **Dikonfirmasi** |
| Logo pojok kiri atas | wordmark "AQSA ZAMZAMI" kecil, Lagu Sans | Rekomendasi |
| Watermark kanan atas | sama seperti splash, kontinuitas branding | Rekomendasi |
| Menu ikon vertikal kanan (4 item, meniru posisi Exit/Bulletin/Tools/Account) | **saran pemetaan awal**: `Exit → Toggle Theme/Bahasa`, `Bulletin → Resume/CV`, `Tools → Projects`, `Account → Contact`. Ini murni saran, Anda akan finalisasi sendiri nanti | **Belum final — tetap ditandai untuk direvisi Anda** |
| Area tengah (bekas posisi 2 karakter) | dikosongkan / diisi elemen tipografi & tombol saja, tanpa placeholder ilustrasi apa pun, karena background tidak relevan dipakai | **Dikonfirmasi** |
| Judul nama besar tengah | hasil morph dari splash, tetap di tengah, ukuran membesar | Sesuai instruksi |
| Role di bawah nama | dua nilai "Fullstack Developer" / "Software Engineer" — **saran**: tampilkan sebagai typewriter/cycle text (bergantian dengan efek ketik), fallback statis "Fullstack Developer · Software Engineer" bila animasi dianggap berlebihan | **Saran — perlu konfirmasi Anda pilih yang mana** |
| Tombol "Tap to Start" | bordered rectangle, border tipis, bg transparent, hover glow | Sesuai instruksi |
| Sub-teks bawah tombol | tagline custom + ornamen diamond kecil pakai font Solaris-3-Script | Rekomendasi |
| Status pojok (Login Status / Online indicator) | status dekoratif statis, mis. "Status: Online", TANPA backend counter nyata di Phase 1 | Rekomendasi |

### 4.3 Parallax — DIPINDAH KE BACKLOG
Fitur parallax (horizontal, mengikuti mouse atau mekanisme lain) resmi **di luar scope Phase 1**,
akan dirancang terpisah setelah konsepnya matang. Jangan implementasikan `useMouseParallax`,
layer depth, atau sistem transform berbasis posisi kursor apa pun di Phase 1. Cukup catat di
komentar kode (mis. `// TODO(phase-2): parallax system, lihat backlog terpisah`) sebagai penanda
titik ekstensi di masa depan, tanpa membangun implementasinya sekarang.

---

## 5. OUTPUT PROMPT (spesifikasi teknis untuk dieksekusi)

### 5.1 Struktur Komponen
```
components/
  splash/
    SplashScreen.tsx
    LoadingBar.tsx
    LoadingTextCycler.tsx
  landing/
    LandingPage.tsx
    StartButton.tsx
    StatusIndicator.tsx
    RoleCycler.tsx            // menampilkan 2 role, cycle/typewriter (lihat 5.4)
  scene/
    SceneBackground.tsx       // background grid/kotak-kotak statis, dipakai splash & landing
  shared/
    VersionWatermark.tsx      // dipakai splash & landing
    NameTitle.tsx              // shared-element/layoutId antara splash & landing
hooks/
  useLoadingSequence.ts        // kontrol progress % dan teks cycling
  useSplashGate.ts              // logic: tampilkan splash hanya sekali per sesi via sessionStorage
lib/
  fonts.ts                      // next/font/local setup untuk Lagu Sans & Solaris-3-Script
```
Catatan: tidak ada `ParallaxLayer`/`useMouseParallax` di Phase 1 — dihapus dari struktur
sebelumnya sesuai keputusan Bagian 4.3.

### 5.2 Setup Font
- Download file font, taruh di `public/fonts/` atau `app/fonts/`.
- Setup via `next/font/local`, buat CSS variable (`--font-lagu-sans`, `--font-solaris-script`)
  agar bisa dipakai lewat Tailwind (`font-lagu`, `font-solaris`).
- **Catatan lisensi:** verifikasi izin penggunaan font sebelum deploy publik.

### 5.3 Splash Screen — state machine
```
State: BLACK → FADING_IN → LOADING → MORPHING → DONE
```
- `BLACK`: 300–500ms, `<div>` hitam solid.
- `FADING_IN`: fade + blur-out background grid & judul, ~400ms.
- `LOADING`: progress bar 0→100%, teks loading cycling, durasi total ~1.5–2.5 detik (boleh
  disimulasikan, tidak perlu terikat resource loading asli untuk MVP).
- `MORPHING`: progress 100% → trigger shared-element transisi nama (`layoutId="name-title"`)
  menuju posisi & ukuran final di Landing Page, background tetap konsisten (tidak reset/flash).
- `DONE`: unmount SplashScreen, LandingPage fully interactive.

**Session gate (`useSplashGate`):** cek `sessionStorage.getItem('splash_shown')` saat mount.
Jika belum ada → jalankan full sequence lalu set flag `true`. Jika sudah ada → skip langsung
ke `DONE` (render LandingPage tanpa splash). Flag reset otomatis saat tab/browser session
baru (perilaku default `sessionStorage`).

### 5.4 Landing Page — detail elemen
- `NameTitle` pakai `layoutId` sama seperti di splash agar morph mulus.
- `RoleCycler`: tampilkan "Fullstack Developer" dan "Software Engineer" bergantian dengan
  efek typewriter sederhana (ketik → jeda → hapus → ketik role berikutnya), durasi tiap
  siklus wajar (~2–3 detik tampil, transisi ketik/hapus cepat). **Sediakan juga varian
  statis** (`RoleCycler` menerima prop `animated?: boolean`) agar mudah dimatikan bila Anda
  memutuskan animasi ini kurang cocok setelah melihat hasilnya.
- `StartButton` (label: "Tap to Start"): border tipis (~1px), bg transparent, hover →
  border lebih terang + subtle glow shadow, transisi 200ms.
- Menu ikon kanan: vertikal, 4 item sesuai saran pemetaan 4.2, style monoline/outline.
  Implementasikan sebagai placeholder visual dulu (belum perlu routing/fungsi nyata) karena
  mapping final belum diputuskan.
- `StatusIndicator`: dot kecil + teks "Online", warna hijau.
- `VersionWatermark`: posisi kanan atas, font kecil, opacity ~50–60%, font monospace/default
  (bukan Lagu Sans, untuk kesan "system text" vs "game title").

### 5.5 Scene Background (pengganti sistem parallax lama)
- `SceneBackground`: satu komponen statis — grid/kotak-kotak tipis (garis 1px, opacity
  rendah) di atas gradient navy-gelap, dipakai identik di Splash & Landing untuk konsistensi
  visual. TIDAK ada multi-layer depth, TIDAK ada transform berbasis mouse/scroll.

---

## 6. VALIDATION INDICATORS

- [ ] Splash tampil lengkap (black → fade/blur → loading → morph) HANYA pada kunjungan
      pertama per sesi browser; kunjungan/navigasi berikutnya dalam sesi yang sama langsung
      ke Landing Page tanpa splash.
- [ ] Font Lagu Sans ter-load dengan benar via `next/font/local`, tanpa FOUT/FOIT mengganggu.
- [ ] Transisi morph nama dari splash ke landing terasa satu elemen kontinu.
- [ ] Landing page tidak memiliki scroll vertikal (fixed viewport).
- [ ] Background grid/kotak-kotak identik dipakai di kedua layar, tidak ada elemen parallax,
      mouse-tracking, atau multi-depth layer di kode Phase 1.
- [ ] Role di Landing Page menampilkan kedua nilai ("Fullstack Developer" & "Software
      Engineer"), baik dalam mode cycle maupun statis, dan mudah dimatikan animasinya via prop.
- [ ] Semua teks placeholder (tagline, dsb.) mudah ditemukan/diganti, idealnya lewat satu
      file config/constant.
- [ ] Tidak ada aset visual game (logo, ilustrasi karakter, background asli Wuthering Waves)
      direplikasi langsung — hanya layout/mood yang diadaptasi.
- [ ] Responsive dasar diperhatikan, tidak wajib pixel-perfect di semua breakpoint untuk
      Phase 1, tapi tidak boleh rusak total di mobile.

---

## 7. HAL YANG WAJIB DIKONFIRMASI SEBELUM/SELAMA EKSEKUSI

1. Mapping menu ikon kanan (Exit/Bulletin/Tools/Account) — saran di 4.2 dipakai sementara,
   Anda akan finalisasi sendiri; agent tidak perlu berhenti untuk ini, cukup pakai saran
   sebagai placeholder yang jelas ditandai TODO.
2. Role: pilih mode **animated (typewriter cycle)** atau **statis** untuk Landing Page —
   kalau belum pasti, agent sebaiknya build keduanya via prop `animated` seperti di 5.4 agar
   tidak perlu bolak-balik revisi besar.

*(Poin lain dari draft sebelumnya — parallax, background, session gate — sudah final
berdasarkan konfirmasi Anda, tidak perlu ditanyakan lagi oleh agent.)*

---

## 8. NEXT STEPS (di luar scope Phase 1 — jangan dikerjakan sekarang)

- **Sistem parallax** (horizontal, mekanisme masih dirancang) — backlog terpisah, akan
  dibuatkan prompt sendiri setelah konsepnya matang.
- Transisi dari Landing Page ("Tap to Start") ke halaman/section utama (Hero, Projects, dst.)
- Struktur navigasi antar section
- Background final untuk splash & landing (Anda belum menentukan — grid/kotak-kotak saat ini
  sifatnya sementara/placeholder, bukan keputusan permanen)
- Desain komponen `project`, `tech_stack`, `experience`, `me`, `contact` sesuai schema JSON
  yang sudah Anda tentukan
- Strategi asset management untuk gambar project & foto

Saya bisa bantu susun rancangan Phase 2 (termasuk parallax) begitu Phase 1 ini selesai
dieksekusi dan Anda punya gambaran konsep lebih matang untuk bagian selanjutnya.
