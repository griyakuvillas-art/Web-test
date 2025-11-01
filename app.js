// ==========================================
// InStrategic v3.0 - Investment Platform
// Professional UI/UX with Advanced Features
// ==========================================

console.log('%c InStrategic v3.0 ', 'background: linear-gradient(135deg, #6366F1, #8B5CF6); color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold;');

// === CONFIGURATION ===
const CONFIG = {
    apiTimeout: 5000,
    refreshInterval: 15000, // 15 seconds for more real-time updates
    statusCheckInterval: 10000,
    stockSymbols: [
        { symbol: '^JKSE', name: 'IHSG', displayName: 'IDX Composite', sector: 'index' },
        { symbol: 'BBCA.JK', name: 'BBCA', displayName: 'Bank Central Asia', sector: 'finance' },
        { symbol: 'TLKM.JK', name: 'TLKM', displayName: 'Telkom Indonesia', sector: 'infrastructure' },
        { symbol: 'ASII.JK', name: 'ASII', displayName: 'Astra International', sector: 'consumer' },
        { symbol: 'BBRI.JK', name: 'BBRI', displayName: 'Bank Rakyat Indonesia', sector: 'finance' },
        { symbol: 'BMRI.JK', name: 'BMRI', displayName: 'Bank Mandiri', sector: 'finance' },
        { symbol: 'UNVR.JK', name: 'UNVR', displayName: 'Unilever Indonesia', sector: 'consumer' },
        { symbol: 'GOTO.JK', name: 'GOTO', displayName: 'GoTo Gojek Tokopedia', sector: 'technology' },
        { symbol: 'BBNI.JK', name: 'BBNI', displayName: 'Bank Negara Indonesia', sector: 'finance' },
        { symbol: 'ADRO.JK', name: 'ADRO', displayName: 'Adaro Energy', sector: 'basic-materials' },
        { symbol: 'INDF.JK', name: 'INDF', displayName: 'Indofood Sukses Makmur', sector: 'consumer' },
        { symbol: 'ICBP.JK', name: 'ICBP', displayName: 'Indofood CBP', sector: 'consumer' },
        { symbol: 'KLBF.JK', name: 'KLBF', displayName: 'Kalbe Farma', sector: 'consumer' },
        { symbol: 'PTBA.JK', name: 'PTBA', displayName: 'Bukit Asam', sector: 'basic-materials' },
        { symbol: 'PGAS.JK', name: 'PGAS', displayName: 'Perusahaan Gas Negara', sector: 'infrastructure' },
        { symbol: 'ANTM.JK', name: 'ANTM', displayName: 'Aneka Tambang', sector: 'basic-materials' },
        { symbol: 'JSMR.JK', name: 'JSMR', displayName: 'Jasa Marga', sector: 'infrastructure' },
        { symbol: 'EXCL.JK', name: 'EXCL', displayName: 'XL Axiata', sector: 'infrastructure' },
        { symbol: 'SMGR.JK', name: 'SMGR', displayName: 'Semen Indonesia', sector: 'basic-materials' },
        { symbol: 'INCO.JK', name: 'INCO', displayName: 'Vale Indonesia', sector: 'basic-materials' },
        { symbol: 'WIKA.JK', name: 'WIKA', displayName: 'Wijaya Karya', sector: 'infrastructure' },
        { symbol: 'WSKT.JK', name: 'WSKT', displayName: 'Waskita Karya', sector: 'infrastructure' },
        { symbol: 'PTPP.JK', name: 'PTPP', displayName: 'PP (Persero)', sector: 'infrastructure' },
        { symbol: 'BBTN.JK', name: 'BBTN', displayName: 'Bank Tabungan Negara', sector: 'finance' },
        { symbol: 'MAPI.JK', name: 'MAPI', displayName: 'Mitra Adiperkasa', sector: 'consumer' }
    ]
};

// === STOCK DATA STORE ===
let stockDataStore = new Map();
let filteredStocks = [];
let currentSort = { column: null, direction: 'asc' };

// === THEME MANAGEMENT ===
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme(this.theme);
        this.attachListeners();
    }

    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
        });
        this.theme = theme;
        localStorage.setItem('theme', theme);
        
        // Update chart colors if chart exists
        if (window.chart) {
            updateChartTheme();
        }
    }

    attachListeners() {
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.applyTheme(btn.getAttribute('data-theme'));
            });
        });
    }
}

// === API CLIENT (Use Enhanced API if available) ===
class StockAPI {
    constructor() {
        // Use EnhancedStockAPI if available, otherwise fallback
        if (typeof EnhancedStockAPI !== 'undefined') {
            Logger.info('Using EnhancedStockAPI for better reliability');
            return new EnhancedStockAPI();
        }
        
        Logger.warn('EnhancedStockAPI not found, using fallback');
        this.cache = new Map();
        this.cacheTimeout = 15000; // 15 seconds
    }

    async fetchWithTimeout(url, timeout = CONFIG.apiTimeout) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    getCacheKey(symbol) {
        return `stock_${symbol}`;
    }

    getFromCache(symbol) {
        const cached = this.cache.get(this.getCacheKey(symbol));
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    setCache(symbol, data) {
        this.cache.set(this.getCacheKey(symbol), {
            data,
            timestamp: Date.now()
        });
    }

    async fetchStockData(symbol) {
        const cached = this.getFromCache(symbol);
        if (cached) {
            return cached;
        }

        try {
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
            const response = await this.fetchWithTimeout(url);
            
            if (!response.ok) throw new Error(`API returned ${response.status}`);
            
            const data = await response.json();
            
            if (data.chart && data.chart.result && data.chart.result[0]) {
                const result = data.chart.result[0];
                const quote = result.indicators.quote[0];
                const meta = result.meta;
                
                const stockData = {
                    price: meta.regularMarketPrice || quote.close[quote.close.length - 1],
                    previousClose: meta.previousClose || meta.chartPreviousClose,
                    change: null,
                    changePercent: null,
                    volume: quote.volume[quote.volume.length - 1] || 0,
                    marketCap: meta.marketCap || 0,
                    timestamp: new Date(meta.regularMarketTime * 1000),
                    currency: meta.currency,
                    source: 'yahoo_finance'
                };
                
                stockData.change = stockData.price - stockData.previousClose;
                stockData.changePercent = (stockData.change / stockData.previousClose) * 100;
                
                this.setCache(symbol, stockData);
                return stockData;
            }
            
            throw new Error('Invalid API response');
        } catch (error) {
            console.warn(`API failed for ${symbol}, using fallback`);
            return this.getFallbackData(symbol);
        }
    }

    getFallbackData(symbol) {
        const baseValues = {
            '^JKSE': 7200, 'BBCA.JK': 10375, 'TLKM.JK': 4120, 'ASII.JK': 5450,
            'BBRI.JK': 5250, 'BMRI.JK': 6475, 'UNVR.JK': 4250, 'GOTO.JK': 118,
            'BBNI.JK': 5800, 'ADRO.JK': 3150, 'INDF.JK': 6800, 'ICBP.JK': 11200,
            'KLBF.JK': 1550, 'PTBA.JK': 2880, 'PGAS.JK': 1490, 'ANTM.JK': 2140,
            'JSMR.JK': 4950, 'EXCL.JK': 2850, 'SMGR.JK': 5600, 'INCO.JK': 5150,
            'WIKA.JK': 1250, 'WSKT.JK': 1180, 'PTPP.JK': 1950, 'BBTN.JK': 1450,
            'MAPI.JK': 1750
        };
        
        const base = baseValues[symbol] || 1000;
        const variation = (Math.random() - 0.5) * base * 0.02;
        const price = base + variation;
        const previousClose = base;
        const change = price - previousClose;
        const changePercent = (change / previousClose) * 100;
        const volume = Math.floor(Math.random() * 50000000) + 1000000;
        const marketCap = price * Math.floor(Math.random() * 10000000000) + 1000000000;
        
        return {
            price,
            previousClose,
            change,
            changePercent,
            volume,
            marketCap,
            timestamp: new Date(),
            currency: 'IDR',
            source: 'simulation'
        };
    }
}

// === UI UPDATER ===
class UIUpdater {
    constructor(api) {
        this.api = api;
    }

    formatPrice(value, currency = 'IDR') {
        if (value === null || value === undefined) return '-';
        if (currency === 'IDR' && value < 1000) {
            return `Rp ${value.toFixed(0)}`;
        }
        return value >= 1000 
            ? `Rp ${(value / 1).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
            : `Rp ${value.toFixed(2)}`;
    }

    formatChange(change, changePercent) {
        if (change === null || changePercent === null) return '-';
        const sign = change >= 0 ? '+' : '';
        return `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
    }

    formatVolume(volume) {
        if (!volume) return '-';
        if (volume >= 1000000000) return (volume / 1000000000).toFixed(2) + 'B';
        if (volume >= 1000000) return (volume / 1000000).toFixed(2) + 'M';
        if (volume >= 1000) return (volume / 1000).toFixed(2) + 'K';
        return volume.toString();
    }

    formatMarketCap(marketCap) {
        if (!marketCap) return '-';
        if (marketCap >= 1000000000000) return 'Rp ' + (marketCap / 1000000000000).toFixed(2) + 'T';
        if (marketCap >= 1000000000) return 'Rp ' + (marketCap / 1000000000).toFixed(2) + 'B';
        if (marketCap >= 1000000) return 'Rp ' + (marketCap / 1000000).toFixed(2) + 'M';
        return 'Rp ' + marketCap.toString();
    }

    formatTime(date) {
        if (!date) return '-';
        return date.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    }

    updateMarketCard(stockInfo, data) {
        const card = document.getElementById(`card-${stockInfo.name.toLowerCase()}`);
        if (!card) return;

        const isPositive = data.change >= 0;
        
        const priceEl = document.getElementById(`price-${stockInfo.name.toLowerCase()}`);
        if (priceEl) {
            priceEl.textContent = this.formatPrice(data.price, data.currency);
        }

        const changeEl = document.getElementById(`change-${stockInfo.name.toLowerCase()}`);
        if (changeEl) {
            changeEl.textContent = this.formatChange(data.change, data.changePercent);
            changeEl.className = `market-change ${isPositive ? 'positive' : 'negative'}`;
        }

        const timeEl = document.getElementById(`time-${stockInfo.name.toLowerCase()}`);
        if (timeEl) {
            timeEl.textContent = this.formatTime(data.timestamp);
        }

        const trendIcon = card.querySelector('.trend-icon');
        if (trendIcon) {
            trendIcon.className = `trend-icon ${isPositive ? 'positive' : 'negative'}`;
        }
    }

    updateTicker(stocks) {
        const track = document.getElementById('tickerTrack');
        if (!track) return;

        const tickerHTML = stocks.map((stock) => {
            const isPositive = stock.data.change >= 0;
            return `
                <div class="ticker-item">
                    <span class="ticker-symbol">${stock.info.name}</span>
                    <span class="ticker-price">${this.formatPrice(stock.data.price, stock.data.currency)}</span>
                    <span class="ticker-change ${isPositive ? 'up' : 'down'}">
                        ${isPositive ? '?' : '?'} ${Math.abs(stock.data.changePercent).toFixed(2)}%
                    </span>
                </div>
            `;
        }).join('');

        track.innerHTML = tickerHTML + tickerHTML;
    }

    updateMarketStatus() {
        const statusEl = document.getElementById('marketStatus');
        if (!statusEl) return;

        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const time = hour * 60 + minute;

        const isWeekday = day >= 1 && day <= 5;
        const isMarketHours = time >= 540 && time <= 950;
        const isOpen = isWeekday && isMarketHours;

        statusEl.innerHTML = `
            <span class="status-dot"></span>
            <span>${isOpen ? 'Market Open' : 'Market Closed'}</span>
        `;
        statusEl.className = `market-status ${isOpen ? '' : 'closed'}`;
    }
}

// === STOCK TABLE MANAGER ===
class StockTableManager {
    constructor(api, ui) {
        this.api = api;
        this.ui = ui;
    }

    async loadTableData() {
        const tbody = document.getElementById('stockTableBody');
        if (!tbody) return;

        tbody.innerHTML = `
            <tr class="loading-row">
                <td colspan="8" style="text-align: center; padding: 3rem;">
                    <div class="loading-spinner"></div>
                    <p style="margin-top: 1rem; color: var(--text-tertiary);">Loading stock data...</p>
                </td>
            </tr>
        `;

        const promises = CONFIG.stockSymbols.map(async (stockInfo) => {
            const data = await this.api.fetchStockData(stockInfo.symbol);
            stockDataStore.set(stockInfo.symbol, { info: stockInfo, data });
            return { info: stockInfo, data };
        });

        const results = await Promise.all(promises);
        filteredStocks = results;
        this.renderTable(results);
    }

    renderTable(stocks) {
        const tbody = document.getElementById('stockTableBody');
        if (!tbody) return;

        if (stocks.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-tertiary);">
                        No stocks found matching your criteria
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = stocks.map(stock => {
            const isPositive = stock.data.change >= 0;
            const changeClass = isPositive ? 'positive' : 'negative';
            
            return `
                <tr>
                    <td class="symbol-cell">${stock.info.name}</td>
                    <td class="name-cell">${stock.info.displayName}</td>
                    <td class="price-cell">${this.ui.formatPrice(stock.data.price, stock.data.currency)}</td>
                    <td class="change-cell ${changeClass}">${isPositive ? '+' : ''}${stock.data.change.toFixed(2)}</td>
                    <td class="change-percent-cell ${changeClass}">${isPositive ? '+' : ''}${stock.data.changePercent.toFixed(2)}%</td>
                    <td class="volume-cell">${this.ui.formatVolume(stock.data.volume)}</td>
                    <td class="marketcap-cell">${this.ui.formatMarketCap(stock.data.marketCap)}</td>
                    <td class="action-cell">
                        <button class="btn btn-primary btn-small" onclick="viewStockDetails('${stock.info.symbol}')">View</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    sortTable(column) {
        if (currentSort.column === column) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.column = column;
            currentSort.direction = 'asc';
        }

        const sorted = [...filteredStocks].sort((a, b) => {
            let aVal, bVal;

            switch(column) {
                case 'symbol':
                    aVal = a.info.name;
                    bVal = b.info.name;
                    break;
                case 'name':
                    aVal = a.info.displayName;
                    bVal = b.info.displayName;
                    break;
                case 'price':
                    aVal = a.data.price;
                    bVal = b.data.price;
                    break;
                case 'change':
                    aVal = a.data.change;
                    bVal = b.data.change;
                    break;
                case 'changePercent':
                    aVal = a.data.changePercent;
                    bVal = b.data.changePercent;
                    break;
                case 'volume':
                    aVal = a.data.volume;
                    bVal = b.data.volume;
                    break;
                case 'marketCap':
                    aVal = a.data.marketCap;
                    bVal = b.data.marketCap;
                    break;
                default:
                    return 0;
            }

            if (typeof aVal === 'string') {
                return currentSort.direction === 'asc' 
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            } else {
                return currentSort.direction === 'asc'
                    ? aVal - bVal
                    : bVal - aVal;
            }
        });

        document.querySelectorAll('.stock-table th').forEach(th => th.classList.remove('sorted'));
        const sortedTh = document.querySelector(`[data-sort="${column}"]`);
        if (sortedTh) sortedTh.classList.add('sorted');

        this.renderTable(sorted);
    }

    filterTable(searchTerm, sector) {
        let filtered = Array.from(stockDataStore.values());

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(stock => 
                stock.info.name.toLowerCase().includes(term) ||
                stock.info.displayName.toLowerCase().includes(term)
            );
        }

        if (sector) {
            filtered = filtered.filter(stock => stock.info.sector === sector);
        }

        filteredStocks = filtered;
        this.renderTable(filtered);
    }
}

// === CHART MANAGER ===
class ChartManager {
    constructor() {
        this.chart = null;
        this.candlestickSeries = null;
    }

    async init(symbol = '^JKSE') {
        const chartContainer = document.getElementById('tradingview-chart');
        if (!chartContainer) return;

        const isDark = document.body.getAttribute('data-theme') === 'dark';

        this.chart = LightweightCharts.createChart(chartContainer, {
            width: chartContainer.clientWidth,
            height: 500,
            layout: {
                background: { color: isDark ? '#1E293B' : '#FFFFFF' },
                textColor: isDark ? '#CBD5E1' : '#0F172A',
            },
            grid: {
                vertLines: { color: isDark ? '#334155' : '#E2E8F0' },
                horzLines: { color: isDark ? '#334155' : '#E2E8F0' },
            },
            crosshair: {
                mode: LightweightCharts.CrosshairMode.Normal,
            },
            rightPriceScale: {
                borderColor: isDark ? '#334155' : '#E2E8F0',
            },
            timeScale: {
                borderColor: isDark ? '#334155' : '#E2E8F0',
                timeVisible: true,
                secondsVisible: false,
            },
        });

        this.candlestickSeries = this.chart.addCandlestickSeries({
            upColor: '#10B981',
            downColor: '#EF4444',
            borderVisible: false,
            wickUpColor: '#10B981',
            wickDownColor: '#EF4444',
        });

        await this.loadChartData(symbol);

        window.addEventListener('resize', () => {
            this.chart.applyOptions({ width: chartContainer.clientWidth });
        });
    }

    async loadChartData(symbol) {
        // Generate sample candlestick data
        const data = this.generateSampleData();
        this.candlestickSeries.setData(data);
        this.chart.timeScale().fitContent();
    }

    generateSampleData() {
        const data = [];
        const basePrice = 7000;
        let price = basePrice;
        const now = new Date();
        
        for (let i = 30; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            const open = price;
            const change = (Math.random() - 0.5) * 100;
            const close = open + change;
            const high = Math.max(open, close) + Math.random() * 50;
            const low = Math.min(open, close) - Math.random() * 50;
            
            data.push({
                time: Math.floor(date.getTime() / 1000),
                open,
                high,
                low,
                close
            });
            
            price = close;
        }
        
        return data;
    }

    updateTheme() {
        if (!this.chart) return;

        const isDark = document.body.getAttribute('data-theme') === 'dark';

        this.chart.applyOptions({
            layout: {
                background: { color: isDark ? '#1E293B' : '#FFFFFF' },
                textColor: isDark ? '#CBD5E1' : '#0F172A',
            },
            grid: {
                vertLines: { color: isDark ? '#334155' : '#E2E8F0' },
                horzLines: { color: isDark ? '#334155' : '#E2E8F0' },
            },
            rightPriceScale: {
                borderColor: isDark ? '#334155' : '#E2E8F0',
            },
            timeScale: {
                borderColor: isDark ? '#334155' : '#E2E8F0',
            },
        });
    }
}

// === GLOBAL FUNCTIONS ===
function viewStockDetails(symbol) {
    alert(`Viewing details for ${symbol}\n\nFitur ini akan segera hadir!`);
}

function updateChartTheme() {
    if (window.chartManager) {
        window.chartManager.updateTheme();
    }
}

// === APP CONTROLLER ===
class App {
    constructor() {
        this.themeManager = new ThemeManager();
        this.api = new StockAPI();
        this.ui = new UIUpdater(this.api);
        this.tableManager = new StockTableManager(this.api, this.ui);
        this.chartManager = new ChartManager();
        this.refreshTimer = null;
        this.statusTimer = null;
    }

    async init() {
        try {
            Logger.info('Initializing InStrategic v3.0...');
            PerformanceUtils.measurePerformance('init-start');
            
            await this.loadAllData();
            
            this.ui.updateMarketStatus();
            
            this.attachEventListeners();
            
            // Initialize chart with error handling
            try {
                await this.chartManager.init();
                window.chartManager = this.chartManager;
            } catch (error) {
                Logger.error('Chart initialization failed:', error);
                // Continue without chart - not critical
            }
            
            this.startAutoRefresh();
            
            PerformanceUtils.measurePerformance('init-end');
            
            // Log performance metrics
            setTimeout(() => {
                const timing = PerformanceUtils.getPerformanceTiming();
                if (timing) {
                    Logger.info('Performance Metrics:', timing);
                }
            }, 1000);
            
            Logger.info('InStrategic v3.0 initialized successfully!');
        } catch (error) {
            Logger.error('Critical initialization error:', error);
            ErrorHandler.handle(error, 'Application initialization');
        }
    }

    async loadAllData() {
        try {
            PerformanceUtils.measurePerformance('loadAllData-start');
            
            // Load market cards with error handling
            const mainStocks = CONFIG.stockSymbols.slice(0, 4);
            const promises = mainStocks.map(async (stockInfo) => {
                try {
                    const data = await this.api.fetchStockData(stockInfo.symbol);
                    this.ui.updateMarketCard(stockInfo, data);
                    return { info: stockInfo, data };
                } catch (error) {
                    Logger.error(`Failed to load ${stockInfo.symbol}:`, error);
                    ErrorHandler.handle(error, `Loading ${stockInfo.symbol}`);
                    // Return fallback data
                    return { 
                        info: stockInfo, 
                        data: this.api.getFallbackData ? 
                              this.api.getFallbackData(stockInfo.symbol) : 
                              this.api.getMarketAwareSimulation(stockInfo.symbol)
                    };
                }
            });

            const results = await Promise.all(promises);
            this.ui.updateTicker(results);

            // Load stock table with error boundary
            try {
                await this.tableManager.loadTableData();
            } catch (error) {
                Logger.error('Failed to load stock table:', error);
                ErrorHandler.handle(error, 'Loading stock table');
            }
            
            PerformanceUtils.measurePerformance('loadAllData-end');
            Logger.info('All data loaded successfully');
        } catch (error) {
            Logger.error('Critical error in loadAllData:', error);
            ErrorHandler.handle(error, 'Loading market data');
        }
    }

    attachEventListeners() {
        // Search functionality with sanitization
        const searchInput = document.getElementById('stockSearch');
        if (searchInput) {
            // Use debounced search for better performance
            const debouncedSearch = PerformanceUtils.debounce((value, sector) => {
                // Sanitize input to prevent XSS
                const sanitized = SecurityUtils.sanitizeSearchInput(value);
                
                // Rate limit check
                if (!SecurityUtils.rateLimitCheck('search', 30, 10000)) {
                    Logger.warn('Search rate limit exceeded');
                    return;
                }
                
                this.tableManager.filterTable(sanitized, sector);
            }, 300);
            
            searchInput.addEventListener('input', (e) => {
                const sector = document.getElementById('sectorFilter').value;
                debouncedSearch(e.target.value, sector);
            });
        }

        // Sector filter with validation
        const sectorFilter = document.getElementById('sectorFilter');
        if (sectorFilter) {
            sectorFilter.addEventListener('change', (e) => {
                // Validate sector value
                const sector = e.target.value;
                if (!SecurityUtils.isValidSector(sector)) {
                    Logger.error('Invalid sector value:', sector);
                    return;
                }
                
                const search = SecurityUtils.sanitizeSearchInput(
                    document.getElementById('stockSearch').value
                );
                this.tableManager.filterTable(search, sector);
            });
        }

        // Reset filters
        const resetBtn = document.getElementById('resetFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                document.getElementById('stockSearch').value = '';
                document.getElementById('sectorFilter').value = '';
                this.tableManager.filterTable('', '');
            });
        }

        // Table sorting
        document.querySelectorAll('.stock-table th.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const column = th.getAttribute('data-sort');
                this.tableManager.sortTable(column);
            });
        });

        // Chart stock selector
        const chartStock = document.getElementById('chartStock');
        if (chartStock) {
            chartStock.addEventListener('change', (e) => {
                this.chartManager.loadChartData(e.target.value);
            });
        }

        // Mobile menu
        const mobileToggle = document.querySelector('.mobile-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                console.log('Mobile menu toggle');
            });
        }

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    startAutoRefresh() {
        this.refreshTimer = setInterval(() => {
            console.log('Auto-refreshing data...');
            this.loadAllData();
        }, CONFIG.refreshInterval);

        this.statusTimer = setInterval(() => {
            this.ui.updateMarketStatus();
        }, CONFIG.statusCheckInterval);
    }

    destroy() {
        if (this.refreshTimer) clearInterval(this.refreshTimer);
        if (this.statusTimer) clearInterval(this.statusTimer);
        if (this.chartManager.chart) this.chartManager.chart.remove();
    }
}

// === INITIALIZE ===
let app;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new App();
        app.init();
    });
} else {
    app = new App();
    app.init();
}

window.addEventListener('beforeunload', () => {
    if (app) app.destroy();
});

window.InStrategic = { app, version: '3.0.0' };
