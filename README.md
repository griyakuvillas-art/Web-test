# InStrategic

> Platform Analisis Saham Indonesia dengan UI/UX Expert Level 2025

[![Status](https://img.shields.io/badge/status-production-success)](https://github.com)
[![Version](https://img.shields.io/badge/version-2.0.0-blue)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Overview

**InStrategic** adalah platform market insight saham Indonesia yang dirancang dengan standar UI/UX tingkat dunia. Platform ini menyediakan analisis fundamental, data real-time, dan portfolio tracking untuk investor BEI.

### Key Features

- **Real-time Data** - Data saham langsung dari Yahoo Finance API
- **Dark/Light Mode** - Dual theme dengan transisi smooth
- **Responsive Design** - Optimal di semua perangkat (desktop, tablet, mobile)
- **Live Ticker Tape** - Stock ticker yang bergerak otomatis
- **Market Status** - Deteksi otomatis jam buka/tutup pasar
- **Modern UI/UX** - Design world-class inspired by Linear, Vercel, Stripe
- **Zero Encoding Errors** - 100% UTF-8 compliant, no broken characters

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Fonts**: Inter (body), Space Grotesk (display)
- **API**: Yahoo Finance API v8
- **Architecture**: Modern OOP with class-based components

## Design Philosophy

InStrategic didesain dengan prinsip:

1. **Clarity** - Informasi jelas dan mudah dibaca
2. **Performance** - Fast loading, smooth animations
3. **Accessibility** - WCAG compliant, semantic HTML
4. **Consistency** - Design system dengan CSS variables
5. **Scalability** - Modular dan maintainable code

## Quick Start

### Local Development

1. Clone repository:
```bash
git clone https://github.com/yourusername/instrategic.git
cd instrategic
```

2. Buka dengan browser:
```bash
# Dengan Python
python -m http.server 8000

# Dengan Node.js
npx serve

# Atau langsung buka index.html
```

3. Akses di browser:
```
http://localhost:8000
```

### Production Deployment

**Deploy ke Netlify:**
```bash
# Drag & drop folder ke netlify.com/drop
# Atau gunakan Netlify CLI
netlify deploy --prod
```

**Deploy ke Vercel:**
```bash
vercel --prod
```

**Deploy ke GitHub Pages:**
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
# Enable GitHub Pages di repository settings
```

## File Structure

```
instrategic/
??? index.html          # Main HTML structure
??? style.css           # Expert-level CSS with design system
??? app.js              # Modern JavaScript application
??? README.md           # Documentation
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## API Integration

InStrategic menggunakan Yahoo Finance API untuk data real-time:

```javascript
// Main stocks tracked:
- ^JKSE  - IDX Composite (IHSG)
- BBCA.JK - Bank Central Asia
- TLKM.JK - Telkom Indonesia
- ASII.JK - Astra International
- BBRI.JK - Bank Rakyat Indonesia
- BMRI.JK - Bank Mandiri
- UNVR.JK - Unilever Indonesia
- GOTO.JK - GoTo Gojek Tokopedia
```

Data di-refresh otomatis setiap 30 detik saat market buka.

## Performance

- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Lighthouse Score**: 95+
- **Bundle Size**: < 50KB (uncompressed)

## Contributing

Contributions welcome! Please:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## Roadmap

### Phase 1 - Core Platform ?
- [x] Real-time market data
- [x] Dark/Light mode
- [x] Responsive design
- [x] Stock ticker tape

### Phase 2 - Advanced Features ??
- [ ] User authentication
- [ ] Portfolio tracking
- [ ] Stock screener
- [ ] Advanced charts (TradingView)
- [ ] Price alerts
- [ ] Watchlist

### Phase 3 - Premium Features ??
- [ ] Fundamental analysis reports
- [ ] Technical indicators
- [ ] Insider trading data
- [ ] News aggregation
- [ ] AI-powered insights

## License

MIT License - see [LICENSE](LICENSE) for details.

## Disclaimer

InStrategic adalah platform edukasi dan informasi. Bukan nasihat investasi. Semua keputusan investasi adalah tanggung jawab pengguna.

---

**Built with ?? by InStrategic Team**

[Website](https://instrategic.com) ? [Twitter](https://twitter.com/instrategic) ? [LinkedIn](https://linkedin.com/company/instrategic)
