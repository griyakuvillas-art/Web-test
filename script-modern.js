// ===================================
// InStrategic - Modern Interactive JS
// Dark Mode + Smooth Animations
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // Dark Mode Toggle
    // ===================================
    const body = document.body;
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    
    // Update active button
    themeButtons.forEach(btn => {
        if (btn.getAttribute('data-theme') === currentTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Theme toggle functionality
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            
            // Remove active class from all buttons
            themeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Set theme
            body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            // Add transition effect
            body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        });
    });
    
    // ===================================
    // Smooth Scroll
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
        
        if (currentScroll > 50) {
            navbar.style.padding = '0.75rem 0';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    // ===================================
    // Search Functionality
    // ===================================
    const searchInput = document.getElementById('stock-search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput) {
        // Focus effect
        searchInput.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        searchInput.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
        
        // Search on enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
    }
    
    function performSearch(query) {
        if (query.trim() === '') return;
        
        console.log('Searching for:', query);
        
        // Show loading state
        searchBtn.innerHTML = '<span class="loading">??</span><span>Mencari...</span>';
        
        // Simulate search
        setTimeout(() => {
            searchBtn.innerHTML = '<span>Cari</span>';
            showNotification(`Hasil pencarian untuk "${query}"`, 'info');
        }, 1000);
    }
    
    // ===================================
    // Filter Chips
    // ===================================
    const filterChips = document.querySelectorAll('.chip');
    
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Remove active from all
            filterChips.forEach(c => c.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterStocks(filter);
            
            // Animate cards
            animateCards();
        });
    });
    
    function filterStocks(filter) {
        console.log('Filtering by:', filter);
        showNotification(`Filter: ${filter}`, 'success');
    }
    
    function animateCards() {
        const cards = document.querySelectorAll('.stock-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // ===================================
    // Intersection Observer - Scroll Animations
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate score bars
                if (entry.target.classList.contains('stock-card')) {
                    animateScoreBars(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animateElements = document.querySelectorAll('.card, .market-card, .stock-card, .section-header');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ===================================
    // Score Bar Animations
    // ===================================
    function animateScoreBars(card) {
        const scoreFills = card.querySelectorAll('.score-fill');
        
        scoreFills.forEach((fill, index) => {
            const targetWidth = fill.style.width;
            fill.style.width = '0%';
            
            setTimeout(() => {
                fill.style.width = targetWidth;
            }, 300 + (index * 150));
        });
    }
    
    // ===================================
    // Stock Card Interactions
    // ===================================
    const stockCards = document.querySelectorAll('.stock-card');
    
    stockCards.forEach(card => {
        const actionBtn = card.querySelector('.btn-card-action');
        
        if (actionBtn) {
            actionBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const ticker = card.querySelector('.stock-ticker').textContent;
                showStockDetail(ticker);
            });
        }
        
        // Card click
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            const ticker = this.querySelector('.stock-ticker').textContent;
            showNotification(`Loading ${ticker} details...`, 'info');
        });
    });
    
    function showStockDetail(ticker) {
        showNotification(`Membuka analisis lengkap ${ticker}...`, 'info');
    }
    
    // ===================================
    // Sector Card Interactions
    // ===================================
    const sectorCards = document.querySelectorAll('.sector-card');
    
    sectorCards.forEach(card => {
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', function() {
            const sectorName = this.querySelector('.sector-name').textContent;
            showNotification(`Membuka analisis sektor ${sectorName}...`, 'info');
        });
    });
    
    // ===================================
    // Live Indicator Animation
    // ===================================
    const liveIndicators = document.querySelectorAll('.live-indicator');
    liveIndicators.forEach(indicator => {
        setInterval(() => {
            indicator.style.transform = 'scale(1.3)';
            setTimeout(() => {
                indicator.style.transform = 'scale(1)';
            }, 300);
        }, 2000);
    });
    
    // ===================================
    // Notification System
    // ===================================
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotif = document.querySelector('.notification');
        if (existingNotif) {
            existingNotif.remove();
        }
        
        // Create notification
        const notif = document.createElement('div');
        notif.className = `notification notification-${type}`;
        notif.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Styling
        Object.assign(notif.style, {
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: type === 'success' ? 'var(--success)' : 
                       type === 'error' ? 'var(--error)' : 'var(--primary)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-xl)',
            zIndex: '10000',
            animation: 'slideIn 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            maxWidth: '400px'
        });
        
        document.body.appendChild(notif);
        
        // Close button
        const closeBtn = notif.querySelector('.notification-close');
        closeBtn.style.cssText = 'background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; padding: 0 0.5rem;';
        closeBtn.addEventListener('click', () => notif.remove());
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notif.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }
    
    // Add notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // ===================================
    // Keyboard Shortcuts
    // ===================================
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput?.focus();
        }
        
        // Ctrl/Cmd + D for dark mode toggle
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            const darkBtn = document.querySelector('.theme-btn[data-theme="dark"]');
            const lightBtn = document.querySelector('.theme-btn[data-theme="light"]');
            const currentTheme = body.getAttribute('data-theme');
            
            if (currentTheme === 'light') {
                darkBtn.click();
            } else {
                lightBtn.click();
            }
        }
        
        // Escape to close/blur
        if (e.key === 'Escape') {
            searchInput?.blur();
            document.querySelector('.notification')?.remove();
        }
    });
    
    // ===================================
    // Parallax Effect for Hero
    // ===================================
    const heroGradient = document.querySelector('.hero-gradient');
    if (heroGradient) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            heroGradient.style.transform = `translateX(-50%) translateY(${scrolled * 0.5}px)`;
        });
    }
    
    // ===================================
    // Button Ripple Effect
    // ===================================
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // ===================================
    // Console Welcome
    // ===================================
    console.log('%c?? InStrategic Platform', 'font-size: 24px; font-weight: bold; color: #6366F1;');
    console.log('%cModern UI/UX 2025 Edition', 'font-size: 16px; color: #8B5CF6;');
    console.log('%c? Features: Dark Mode, Smooth Animations, Modern Design', 'font-size: 12px; color: #94A3B8;');
    console.log('%c?? Shortcuts: Ctrl+K (Search), Ctrl+D (Toggle Theme)', 'font-size: 12px; color: #94A3B8;');
    
    // ===================================
    // Performance Monitoring
    // ===================================
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = Math.round(perfData.loadEventEnd - perfData.fetchStart);
                console.log(`? Page loaded in ${loadTime}ms`);
                
                if (loadTime < 1000) {
                    console.log('?? Excellent performance!');
                } else if (loadTime < 3000) {
                    console.log('? Good performance');
                } else {
                    console.log('?? Consider optimization');
                }
            }, 0);
        });
    }
    
    console.log('? InStrategic initialized successfully');
});

// ===================================
// Utility Functions
// ===================================

// Format number
function formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(num);
}

// Format currency
function formatCurrency(num) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(num);
}

// Format percentage
function formatPercentage(num) {
    return (num > 0 ? '+' : '') + num.toFixed(2) + '%';
}

// Debounce function
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

// Throttle function
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

// Export utilities
window.InStrategic = {
    formatNumber,
    formatCurrency,
    formatPercentage,
    debounce,
    throttle
};
