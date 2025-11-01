// ===================================
// Yahoo Finance API - FIXED VERSION
// With Fallback & Better Error Handling
// ===================================

// Indonesian Stock Symbols
const IDX_STOCKS = [
    { symbol: '^JKSE', name: 'IHSG', logo: '??' },
    { symbol: 'BBCA.JK', name: 'BBCA', logo: 'https://logo.clearbit.com/bca.co.id' },
    { symbol: 'TLKM.JK', name: 'TLKM', logo: 'https://logo.clearbit.com/telkom.co.id' },
    { symbol: 'ASII.JK', name: 'ASII', logo: 'https://logo.clearbit.com/astra.co.id' },
    { symbol: 'UNVR.JK', name: 'UNVR', logo: 'https://logo.clearbit.com/unilever.co.id' },
    { symbol: 'BMRI.JK', name: 'BMRI', logo: 'https://logo.clearbit.com/bankmandiri.co.id' },
    { symbol: 'BBRI.JK', name: 'BBRI', logo: 'https://logo.clearbit.com/bri.co.id' },
    { symbol: 'BBNI.JK', name: 'BBNI', logo: 'https://logo.clearbit.com/bni.co.id' },
    { symbol: 'GOTO.JK', name: 'GOTO', logo: 'https://logo.clearbit.com/goto.com' },
    { symbol: 'AMMN.JK', name: 'AMMN', logo: '??' },
    { symbol: 'ADRO.JK', name: 'ADRO', logo: '?' },
    { symbol: 'ANTM.JK', name: 'ANTM', logo: '??' },
    { symbol: 'INDF.JK', name: 'INDF', logo: '??' },
    { symbol: 'ICBP.JK', name: 'ICBP', logo: '??' },
    { symbol: 'EMTK.JK', name: 'EMTK', logo: '??' }
];

// Demo/Fallback data untuk development
const DEMO_DATA = {
    '^JKSE': { price: 7245.32, change: 48.25, changePercent: 0.67 },
    'BBCA.JK': { price: 10375, change: 125, changePercent: 1.22 },
    'TLKM.JK': { price: 4120, change: -40, changePercent: -0.96 },
    'ASII.JK': { price: 5450, change: 75, changePercent: 1.39 },
    'UNVR.JK': { price: 2890, change: 25, changePercent: 0.87 },
    'BMRI.JK': { price: 6125, change: -35, changePercent: -0.57 },
    'BBRI.JK': { price: 4980, change: 60, changePercent: 1.22 },
    'BBNI.JK': { price: 5320, change: 45, changePercent: 0.85 },
    'GOTO.JK': { price: 128, change: -2, changePercent: -1.54 },
    'AMMN.JK': { price: 12500, change: 250, changePercent: 2.04 },
    'ADRO.JK': { price: 3280, change: 40, changePercent: 1.23 },
    'ANTM.JK': { price: 2150, change: -25, changePercent: -1.15 },
    'INDF.JK': { price: 6750, change: 50, changePercent: 0.75 },
    'ICBP.JK': { price: 10200, change: 150, changePercent: 1.49 },
    'EMTK.JK': { price: 1240, change: -15, changePercent: -1.19 }
};

// Multiple API options
const API_OPTIONS = [
    {
        name: 'Yahoo Finance Direct',
        url: (symbol) => `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
    },
    {
        name: 'AllOrigins Proxy',
        url: (symbol) => `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`)}`
    },
    {
        name: 'CORS Anywhere',
        url: (symbol) => `https://cors-anywhere.herokuapp.com/https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
    }
];

let currentApiIndex = 0;
const cache = new Map();
const CACHE_DURATION = 60000; // 1 minute

// ===================================
// Fetch with multiple fallbacks
// ===================================
async function fetchStockDataWithFallback(symbol) {
    // Check cache first
    const cached = cache.get(symbol);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    
    // Try real API first
    for (let i = 0; i < API_OPTIONS.length; i++) {
        try {
            const apiOption = API_OPTIONS[currentApiIndex];
            const url = apiOption.url(symbol);
            
            console.log(`Trying ${apiOption.name} for ${symbol}...`);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
            
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            const result = data.chart?.result?.[0];
            
            if (!result) throw new Error('No data in response');
            
            const quote = result.meta;
            const currentPrice = quote.regularMarketPrice || quote.previousClose;
            const previousClose = quote.previousClose || quote.chartPreviousClose;
            const change = currentPrice - previousClose;
            const changePercent = (change / previousClose) * 100;
            
            const stockData = {
                symbol: symbol,
                price: currentPrice,
                change: change,
                changePercent: changePercent,
                volume: quote.regularMarketVolume,
                time: new Date(quote.regularMarketTime * 1000),
                source: 'live'
            };
            
            // Cache success
            cache.set(symbol, {
                data: stockData,
                timestamp: Date.now()
            });
            
            console.log(`? ${symbol} data fetched successfully from ${apiOption.name}`);
            return stockData;
            
        } catch (error) {
            console.warn(`? ${API_OPTIONS[currentApiIndex].name} failed:`, error.message);
            currentApiIndex = (currentApiIndex + 1) % API_OPTIONS.length;
            
            if (i === API_OPTIONS.length - 1) {
                // All APIs failed, use demo data
                console.log(`?? Using demo data for ${symbol}`);
                return getDemoData(symbol);
            }
        }
    }
    
    // Fallback to demo data
    return getDemoData(symbol);
}

function getDemoData(symbol) {
    const demo = DEMO_DATA[symbol];
    if (!demo) {
        return {
            symbol: symbol,
            price: 1000 + Math.random() * 9000,
            change: (Math.random() - 0.5) * 200,
            changePercent: (Math.random() - 0.5) * 5,
            time: new Date(),
            source: 'demo'
        };
    }
    
    // Add small random variation to demo data
    const variation = 1 + (Math.random() - 0.5) * 0.02; // ?1%
    
    return {
        symbol: symbol,
        price: demo.price * variation,
        change: demo.change * variation,
        changePercent: demo.changePercent * variation,
        time: new Date(),
        source: 'demo'
    };
}

// ===================================
// Fetch Multiple Stocks
// ===================================
async function fetchMultipleStocks(symbols) {
    console.log('?? Fetching stock data for', symbols.length, 'stocks...');
    
    const promises = symbols.map(item => 
        fetchStockDataWithFallback(item.symbol)
            .catch(err => {
                console.error(`Error fetching ${item.symbol}:`, err);
                return getDemoData(item.symbol);
            })
    );
    
    const results = await Promise.all(promises);
    
    return results.map((data, index) => ({
        ...data,
        name: symbols[index].name,
        logo: symbols[index].logo
    }));
}

// ===================================
// Format Functions
// ===================================
function formatPrice(price) {
    if (!price || isNaN(price)) return 'N/A';
    
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(price);
}

function formatChange(change, changePercent) {
    if (change === null || changePercent === null || isNaN(change) || isNaN(changePercent)) {
        return 'N/A';
    }
    
    const sign = change >= 0 ? '+' : '';
    const percentStr = sign + changePercent.toFixed(2) + '%';
    
    return percentStr;
}

function formatTime(date) {
    if (!date) return '';
    
    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta'
    }).format(date);
}

// ===================================
// Update UI Functions
// ===================================
function updateStockCard(stockSymbol, data) {
    const cleanSymbol = stockSymbol.toLowerCase().replace('^', '').replace('.jk', '');
    const cardId = cleanSymbol + '-card';
    const card = document.getElementById(cardId);
    
    if (!card) {
        console.warn(`Card not found: ${cardId}`);
        return;
    }
    
    const valueEl = document.getElementById(`${cleanSymbol}-value`);
    const changeEl = document.getElementById(`${cleanSymbol}-change`);
    const timeEl = document.getElementById(`${cleanSymbol}-time`);
    const trendEl = card.querySelector('.index-change');
    
    if (!valueEl) {
        console.warn(`Value element not found for ${cleanSymbol}`);
        return;
    }
    
    // Update price
    valueEl.textContent = formatPrice(data.price);
    
    // Update change
    if (changeEl) {
        changeEl.textContent = formatChange(data.change, data.changePercent);
        changeEl.className = 'change ' + (data.change >= 0 ? 'positive' : 'negative');
    }
    
    // Update time
    if (timeEl) {
        const timeStr = formatTime(data.time);
        const source = data.source === 'demo' ? '(Demo)' : '';
        timeEl.textContent = `Update: ${timeStr} ${source}`;
    }
    
    // Update trend arrow
    if (trendEl) {
        trendEl.className = 'index-change ' + (data.change >= 0 ? 'positive' : 'negative');
        const svg = trendEl.querySelector('svg path');
        if (svg) {
            svg.setAttribute('d', data.change >= 0 ? 
                'M7 14L12 9L17 14' : 
                'M7 10L12 15L17 10'
            );
        }
    }
}

function updateTicker(stocksData) {
    const tickerContent = document.getElementById('ticker-content');
    if (!tickerContent) return;
    
    tickerContent.innerHTML = '';
    
    const createTickerItems = (data) => {
        return data.map(stock => {
            const changeClass = stock.change >= 0 ? 'up' : 'down';
            const arrow = stock.change >= 0 ? '?' : '?';
            
            return `
                <div class="ticker-item">
                    <span class="ticker-symbol">${stock.name}</span>
                    <span class="ticker-price">${formatPrice(stock.price)}</span>
                    <span class="ticker-change ${changeClass}">
                        ${arrow} ${Math.abs(stock.changePercent || 0).toFixed(2)}%
                    </span>
                </div>
            `;
        }).join('');
    };
    
    const itemsHTML = createTickerItems(stocksData);
    tickerContent.innerHTML = itemsHTML + itemsHTML; // Duplicate for seamless loop
}

function updateMarketStatus() {
    const now = new Date();
    const jakartaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const hour = jakartaTime.getHours();
    const day = jakartaTime.getDay();
    
    const statusEl = document.getElementById('market-status');
    if (!statusEl) return;
    
    let status = '';
    let isOpen = false;
    
    if (day === 0 || day === 6) {
        status = 'Tutup ? Weekend';
    } else if (hour >= 9 && hour < 16) {
        status = 'Dibuka ? 09:00 - 16:00 WIB';
        isOpen = true;
    } else if (hour < 9) {
        status = 'Belum Dibuka ? Buka 09:00 WIB';
    } else {
        status = 'Tutup ? Buka Besok 09:00 WIB';
    }
    
    statusEl.innerHTML = `
        <span class="live-indicator" style="${isOpen ? '' : 'background: var(--error);'}"></span>
        <span>${status}</span>
    `;
}

// ===================================
// Initialize
// ===================================
async function initStockData() {
    console.log('?? Initializing stock data...');
    
    try {
        updateMarketStatus();
        
        const stocksData = await fetchMultipleStocks(IDX_STOCKS);
        
        // Update specific cards
        const ihsgData = stocksData.find(s => s.symbol === '^JKSE');
        if (ihsgData) updateStockCard('^JKSE', ihsgData);
        
        const bbcaData = stocksData.find(s => s.symbol === 'BBCA.JK');
        if (bbcaData) updateStockCard('BBCA.JK', bbcaData);
        
        const tlkmData = stocksData.find(s => s.symbol === 'TLKM.JK');
        if (tlkmData) updateStockCard('TLKM.JK', tlkmData);
        
        const asiiData = stocksData.find(s => s.symbol === 'ASII.JK');
        if (asiiData) updateStockCard('ASII.JK', asiiData);
        
        // Update ticker
        updateTicker(stocksData);
        
        console.log('? Stock data updated successfully');
        
    } catch (error) {
        console.error('? Error initializing:', error);
        // Show fallback UI
        showErrorNotification('Menggunakan data demo. Refresh untuk coba lagi.');
    }
}

function showErrorNotification(message) {
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        background: var(--warning);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-size: 0.875rem;
        max-width: 300px;
    `;
    notif.textContent = '?? ' + message;
    document.body.appendChild(notif);
    
    setTimeout(() => notif.remove(), 5000);
}

// Auto refresh
function startAutoRefresh() {
    initStockData();
    
    setInterval(() => {
        initStockData();
    }, 60000); // Every 60 seconds
    
    setInterval(() => {
        updateMarketStatus();
    }, 30000); // Every 30 seconds
}

// Export
window.YahooFinanceAPI = {
    fetchStockDataWithFallback,
    fetchMultipleStocks,
    formatPrice,
    formatChange,
    initStockData,
    startAutoRefresh,
    IDX_STOCKS,
    DEMO_DATA
};

// Auto-start
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAutoRefresh);
} else {
    startAutoRefresh();
}

console.log('? Yahoo Finance API (Fixed Version) loaded');
