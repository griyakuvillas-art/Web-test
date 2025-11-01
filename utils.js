// ==========================================
// InStrategic - Security & Utility Functions
// XSS Prevention & Input Sanitization
// ==========================================

/**
 * Security utilities for XSS prevention
 */
class SecurityUtils {
    /**
     * Sanitize HTML to prevent XSS attacks
     * Encodes dangerous characters
     */
    static sanitizeHTML(str) {
        if (!str) return '';
        
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Escape HTML entities
     */
    static escapeHTML(str) {
        if (!str) return '';
        
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
            '/': '&#x2F;'
        };
        
        return String(str).replace(/[&<>"'\/]/g, char => map[char]);
    }

    /**
     * Validate and sanitize search input
     * Only allows alphanumeric, spaces, and dots
     */
    static sanitizeSearchInput(input) {
        if (!input) return '';
        
        // Remove any HTML tags
        const withoutTags = this.escapeHTML(input);
        
        // Only allow safe characters (letters, numbers, spaces, dots)
        return withoutTags.replace(/[^a-zA-Z0-9\s\.]/g, '');
    }

    /**
     * Validate stock symbol format
     */
    static isValidStockSymbol(symbol) {
        // IDX format: 4 letters or ^JKSE for index
        const pattern = /^(\^JKSE|[A-Z]{4}\.JK)$/;
        return pattern.test(symbol);
    }

    /**
     * Validate sector value
     */
    static isValidSector(sector) {
        const validSectors = ['finance', 'consumer', 'infrastructure', 'basic-materials', 'technology', 'index', ''];
        return validSectors.includes(sector);
    }

    /**
     * Rate limit checker
     * Prevents abuse by limiting actions per time window
     */
    static rateLimitCheck(key, maxAttempts = 10, windowMs = 60000) {
        const now = Date.now();
        const storageKey = `rateLimit_${key}`;
        
        let attempts = JSON.parse(localStorage.getItem(storageKey) || '[]');
        attempts = attempts.filter(time => now - time < windowMs);
        
        if (attempts.length >= maxAttempts) {
            console.warn(`Rate limit exceeded for ${key}`);
            return false;
        }
        
        attempts.push(now);
        localStorage.setItem(storageKey, JSON.stringify(attempts));
        return true;
    }
}

/**
 * Performance utilities
 */
class PerformanceUtils {
    /**
     * Debounce function calls
     * Prevents excessive function execution
     */
    static debounce(func, wait = 300) {
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

    /**
     * Throttle function calls
     * Ensures function is called at most once per interval
     */
    static throttle(func, limit = 1000) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Lazy load images
     */
    static lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img.lazy').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Measure performance
     */
    static measurePerformance(label) {
        if ('performance' in window && 'mark' in window.performance) {
            performance.mark(label);
        }
    }

    /**
     * Get performance timing
     */
    static getPerformanceTiming() {
        if ('performance' in window && 'timing' in window.performance) {
            const timing = window.performance.timing;
            return {
                dns: timing.domainLookupEnd - timing.domainLookupStart,
                tcp: timing.connectEnd - timing.connectStart,
                request: timing.responseStart - timing.requestStart,
                response: timing.responseEnd - timing.responseStart,
                dom: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
                load: timing.loadEventEnd - timing.loadEventStart,
                total: timing.loadEventEnd - timing.navigationStart
            };
        }
        return null;
    }
}

/**
 * Logger utility with levels
 */
class Logger {
    static levels = {
        ERROR: 0,
        WARN: 1,
        INFO: 2,
        DEBUG: 3
    };

    static currentLevel = Logger.levels.INFO;

    static error(message, ...args) {
        if (this.currentLevel >= this.levels.ERROR) {
            console.error(`[ERROR] ${message}`, ...args);
        }
    }

    static warn(message, ...args) {
        if (this.currentLevel >= this.levels.WARN) {
            console.warn(`[WARN] ${message}`, ...args);
        }
    }

    static info(message, ...args) {
        if (this.currentLevel >= this.levels.INFO) {
            console.log(`[INFO] ${message}`, ...args);
        }
    }

    static debug(message, ...args) {
        if (this.currentLevel >= this.levels.DEBUG) {
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    }
}

/**
 * Error handler
 */
class ErrorHandler {
    static handle(error, context = '') {
        Logger.error(`${context}: ${error.message}`, error);
        
        // Send to error tracking service (e.g., Sentry)
        if (window.Sentry) {
            window.Sentry.captureException(error);
        }
        
        // Show user-friendly message
        this.showUserError(error, context);
    }

    static showUserError(error, context) {
        const message = this.getUserFriendlyMessage(error);
        // You can implement a toast/notification here
        console.error(`User message: ${message}`);
    }

    static getUserFriendlyMessage(error) {
        const messages = {
            'NetworkError': 'Gagal terhubung ke server. Periksa koneksi internet Anda.',
            'TimeoutError': 'Request timeout. Coba lagi.',
            'ParseError': 'Gagal memproses data. Coba refresh halaman.',
            'default': 'Terjadi kesalahan. Silakan coba lagi.'
        };

        return messages[error.name] || messages.default;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SecurityUtils,
        PerformanceUtils,
        Logger,
        ErrorHandler
    };
}
