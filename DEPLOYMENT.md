# ?? Deployment Guide - InStrategic Platform

## Quick Deployment Options

### 1. GitHub Pages (Free & Easy)

```bash
# Push to GitHub
git add .
git commit -m "Initial commit: InStrategic platform"
git push origin main

# Enable GitHub Pages
# Go to: Repository Settings ? Pages
# Source: main branch / root folder
# Your site will be at: https://username.github.io/instrategic/
```

### 2. Netlify (Recommended)

#### Via Drag & Drop:
1. Go to [netlify.com](https://netlify.com)
2. Drag the entire folder to deploy
3. Done! You get a URL like: `https://instrategic-xyz.netlify.app`

#### Via CLI:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### 3. Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts
```

### 4. Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

### 5. Surge (Ultra Simple)

```bash
# Install Surge
npm install -g surge

# Deploy
surge /workspace instrategic.surge.sh
```

## Custom Domain Setup

### For Netlify:
1. Go to Domain Settings
2. Add custom domain: `instrategic.id`
3. Update DNS records at domain registrar:
   - Type: CNAME
   - Name: www
   - Value: [your-site].netlify.app

### For GitHub Pages:
1. Add `CNAME` file with your domain
2. Update DNS at registrar:
   - Type: A
   - Value: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153

## SSL Certificate

All recommended platforms provide **free SSL** automatically:
- ? Netlify: Auto SSL
- ? Vercel: Auto SSL
- ? GitHub Pages: Auto SSL
- ? Firebase: Auto SSL

## Performance Optimization

### Before Production:

1. **Minify CSS:**
```bash
# Using clean-css
npx cleancss -o styles.min.css styles.css
```

2. **Minify JavaScript:**
```bash
# Using terser
npx terser script.js -o script.min.js -c -m
```

3. **Minify HTML:**
```bash
# Using html-minifier
npx html-minifier --collapse-whitespace --remove-comments index.html -o index.min.html
```

4. **Optimize Images:**
- Use WebP format for better compression
- Compress PNGs/JPGs with TinyPNG
- Add lazy loading: `loading="lazy"`

### Update HTML to use minified files:
```html
<link rel="stylesheet" href="styles.min.css">
<script src="script.min.js"></script>
```

## SEO Optimization

Add to `<head>` section:

```html
<!-- Essential Meta Tags -->
<meta name="description" content="Platform analisis saham Indonesia terlengkap dengan data fundamental, valuasi real-time, dan insight pasar yang mudah dipahami investor ritel.">
<meta name="keywords" content="saham indonesia, analisis saham, BEI, IHSG, investasi, portfolio, stock screening">
<meta name="author" content="InStrategic">
<meta name="robots" content="index, follow">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://instrategic.id/">
<meta property="og:title" content="InStrategic - Platform Market Insight Saham Indonesia">
<meta property="og:description" content="Analisis saham Indonesia lebih cerdas & visual. Data fundamental, valuasi real-time, dan insight pasar.">
<meta property="og:image" content="https://instrategic.id/og-image.jpg">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://instrategic.id/">
<meta property="twitter:title" content="InStrategic - Platform Market Insight Saham Indonesia">
<meta property="twitter:description" content="Analisis saham Indonesia lebih cerdas & visual.">
<meta property="twitter:image" content="https://instrategic.id/twitter-image.jpg">

<!-- Favicon -->
<link rel="icon" type="image/png" href="favicon.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
```

## Analytics Setup

### Google Analytics 4:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Hotjar (Heatmaps & User Recording):
```html
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

## Environment Variables

Create `.env` file (for future backend integration):

```env
# API Keys
STOCK_API_KEY=your_api_key_here
IDX_API_KEY=your_idx_api_key

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=instrategic
DB_USER=instrategic_user
DB_PASSWORD=secure_password

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hello@instrategic.id
SMTP_PASS=your_app_password

# Environment
NODE_ENV=production
PORT=3000

# Security
JWT_SECRET=your_secret_key_here
SESSION_SECRET=another_secret_key
```

## Monitoring & Maintenance

### Uptime Monitoring:
- [UptimeRobot](https://uptimerobot.com/) - Free
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

### Performance Monitoring:
- Google PageSpeed Insights
- Lighthouse CI
- WebPageTest
- GTmetrix

### Error Tracking:
- [Sentry](https://sentry.io/) - Free tier available
- [Rollbar](https://rollbar.com/)
- [Bugsnag](https://www.bugsnag.com/)

## Security Headers

Add to `.htaccess` (Apache) or `netlify.toml`:

```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com"
```

## CDN Configuration

### Cloudflare (Recommended):
1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Add your domain
3. Update nameservers at domain registrar
4. Enable:
   - Auto Minify (CSS, JS, HTML)
   - Brotli compression
   - Rocket Loader
   - Polish (image optimization)
   - Always Use HTTPS

### Benefits:
- ? Free SSL
- ? DDoS protection
- ? Global CDN
- ? Analytics
- ? Caching

## Backup Strategy

### Automated Backups:
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR="/backups/instrategic"

# Backup files
tar -czf $BACKUP_DIR/instrategic-$DATE.tar.gz /var/www/instrategic

# Keep only last 30 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

### Version Control:
- ? Always commit to Git
- ? Tag releases: `git tag -a v1.0.0 -m "Version 1.0.0"`
- ? Use branches for features
- ? Create releases on GitHub

## Cost Estimation

### Free Tier (Perfect for MVP):
- **Hosting**: Netlify/Vercel Free
- **Domain**: ~$10-15/year (.id domain)
- **SSL**: Free (Let's Encrypt)
- **CDN**: Cloudflare Free
- **Analytics**: Google Analytics Free
- **Total**: ~$10-15/year

### Growth Tier (~1000 daily users):
- **Hosting**: Netlify Pro ($19/mo) or VPS ($5-10/mo)
- **Database**: Supabase/PlanetScale Free tier
- **API Costs**: Varies based on provider
- **Total**: ~$20-50/month

### Professional Tier (~10,000 daily users):
- **Hosting**: VPS/Cloud ($50-100/mo)
- **Database**: Managed DB ($20-50/mo)
- **CDN**: Cloudflare Pro ($20/mo)
- **API**: Stock data API ($50-200/mo)
- **Total**: ~$150-400/month

## Launch Checklist

- [ ] Domain purchased and configured
- [ ] SSL certificate installed and working
- [ ] All links tested
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing completed
- [ ] Page speed optimized (>90 score)
- [ ] SEO meta tags added
- [ ] Analytics tracking installed
- [ ] Error monitoring setup
- [ ] Uptime monitoring configured
- [ ] Social media accounts created
- [ ] Email configured (hello@instrategic.id)
- [ ] Legal pages added (Privacy, Terms)
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] 404 page created
- [ ] Favicon added
- [ ] OG images created
- [ ] Backup system in place

## Support & Maintenance

### Weekly Tasks:
- Check analytics for errors
- Review user feedback
- Monitor uptime
- Check security alerts

### Monthly Tasks:
- Update dependencies
- Review performance metrics
- Backup verification
- Content updates

### Quarterly Tasks:
- SEO audit
- Security audit
- A/B testing new features
- User survey

## Resources

### Documentation:
- [MDN Web Docs](https://developer.mozilla.org/)
- [web.dev](https://web.dev/)
- [CSS Tricks](https://css-tricks.com/)

### Communities:
- [r/webdev](https://reddit.com/r/webdev)
- [Stack Overflow](https://stackoverflow.com/)
- [Dev.to](https://dev.to/)

### Tools:
- [Favicon Generator](https://realfavicongenerator.net/)
- [OG Image Generator](https://www.opengraph.xyz/)
- [Can I Use](https://caniuse.com/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

## ?? Ready to Launch!

Choose your deployment method and go live. Remember:
- Start with free tiers
- Scale as you grow
- Monitor everything
- Iterate based on user feedback

**Good luck with InStrategic! ??**

---
*Questions? Contact: hello@instrategic.id*
