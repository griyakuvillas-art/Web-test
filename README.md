# ?? InStrategic - Platform Market Insight Saham Indonesia

![InStrategic Banner](https://img.shields.io/badge/InStrategic-Market%20Insight-6800FC?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMTAiIGZpbGw9IiM2ODAwRkMiLz48cGF0aCBkPSJNMTIgMTJWMjhNMjAgMTZWMjhNMjggMjBWMjgiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+)
![Version](https://img.shields.io/badge/version-1.0.0-9D4EDD)
![License](https://img.shields.io/badge/license-MIT-00C853)

## ?? Tentang InStrategic

**InStrategic** adalah platform Market Insight Saham Indonesia yang dirancang untuk membantu investor ritel memahami, menganalisis, dan memantau saham-saham di Bursa Efek Indonesia (BEI) secara mudah dan visual. 

Melalui tampilan yang modern dan interaktif dengan tema gelap futuristik, InStrategic menyajikan data fundamental, valuasi, kinerja keuangan, dan proyeksi pertumbuhan setiap emiten dalam bentuk grafik dan infografik yang sederhana ? sehingga investor tidak perlu membaca laporan keuangan yang rumit.

### ? Fitur Utama

- ?? **Analisis Visual & Mudah** - Data fundamental dalam bentuk grafik, skor, dan infografik
- ? **Data Real-time** - Update harga saham dan indeks langsung dari BEI
- ?? **Screening Cerdas** - Filter saham berdasarkan valuasi, dividen, growth, dan kesehatan keuangan
- ?? **Portfolio Tracking** - Pantau performa portofolio secara otomatis
- ?? **Market Insight Harian** - Analisis pasar, sektor, dan rekomendasi dari tim analis
- ?? **Valuasi Otomatis** - Sistem valuasi menggunakan DCF, P/E, P/B, dan metode lainnya

## ?? Design System

### Color Palette

```css
Primary Purple: #6800FC
Purple Light:   #9D4EDD
Purple Dark:    #5000C0

Background:     #1B132B ? #281C3C (gradient)
Background Alt: #33244A

Positive:       #00C853 (Green)
Negative:       #FF1744 (Red)
Neutral:        #FFB300 (Amber)

Text Primary:   #FFFFFF
Text Secondary: rgba(255, 255, 255, 0.7)
Text Tertiary:  rgba(255, 255, 255, 0.5)
```

### Design Principles

- ? **Glassmorphism** - Kartu transparan dengan backdrop blur
- ? **Neon Glow Effects** - Efek cahaya neon ungu pada elemen interaktif
- ? **Dark Futuristic Theme** - Tema gelap modern dengan gradasi ungu
- ? **Smooth Animations** - Transisi halus dan micro-interactions
- ? **Responsive Design** - Optimal di semua ukuran layar

## ?? Quick Start

### Installation

1. Clone repository ini:
```bash
git clone https://github.com/yourusername/instrategic.git
cd instrategic
```

2. Buka `index.html` di browser:
```bash
# Menggunakan Python
python -m http.server 8000

# Menggunakan Node.js
npx serve

# Atau buka langsung
open index.html
```

3. Akses di browser:
```
http://localhost:8000
```

### File Structure

```
instrategic/
??? index.html          # Main HTML file
??? styles.css          # Styling dengan glassmorphism & animations
??? script.js           # Interactive functionality
??? README.md          # Documentation
```

## ?? Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling dengan:
  - CSS Variables
  - Flexbox & Grid
  - Glassmorphism effects
  - Smooth animations
  - Responsive design
- **Vanilla JavaScript** - Interactive features tanpa dependencies

## ?? Fitur Yang Diimplementasikan

### ? Completed Features

- [x] Modern navigation bar dengan logo InStrategic
- [x] Hero section dengan gradient background dan badge
- [x] Market overview dengan IHSG, LQ45, IDX30
- [x] Live market indicator
- [x] Stock search dengan filter chips
- [x] Stock cards dengan visual scoring system
- [x] Score bars (Value, Growth, Health)
- [x] Sector analysis grid
- [x] Features showcase section
- [x] Premium CTA section dengan floating cards
- [x] Comprehensive footer
- [x] Smooth scroll animations
- [x] Glassmorphism card effects
- [x] Neon glow effects
- [x] Responsive mobile design
- [x] Interactive hover states

### ?? Future Enhancements

- [ ] Integrasi dengan API data saham BEI real-time
- [ ] Advanced charting dengan Chart.js / D3.js
- [ ] User authentication & portfolio management
- [ ] Real-time WebSocket untuk live data
- [ ] Stock detail pages dengan analisis lengkap
- [ ] News & sentiment analysis
- [ ] Stock screening advanced dengan >20 filters
- [ ] Alert system untuk price movements
- [ ] Export portfolio reports (PDF/Excel)
- [ ] Dark/Light mode toggle
- [ ] Multi-language support (ID/EN)

## ?? Inspirasi Design

Platform ini terinspirasi dari [SimplyWall.st](https://simplywall.st/) tetapi dengan:
- ? Design yang lebih modern dan futuristik (2025)
- ?? Tema gelap dengan aksen ungu khas InStrategic
- ???? Focus khusus untuk pasar saham Indonesia
- ?? Glassmorphism dan neon effects yang lebih premium
- ?? UX yang lebih intuitif untuk investor Indonesia

## ?? Target Pengguna

1. **Investor Ritel Pemula** - Butuh analisis visual yang mudah dipahami
2. **Investor Aktif** - Perlu screening dan monitoring cepat
3. **Value Investors** - Fokus pada fundamental dan valuasi
4. **Dividend Investors** - Mencari saham dengan dividen tinggi
5. **Trader** - Memantau momentum dan pergerakan harga

## ?? Model Bisnis

### Free Tier
- ? Akses dasar analisis saham
- ? Data delayed 15 menit
- ? 5 watchlist saham
- ? Insight harian

### Premium Tier (Rp 99.000/bulan)
- ? 800+ analisis saham lengkap
- ? Data real-time
- ? Unlimited watchlist & portfolio
- ? Advanced screening
- ? Export data & reports
- ? Priority support
- ? Insight eksklusif dari analis

## ?? Disclaimer

**InStrategic bukan penasihat investasi.** Semua informasi disajikan untuk tujuan edukatif dan informatif. Keputusan investasi adalah tanggung jawab masing-masing investor. Past performance does not guarantee future results.

Data bersumber dari:
- ?? Bursa Efek Indonesia (IDX)
- ??? Otoritas Jasa Keuangan (OJK)
- ?? Sumber berita dan keuangan terpercaya

## ?? Contributing

Kontribusi sangat diterima! Silakan:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## ?? License

This project is licensed under the MIT License - see the LICENSE file for details.

## ?? Team

**InStrategic Team** - Dedicated to improving Indonesian investors' financial literacy

## ?? Contact

- Website: [instrategic.id](https://instrategic.id)
- Email: hello@instrategic.id
- Twitter: [@InStrategicID](https://twitter.com/instrategicid)
- Instagram: [@instrategic.id](https://instagram.com/instrategic.id)

---

<div align="center">
  <strong>Built with ?? for Indonesian Investors</strong>
  <br>
  <sub>? 2025 InStrategic. All rights reserved.</sub>
</div>
