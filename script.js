// ===================================
// InStrategic - Interactive JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // Mobile Menu Toggle
    // ===================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks?.classList.toggle('active');
            navActions?.classList.toggle('active');
        });
    }
    
    // ===================================
    // Smooth Scroll for Navigation Links
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ===================================
    // Navbar Scroll Effect
    // ===================================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(27, 19, 43, 0.95)';
            navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
        } else {
            navbar.style.background = 'rgba(27, 19, 43, 0.8)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    // ===================================
    // Stock Search Functionality
    // ===================================
    const searchInput = document.getElementById('stock-search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
    
    function performSearch(query) {
        if (query.trim() === '') return;
        
        console.log('Searching for:', query);
        // Add animation to indicate search is happening
        searchBtn.innerHTML = '<span>Mencari...</span>';
        
        // Simulate search delay
        setTimeout(() => {
            searchBtn.innerHTML = '<span>Cari</span>';
            alert(`Hasil pencarian untuk "${query}" akan ditampilkan di sini.\n\nFitur ini akan terhubung ke API data saham BEI.`);
        }, 1000);
    }
    
    // ===================================
    // Filter Chips Functionality
    // ===================================
    const filterChips = document.querySelectorAll('.chip');
    
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Remove active class from all chips
            filterChips.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked chip
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterStocks(filter);
        });
    });
    
    function filterStocks(filter) {
        console.log('Filtering stocks by:', filter);
        
        // Add subtle animation to stock cards
        const stockCards = document.querySelectorAll('.stock-card');
        stockCards.forEach((card, index) => {
            card.style.opacity = '0.5';
            card.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, index * 50);
        });
        
        // In production, this would filter actual stock data
    }
    
    // ===================================
    // Mini Chart Animations
    // ===================================
    function createMiniChart(elementId, data) {
        const canvas = document.getElementById(elementId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth * 2;
        const height = canvas.height = canvas.offsetHeight * 2;
        
        ctx.strokeStyle = '#6800FC';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        const points = data.map((val, i) => ({
            x: (i / (data.length - 1)) * width,
            y: height - (val / Math.max(...data)) * height * 0.8 - height * 0.1
        }));
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        
        ctx.stroke();
    }
    
    // Generate sample data for charts
    const generateChartData = (points, trend = 'up') => {
        const data = [];
        let value = 50;
        
        for (let i = 0; i < points; i++) {
            value += (Math.random() - (trend === 'up' ? 0.3 : 0.7)) * 10;
            value = Math.max(10, Math.min(90, value));
            data.push(value);
        }
        
        return data;
    };
    
    // Create charts for market cards
    ['ihsg-chart', 'lq45-chart', 'idx30-chart'].forEach((id, index) => {
        const trend = index === 2 ? 'down' : 'up';
        createMiniChart(id, generateChartData(20, trend));
    });
    
    // ===================================
    // Animate Elements on Scroll
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    const animateElements = document.querySelectorAll('.glass-card, .section-title, .section-subtitle');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ===================================
    // Stock Card Interactions
    // ===================================
    const stockCards = document.querySelectorAll('.stock-card');
    
    stockCards.forEach(card => {
        const actionBtn = card.querySelector('.btn-card-action');
        
        if (actionBtn) {
            actionBtn.addEventListener('click', function() {
                const ticker = card.querySelector('.stock-ticker').textContent;
                showStockDetail(ticker);
            });
        }
    });
    
    function showStockDetail(ticker) {
        alert(`Membuka analisis lengkap untuk ${ticker}...\n\nFitur ini akan menampilkan:\n- Analisis fundamental lengkap\n- Grafik harga historis\n- Valuasi & fair value\n- Laporan keuangan\n- Sentiment analisis\n- Rekomendasi investor`);
    }
    
    // ===================================
    // Sector Card Interactions
    // ===================================
    const sectorCards = document.querySelectorAll('.sector-card');
    
    sectorCards.forEach(card => {
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', function() {
            const sectorName = this.querySelector('.sector-name').textContent;
            showSectorDetail(sectorName);
        });
    });
    
    function showSectorDetail(sector) {
        alert(`Membuka analisis sektor ${sector}...\n\nFitur ini akan menampilkan:\n- Performa sektor vs IHSG\n- Top 10 saham di sektor ini\n- Analisis tren industri\n- Perbandingan valuasi\n- Outlook sektor`);
    }
    
    // ===================================
    // Real-time Market Data Simulation
    // ===================================
    function updateMarketData() {
        // Simulate real-time price updates
        const priceElements = document.querySelectorAll('.market-card-value .value');
        
        priceElements.forEach(element => {
            const currentPrice = parseFloat(element.textContent.replace(/,/g, ''));
            if (!isNaN(currentPrice)) {
                const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
                const newPrice = currentPrice + change;
                
                // Animate the change
                element.style.transition = 'color 0.3s ease';
                element.style.color = change > 0 ? '#00C853' : '#FF1744';
                
                setTimeout(() => {
                    element.style.color = '';
                }, 300);
            }
        });
    }
    
    // Update market data every 5 seconds (in production, use WebSocket)
    setInterval(updateMarketData, 5000);
    
    // ===================================
    // CTA Button Interactions
    // ===================================
    const ctaButtons = document.querySelectorAll('.cta-card .btn-primary');
    
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            showPricingModal();
        });
    });
    
    function showPricingModal() {
        alert('Paket Premium InStrategic:\n\n' +
              '? Akses 800+ analisis saham lengkap\n' +
              '? Data real-time & historical\n' +
              '? Portfolio analytics otomatis\n' +
              '? Insight harian eksklusif\n' +
              '? Screening saham advanced\n' +
              '? Alert harga & berita\n' +
              '? Export data & laporan\n\n' +
              'Hanya Rp 99.000/bulan\n' +
              'Gratis trial 14 hari!');
    }
    
    // ===================================
    // Floating Cards Animation
    // ===================================
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        // Add random movement
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * 20;
            const randomY = (Math.random() - 0.5) * 20;
            
            card.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 3000 + index * 1000);
    });
    
    // ===================================
    // Score Bar Animations
    // ===================================
    function animateScoreBars() {
        const scoreFills = document.querySelectorAll('.score-fill');
        
        scoreFills.forEach(fill => {
            const targetWidth = fill.style.width;
            fill.style.width = '0%';
            
            setTimeout(() => {
                fill.style.width = targetWidth;
            }, 100);
        });
    }
    
    // Trigger score bar animations when cards become visible
    const scoreObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateScoreBars();
                scoreObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stock-card').forEach(card => {
        scoreObserver.observe(card);
    });
    
    // ===================================
    // Live Indicator Pulse
    // ===================================
    const liveIndicator = document.querySelector('.live-indicator');
    if (liveIndicator) {
        setInterval(() => {
            liveIndicator.style.transform = 'scale(1.2)';
            setTimeout(() => {
                liveIndicator.style.transform = 'scale(1)';
            }, 200);
        }, 2000);
    }
    
    // ===================================
    // Keyboard Shortcuts
    // ===================================
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput?.focus();
        }
        
        // Escape to close/blur
        if (e.key === 'Escape') {
            searchInput?.blur();
        }
    });
    
    // ===================================
    // Console Welcome Message
    // ===================================
    console.log('%c?? InStrategic Platform', 'font-size: 20px; font-weight: bold; color: #6800FC;');
    console.log('%cMarket Insight Saham Indonesia', 'font-size: 14px; color: #9D4EDD;');
    console.log('%cVersion 1.0.0 | Built with ?? for Indonesian Investors', 'font-size: 12px; color: #666;');
    
    // ===================================
    // Performance Monitoring
    // ===================================
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log(`? Page loaded in ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
            }, 0);
        });
    }
    
    // ===================================
    // Dark Mode Toggle (Future Enhancement)
    // ===================================
    // Currently fixed to dark theme
    // Future: Add light mode option
    
    // ===================================
    // Initialize Charts Library
    // ===================================
    // In production, integrate Chart.js or D3.js for advanced visualizations
    
    console.log('? InStrategic initialized successfully');
});

// ===================================
// Utility Functions
// ===================================

// Format number with thousand separators
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Format currency
function formatCurrency(num) {
    return 'Rp ' + formatNumber(num);
}

// Calculate percentage change
function calculatePercentage(oldVal, newVal) {
    return ((newVal - oldVal) / oldVal * 100).toFixed(2);
}

// Format percentage
function formatPercentage(num) {
    return (num > 0 ? '+' : '') + num.toFixed(2) + '%';
}

// Get color based on value
function getChangeColor(value) {
    if (value > 0) return '#00C853';
    if (value < 0) return '#FF1744';
    return '#FFB300';
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================
// Export functions for external use
// ===================================
window.InStrategic = {
    formatNumber,
    formatCurrency,
    calculatePercentage,
    formatPercentage,
    getChangeColor,
    debounce,
    throttle
};
