# Panduan Deployment InStrategic

## Cara Tercepat: Netlify Drop (Tanpa Git)

### Step 1: Persiapan File
1. Download semua file dari repository ini
2. Pastikan ada file berikut:
   - `index.html`
   - `style.css`
   - `app.js`
   - `README.md`

### Step 2: Deploy ke Netlify
1. Buka https://app.netlify.com/drop
2. Drag & drop folder `instrategic` ke area upload
3. Tunggu 10-30 detik
4. Website langsung live dengan URL: `https://random-name.netlify.app`

### Step 3: Custom Domain (Opsional)
1. Di dashboard Netlify, klik **Domain Settings**
2. Klik **Add custom domain**
3. Masukkan domain Anda (contoh: `instrategic.com`)
4. Ikuti petunjuk DNS configuration

---

## Metode 2: GitHub Pages (Gratis Selamanya)

### Step 1: Push ke GitHub
```bash
git add .
git commit -m "Deploy InStrategic"
git push origin main
```

### Step 2: Enable GitHub Pages
1. Buka repository di GitHub
2. Klik **Settings** > **Pages**
3. Pilih branch `main` dan folder `/root`
4. Klik **Save**
5. Website akan live di: `https://username.github.io/instrategic`

---

## Metode 3: Vercel (Production Grade)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Deploy
```bash
cd instrategic
vercel --prod
```

### Step 3: Custom Domain
```bash
vercel domains add instrategic.com
```

---

## Metode 4: Cloudflare Pages

### Step 1: Login ke Cloudflare
1. Buka https://pages.cloudflare.com
2. Klik **Create a project**

### Step 2: Connect Git
1. Connect dengan GitHub
2. Pilih repository `instrategic`

### Step 3: Build Settings
- **Build command**: (kosongkan)
- **Build output directory**: `/`
- Klik **Save and Deploy**

---

## Testing Lokal

### Dengan Python
```bash
python -m http.server 8000
# Buka: http://localhost:8000
```

### Dengan Node.js
```bash
npx serve
# Buka: http://localhost:3000
```

### Dengan PHP
```bash
php -S localhost:8000
# Buka: http://localhost:8000
```

---

## Environment Variables (Jika Butuh)

Untuk production, tambahkan di dashboard hosting:

```env
NODE_ENV=production
API_TIMEOUT=5000
REFRESH_INTERVAL=30000
```

---

## SSL/HTTPS

Semua platform di atas (Netlify, Vercel, GitHub Pages, Cloudflare) **otomatis memberikan SSL gratis**.

Tidak perlu konfigurasi tambahan!

---

## Performance Optimization

### 1. Enable Gzip/Brotli Compression
Sudah otomatis di semua platform modern.

### 2. CDN Distribution
- **Netlify**: Global CDN otomatis
- **Vercel**: Edge network otomatis
- **Cloudflare**: 200+ datacenter worldwide

### 3. Caching Headers
Tambahkan file `netlify.toml` (opsional):

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    
[[headers]]
  for = "/index.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

---

## Monitoring

### Analytics (Gratis)
- Google Analytics
- Vercel Analytics
- Cloudflare Web Analytics
- Plausible Analytics

### Uptime Monitoring
- UptimeRobot (https://uptimerobot.com)
- Pingdom
- Statuspage

---

## Troubleshooting

### Website Tidak Muncul
1. Clear browser cache (Ctrl + Shift + R)
2. Cek console browser (F12) untuk error
3. Verifikasi semua file ter-upload dengan benar

### API Tidak Berfungsi
1. Yahoo Finance API kadang di-block oleh CORS
2. Website tetap berfungsi dengan fallback data
3. Jika perlu, gunakan proxy server

### Custom Domain Error
1. Pastikan DNS sudah propagate (tunggu 24-48 jam)
2. Cek nameserver sudah benar
3. Test dengan `nslookup instrategic.com`

---

## Support

Jika ada masalah deployment:

1. Cek [GitHub Issues](https://github.com/yourusername/instrategic/issues)
2. Email: support@instrategic.com
3. Discord: discord.gg/instrategic

---

**Happy Deploying! ??**
