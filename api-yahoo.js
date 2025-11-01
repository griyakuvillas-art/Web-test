// ===================================
// Yahoo Finance API Integration
// Free Real-time Stock Data
// ===================================

// Indonesian Stock Symbols for IDX
const IDX_STOCKS = [
    { symbol: '^JKSE', name: 'IHSG' },         // IDX Composite
    { symbol: 'BBCA.JK', name: 'BBCA' },       // Bank Central Asia
    { symbol: 'TLKM.JK', name: 'TLKM' },       // Telkom Indonesia
    { symbol: 'ASII.JK', name: 'ASII' },       // Astra International
    { symbol: 'UNVR.JK', name: 'UNVR' },       // Unilever Indonesia
    { symbol: 'BMRI.JK', name: 'BMRI' },       // Bank Mandiri
    { symbol: 'BBRI.JK', name: 'BBRI' },       // Bank Rakyat Indonesia
    { symbol: 'BBNI.JK', name: 'BBNI' },       // Bank Negara Indonesia
    { symbol: 'GOTO.JK', name: 'GOTO' },       // GoTo
    { symbol: 'BUKA.JK', name: 'BUKA' },       // Bukalapak
    { symbol: 'AMMN.JK', name: 'AMMN' },       // Amman Mineral
    { symbol: 'ADRO.JK', name: 'ADRO' },       // Adaro Energy
    { symbol: 'ANTM.JK', name: 'ANTM' },       // Aneka Tambang
    { symbol: 'INDF.JK', name: 'INDF' },       // Indofood
    { symbol: 'ICBP.JK', name: 'ICBP' }        // Indofood CBP
];

// Proxy CORS untuk Yahoo Finance
const CORS_PROXY = 'https://corsproxy.io/?';
const YAHOO_API = 'https://query1.finance.yahoo.com/v8/finance/chart/';

// Cache untuk menghindari too many requests
const cache = new Map();
const CACHE_DURATION = 60000; // 1 minute

// ===================================
// Fetch Stock Data
// ===================================
async function fetchStockData(symbol) {
    try {
        // Check cache
        const cached = cache.get(symbol);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        }
        
        const url = `${CORS_PROXY}${YAHOO_API}${symbol}?interval=1d&range=1d`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const result = data.chart.result[0];
        
        if (!result) {
            throw new Error('No data available');
        }
        
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
            currency: quote.currency,
            marketState: quote.marketState
        };
        
        // Cache the data
        cache.set(symbol, {
            data: stockData,
            timestamp: Date.now()
        });
        
        return stockData;
        
    } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        return {
            symbol: symbol,
            price: null,
            change: null,
            changePercent: null,
            error: true
        };
    }
}

// ===================================
// Fetch Multiple Stocks
// ===================================
async function fetchMultipleStocks(symbols) {
    const promises = symbols.map(item => fetchStockData(item.symbol));
    const results = await Promise.all(promises);
    
    return results.map((data, index) => ({
        ...data,
        name: symbols[index].name
    }));
}

// ===================================
// Format Functions
// ===================================
function formatPrice(price, currency = 'IDR') {
    if (!price) return 'N/A';
    
    if (currency === 'IDR') {
        return new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    }
    
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
}

function formatChange(change, changePercent) {
    if (change === null || changePercent === null) return 'N/A';
    
    const sign = change >= 0 ? '+' : '';
    const changeStr = sign + formatPrice(Math.abs(change));
    const percentStr = sign + changePercent.toFixed(2) + '%';
    
    return `${changeStr} (${percentStr})`;
}

function formatTime(date) {
    if (!date) return '';
    
    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Jakarta'
    }).format(date);
}

// ===================================
// Update UI
// ===================================
function updateStockCard(stockSymbol, data) {
    const cardId = stockSymbol.toLowerCase().replace('.jk', '') + '-card';
    const card = document.getElementById(cardId);
    if (!card) return;
    
    const prefix = stockSymbol.toLowerCase().replace('.jk', '');
    const valueEl = document.getElementById(`${prefix}-value`);
    const changeEl = document.getElementById(`${prefix}-change`);
    const timeEl = document.getElementById(`${prefix}-time`);
    const trendEl = card.querySelector('.index-change');
    
    if (!valueEl) return;
    
    if (data.error) {
        valueEl.textContent = 'Error loading';
        if (changeEl) changeEl.textContent = 'Refresh';
        return;
    }
    
    valueEl.textContent = formatPrice(data.price);
    
    if (changeEl) {
        changeEl.textContent = formatChange(data.change, data.changePercent);
        changeEl.className = 'change ' + (data.change >= 0 ? 'positive' : 'negative');
    }
    
    if (timeEl) {
        timeEl.textContent = 'Updated: ' + formatTime(data.time);
    }
    
    // Update trend arrow
    if (trendEl) {
        trendEl.className = 'index-change ' + (data.change >= 0 ? 'positive' : 'negative');
        const svg = trendEl.querySelector('svg path');
        if (svg) {
            svg.setAttribute('d', data.change >= 0 ? 
                'M7 14L12 9L17 14' : // Up arrow
                'M7 10L12 15L17 10'  // Down arrow
            );
        }
    }
}

function updateIHSG(data) {
    updateStockCard('^JKSE', data);
}

function updateTicker(stocksData) {
    const tickerContent = document.getElementById('ticker-content');
    if (!tickerContent) return;
    
    // Clear loading
    tickerContent.innerHTML = '';
    
    // Create ticker items (duplicate for seamless loop)
    const createTickerItems = (data) => {
        return data.map(stock => {
            if (stock.error) return '';
            
            const changeClass = stock.change >= 0 ? 'up' : 'down';
            const arrow = stock.change >= 0 ? '?' : '?';
            
            return `
                <div class="ticker-item">
                    <span class="ticker-symbol">${stock.name}</span>
                    <span class="ticker-price">${formatPrice(stock.price)}</span>
                    <span class="ticker-change ${changeClass}">
                        ${arrow} ${Math.abs(stock.changePercent).toFixed(2)}%
                    </span>
                </div>
            `;
        }).join('');
    };
    
    // Add items twice for seamless loop
    const itemsHTML = createTickerItems(stocksData);
    tickerContent.innerHTML = itemsHTML + itemsHTML;
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
    
    // Check if weekend
    if (day === 0 || day === 6) {
        status = 'Tutup ? Weekend';
    }
    // Check market hours (9:00 - 16:00 WIB)
    else if (hour >= 9 && hour < 16) {
        status = 'Dibuka ? 09:00 - 16:00 WIB';
        isOpen = true;
    }
    // Before market opens
    else if (hour < 9) {
        status = 'Belum Dibuka ? Buka 09:00 WIB';
    }
    // After market closes
    else {
        status = 'Tutup ? Buka Besok 09:00 WIB';
    }
    
    statusEl.innerHTML = `
        <span class="live-indicator" style="${isOpen ? '' : 'background: var(--error);'}"></span>
        <span>${status}</span>
    `;
}

// ===================================
// Initialize & Auto Refresh
// ===================================
async function initStockData() {
    console.log('?? Fetching real-time stock data...');
    
    try {
        // Update market status
        updateMarketStatus();
        
        // Fetch all stocks
        const stocksData = await fetchMultipleStocks(IDX_STOCKS);
        
        // Update IHSG card
        const ihsgData = stocksData.find(s => s.symbol === '^JKSE');
        if (ihsgData) {
            updateIHSG(ihsgData);
        }
        
        // Update top stocks cards
        const bbcaData = stocksData.find(s => s.symbol === 'BBCA.JK');
        if (bbcaData) updateStockCard('BBCA.JK', bbcaData);
        
        const tlkmData = stocksData.find(s => s.symbol === 'TLKM.JK');
        if (tlkmData) updateStockCard('TLKM.JK', tlkmData);
        
        const asiiData = stocksData.find(s => s.symbol === 'ASII.JK');
        if (asiiData) updateStockCard('ASII.JK', asiiData);
        
        // Update ticker tape
        updateTicker(stocksData);
        
        console.log('? Stock data updated successfully');
        
    } catch (error) {
        console.error('? Error initializing stock data:', error);
    }
}

// Auto refresh every 1 minute
function startAutoRefresh() {
    initStockData(); // Initial load
    
    setInterval(() => {
        initStockData();
    }, 60000); // Refresh every 60 seconds
    
    // Update market status more frequently
    setInterval(() => {
        updateMarketStatus();
    }, 10000); // Every 10 seconds
}

// ===================================
// Export
// ===================================
window.YahooFinanceAPI = {
    fetchStockData,
    fetchMultipleStocks,
    formatPrice,
    formatChange,
    formatTime,
    initStockData,
    startAutoRefresh,
    IDX_STOCKS
};

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAutoRefresh);
} else {
    startAutoRefresh();
}
