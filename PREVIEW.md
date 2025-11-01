# ?? Preview Guide - InStrategic Platform

## Quick Start

### Option 1: Direct Open
Simply double-click `index.html` to open in your default browser.

### Option 2: Local Server (Recommended)

#### Using Python:
```bash
python -m http.server 8000
# atau
python3 -m http.server 8000
```

Then open: `http://localhost:8000`

#### Using Node.js:
```bash
npx serve
```

#### Using VS Code:
1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## ?? What to Test

### Navigation
- [ ] Click on navigation links for smooth scrolling
- [ ] Test mobile menu toggle (resize to mobile view)
- [ ] Navbar transparency changes on scroll

### Hero Section
- [ ] Gradient background with purple glow effect
- [ ] Animated badge with sparkle icon
- [ ] Gradient text effect on title
- [ ] Interactive buttons with hover states
- [ ] Statistics display

### Market Overview
- [ ] Live market indicator pulse animation
- [ ] Glass card hover effects with purple glow
- [ ] Market index cards (IHSG, LQ45, IDX30)
- [ ] Mini chart visualizations
- [ ] Volume bar animation

### Stock Search
- [ ] Search input functionality
- [ ] Filter chips (click to activate)
- [ ] Search button interaction
- [ ] Keyboard shortcut (Ctrl/Cmd + K)

### Stock Cards
- [ ] Hover effect with glow and lift
- [ ] Score bars animation (Value, Growth, Health)
- [ ] Color-coded performance indicators
- [ ] "Lihat Analisis Lengkap" button
- [ ] Stock logos with gradient backgrounds

### Sector Analysis
- [ ] Sector cards with icons
- [ ] Performance indicators (positive/negative colors)
- [ ] Mini charts
- [ ] Click to view sector details

### Features Section
- [ ] Feature cards with icons
- [ ] Glassmorphism effect
- [ ] Hover animations
- [ ] Icon backgrounds with purple tint

### CTA Section
- [ ] Premium badge with glow
- [ ] Floating stock cards animation
- [ ] Feature checkmarks with green color
- [ ] Premium button interaction
- [ ] Pricing modal alert

### Footer
- [ ] Logo with gradient
- [ ] Social media links hover effects
- [ ] Link hover states
- [ ] Disclaimer text

### Responsive Design
Test at these breakpoints:
- [ ] Desktop: 1920px, 1440px, 1280px
- [ ] Tablet: 1024px, 768px
- [ ] Mobile: 480px, 375px, 320px

### Animations & Effects
- [ ] Scroll-triggered animations
- [ ] Glass card hover effects
- [ ] Purple neon glow on interactive elements
- [ ] Smooth transitions on all interactions
- [ ] Score bar fill animations
- [ ] Floating cards movement
- [ ] Live indicator pulse

### Interactive Features
- [ ] Stock search functionality
- [ ] Filter chip selection
- [ ] Stock card detail modal
- [ ] Sector detail modal
- [ ] Premium pricing modal
- [ ] Smooth scroll navigation

## ?? Design Features to Notice

### Glassmorphism
- Transparent cards with backdrop blur
- Subtle borders with white/purple tints
- Layered depth effect

### Color System
- **Primary**: #6800FC (InStrategic Purple)
- **Positive**: #00C853 (Green for gains)
- **Negative**: #FF1744 (Red for losses)
- **Background**: #1B132B ? #281C3C gradient

### Typography
- **Font**: Inter (clean, modern, professional)
- **Weights**: 300-900 for various elements
- **Hierarchy**: Clear visual distinction

### Spacing & Layout
- Consistent spacing system (8px grid)
- Generous whitespace
- Balanced grid layouts
- Responsive breakpoints

### Effects
- **Glow**: Purple neon effect on hover
- **Shadow**: Multi-layered depth
- **Blur**: Backdrop filter on glass cards
- **Gradient**: Smooth color transitions

## ?? Mobile Testing Checklist

- [ ] Navigation collapses to hamburger menu
- [ ] Cards stack vertically
- [ ] Text remains readable
- [ ] Buttons are touch-friendly (min 44px)
- [ ] No horizontal scrolling
- [ ] Images scale properly

## ? Performance

Open browser DevTools and check:
- [ ] Page load time < 3 seconds
- [ ] Smooth 60fps animations
- [ ] No console errors
- [ ] Responsive images load
- [ ] Fonts load properly

## ?? Known Limitations (Development Version)

1. **No Real Data**: Uses static/mock data
2. **No Backend**: All functionality is frontend-only
3. **Charts**: Using CSS visualization, not Chart.js yet
4. **Search**: Shows alert instead of actual results
5. **Modals**: Using browser alert() for simplicity

## ?? Next Steps for Production

1. Integrate real BEI stock data API
2. Add Chart.js for advanced visualizations
3. Implement backend with Node.js/Python
4. Add user authentication
5. Create database for portfolio tracking
6. Implement WebSocket for real-time updates
7. Add comprehensive testing suite
8. Optimize for production (minify, bundle)
9. Deploy to hosting service
10. Add analytics tracking

## ?? Tips

- **Best Experience**: Use Chrome/Firefox/Safari (latest versions)
- **High-res Display**: Design optimized for Retina displays
- **Dark Mode**: Already in dark theme (light mode coming soon)
- **Keyboard**: Try Ctrl/Cmd + K for quick search

## ?? Enjoy Exploring InStrategic!

This is a modern, premium-quality UI implementation inspired by SimplyWall.st but elevated with futuristic design elements specifically for the Indonesian stock market.

---
**Built with ?? for Indonesian Investors**
