# PORTFOLIO WUTHERING WAVES — PHASE 2 / STEP 1
## Prompt Eksekusi Antigravity: Hero Section, Navbar Transparan, Kerangka Arsitektur Halaman

> **Cara pakai:** Kirim file ini ke Antigravity BERSAMA `PHASE1_COMPLETION_REPORT.md` (agar
> agent tahu komponen apa saja yang sudah ada dan harus dipakai ulang, bukan dibangun dari nol).
> Screenshot referensi game TIDAK perlu dilampirkan di step ini — Hero & Navbar di step ini
> lebih bersifat komposisi original mengikuti gaya yang sudah dibangun di Phase 1 (grid
> background, font, cursor), bukan replika layout spesifik dari satu screen game tertentu.
> Simpan screenshot Journey Log & Select Resonator untuk prompt Step 2 (Projects) nanti.

---

## 1. ROLE

Anda adalah senior frontend engineer yang melanjutkan pembangunan portofolio Next.js bertema
*Wuthering Waves*. Phase 1 (Splash Screen & Landing Page) sudah selesai — lihat
`PHASE1_COMPLETION_REPORT.md` untuk detail komponen yang sudah ada. Phase 2 dipecah bertahap;
**Step 1 ini HANYA mencakup**: Hero Section, Navbar transparan, dan kerangka arsitektur halaman
utama (`/`) tempat section-section berikutnya akan ditambahkan di step-step selanjutnya.

**Jangan membangun** Projects, Experience, Tech Stack, About, atau Contact secara penuh di step
ini — cukup buat placeholder/stub kosong bertanda (`<section id="projects">TODO Step 2</section>`
dst.) agar struktur scroll & anchor sudah berfungsi, tanpa konten sungguhan.

---

## 2. TASK

1. Bangun `HeroSection` sebagai section pertama halaman utama, muncul setelah user klik
   "Tap to Start" di Landing Page.
2. Bangun `Navbar` transparan yang muncul (fade-in) setelah user scroll melewati Hero, dengan
   link ke 5 section berikutnya (masih berupa anchor scroll ke stub kosong untuk saat ini).
3. Susun kerangka halaman utama `app/page.tsx` (atau struktur App Router yang sesuai) sebagai
   scroll container berisi Hero + 5 section stub, dengan id/anchor yang jelas untuk tiap section.
4. Siapkan skeleton rute `app/projects/[slug]/page.tsx` (boleh halaman placeholder kosong dulu)
   sebagai fondasi routing detail project di step berikutnya.

---

## 3. CONTEXT

**Komponen Phase 1 yang WAJIB dipakai ulang, bukan dibuat baru:**
- `SceneBackground` — background grid + efek falling rain, harus tetap tampil konsisten di
  balik Hero (dan idealnya seluruh halaman utama, bukan cuma Splash/Landing).
- `CustomCursor` — kursor JS custom, harus tetap aktif dan tidak boleh rusak/flicker saat
  masuk ke Hero (component-nya kemungkinan perlu dipindah ke root layout jika belum).
- Font Lagu Sans (`--font-lagu-sans`) & Solaris Script (`--font-solaris-script`) via
  `next/font/local` — reuse konfigurasi yang sudah ada, jangan setup ulang dari nol.
- `NameTitle` dengan `layoutId` — **opsional**: bisa dipakai lagi untuk logo kecil di pojok
  Navbar sebagai lanjutan morph dari Landing, TAPI ini fitur opsional/nice-to-have, bukan
  wajib untuk Step 1. Jika kompleksitasnya tinggi, boleh dilewati dulu dan Navbar pakai
  wordmark statis biasa.

**Tech stack:** tetap Next.js App Router, Tailwind CSS, Framer Motion — konsisten dengan Phase 1.

---

## 4. REASONING

| Elemen | Keputusan | Status |
|---|---|---|
| Transisi Landing → Hero | Begitu klik "Tap to Start", halaman utama (`/`) dimuat dengan Hero sebagai section pertama; TIDAK perlu animasi morph sekompleks Splash→Landing, transisi fade/scale sederhana sudah cukup | Rekomendasi |
| Background di Hero & seterusnya | Pakai ulang `SceneBackground`, konsisten dari Splash/Landing — TIDAK ganti jadi background baru | Sesuai keputusan Anda sebelumnya (background placeholder dipertahankan) |
| Navbar muncul kapan | Fade-in setelah scroll melewati ~80-90% tinggi Hero (bukan langsung muncul dari awal Hero, biar Hero terasa "bersih" dulu) | Rekomendasi — bisa disesuaikan setelah dilihat langsung |
| Navbar isi | 5 link: Projects · Experience · Tech Stack · About · Contact, scroll-to-anchor | Sesuai instruksi Anda |
| 4 ikon menu Landing (Exit/Bulletin/Tools/Account) | TIDAK dipindahkan ke Navbar, TIDAK dipakai sama sekali — sesuai konfirmasi Anda bahwa ini tidak dibutuhkan | Dikonfirmasi |
| Struktur halaman | Satu file scroll container dengan section-section sebagai children, TIDAK pakai routing terpisah untuk overview (routing hanya untuk detail project) | Sesuai instruksi Anda |

---

## 5. OUTPUT PROMPT

### 5.1 Struktur Komponen
```
components/
  hero/
    HeroSection.tsx
  navbar/
    Navbar.tsx
    NavLink.tsx
  sections/
    ProjectsSectionStub.tsx      // placeholder kosong, id="projects"
    ExperienceSectionStub.tsx    // placeholder kosong, id="experience"
    TechStackSectionStub.tsx     // placeholder kosong, id="tech-stack"
    AboutSectionStub.tsx         // placeholder kosong, id="about"
    ContactSectionStub.tsx       // placeholder kosong, id="contact"
app/
  page.tsx                        // scroll container: Hero + semua stub section
  projects/
    [slug]/
      page.tsx                    // placeholder halaman detail project (belum ada isi nyata)
hooks/
  useActiveSection.ts              // deteksi section mana yang sedang di-scroll, untuk highlight Navbar
  useNavbarVisibility.ts           // kontrol fade-in Navbar berdasarkan scroll position
```

### 5.2 Hero Section — detail
- Konten: nama (bisa reuse `NameTitle` dalam ukuran lebih kecil/statis, atau elemen baru),
  role (reuse dua nilai role dari Landing: "Fullstack Developer" / "Software Engineer"),
  tagline singkat, tombol resume/CV, indikator "scroll down" (ikon panah kecil animasi bounce
  halus di bawah).
- Background: `SceneBackground` tetap jalan di belakang, TANPA parallax (parallax masih di
  luar scope, sesuai keputusan Phase 1).
- Full viewport height (`min-h-screen`), transisi masuk dari Landing berupa fade sederhana.

### 5.3 Navbar — detail
- Posisi: `fixed` di atas, transparan (tanpa background solid/blur berat — cukup transparan
  penuh atau subtle backdrop-blur tipis kalau teks kurang terbaca di atas background terang).
- Fade-in via `useNavbarVisibility` (berbasis scroll Y position terhadap tinggi Hero).
- 5 link scroll-to-anchor ke section stub, dengan highlight section aktif via
  `useActiveSection` (Intersection Observer, bukan scroll listener manual berat).
- Style monoline, letter-spacing lebar, font kecil (bukan Lagu Sans — reserved untuk judul
  besar, Navbar pakai font default/system agar tidak terlalu ramai).

### 5.4 Section Stub
Tiap stub cukup: `<section id="{slug}" className="min-h-screen flex items-center justify-center"><p className="opacity-30">TODO: {NamaSection} — Step {N}</p></section>` —
tujuannya HANYA memastikan scroll & anchor Navbar berfungsi, bukan estetika.

### 5.5 Routing Skeleton
`app/projects/[slug]/page.tsx` — halaman placeholder sederhana yang menerima `params.slug`,
render teks "Detail project: {slug} — akan diisi di Step 2", tanpa logic data fetching nyata
dulu (data project belum ada).

---

## 6. VALIDATION INDICATORS

- [ ] Klik "Tap to Start" di Landing Page berpindah ke halaman utama, Hero Section tampil
      dengan `SceneBackground` & `CustomCursor` tetap aktif tanpa bug/flicker.
- [ ] Scroll dari Hero ke bawah menampilkan 5 section stub berurutan (Projects → Experience →
      Tech Stack → About → Contact), masing-masing dengan id/anchor yang benar.
- [ ] Navbar transparan muncul (fade-in) setelah scroll melewati Hero, TIDAK terlihat sama
      sekali saat masih di Hero bagian atas.
- [ ] Klik link Navbar melakukan smooth-scroll ke section stub terkait, dan link tersebut
      ter-highlight saat section-nya sedang di viewport.
- [ ] Navigasi ke `/projects/apapun` menampilkan halaman placeholder tanpa error 404.
- [ ] Tidak ada elemen dari 4 ikon menu Landing Page lama (Exit/Bulletin/Tools/Account) yang
      dipindahkan atau muncul di Navbar baru.
- [ ] Font, cursor custom, dan background tetap konsisten secara visual dari Splash/Landing
      ke Hero — tidak ada "reset" gaya visual yang terasa janggal.

---

## 7. HAL YANG PERLU DIKONFIRMASI SETELAH STEP 1 SELESAI

1. Apakah Navbar fade-in di ~80-90% tinggi Hero sudah terasa pas, atau perlu dimajukan/dimundurkan?
2. Apakah logo/nama kecil di Navbar mau pakai lanjutan morph `layoutId` dari Landing (fitur
   opsional di 5.2), atau cukup wordmark statis biasa untuk sekarang?
3. Konfirmasi urutan section final: Projects → Experience → Tech Stack → About → Contact —
   apakah urutan ini sudah final atau masih bisa berubah sebelum Step 2 (Projects) dimulai?

---

## 8. NEXT STEP

Setelah Step 1 ini selesai dan divalidasi, saya akan susun prompt Step 2: **Projects Section**
dengan gaya Journey Log (timeline horizontal, 2-tingkat expand) — di situ baru screenshot
referensi Journey Log (#9/#10) dan Select Resonator (#12) akan dilampirkan ke Antigravity.
