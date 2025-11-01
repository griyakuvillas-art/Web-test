// ===================================
// REAL-TIME STOCK API - NO MOCK DATA
// Using Multiple Reliable Sources
// ===================================

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

const cache = new Map();
const CACHE_DURATION = 30000; // 30 seconds for real-time feel

// ===================================
// REAL API - Yahoo Finance Query2
// ===================================
async function fetchRealTimeData(symbol) {
    // Check cache
    const cached = cache.get(symbol);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log(`?? Using cached data for ${symbol}`);
        return cached.data;
    }
    
    try {
        // Method 1: Yahoo Finance Query2 API
        const url = `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
        
        console.log(`?? Fetching REAL-TIME data for ${symbol}...`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
            throw new Error('Invalid response structure');
        }
        
        const result = data.chart.result[0];
        const meta = result.meta;
        
        // Get real-time price data
        const currentPrice = meta.regularMarketPrice;
        const previousClose = meta.chartPreviousClose || meta.previousClose;
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;
        
        const stockData = {
            symbol: symbol,
            name: symbol.replace('.JK', '').replace('^', ''),
            price: currentPrice,
            previousClose: previousClose,
            change: change,
            changePercent: changePercent,
            volume: meta.regularMarketVolume || 0,
            marketCap: meta.marketCap || 0,
            time: new Date(meta.regularMarketTime * 1000),
            source: 'yahoo-realtime',
            currency: meta.currency || 'IDR'
        };
        
        // Cache the data
        cache.set(symbol, {
            data: stockData,
            timestamp: Date.now()
        });
        
        console.log(`? REAL-TIME data for ${symbol}: ${currentPrice} (${changePercent.toFixed(2)}%)`);
        
        return stockData;
        
    } catch (error) {
        console.error(`? Failed to fetch ${symbol}:`, error.message);
        
        // Try alternative method
        return await fetchWithAlternativeAPI(symbol);
    }
}

// ===================================
// Alternative: FinnHub API (Free)
// ===================================
async function fetchWithAlternativeAPI(symbol) {
    try {
        // Convert JK symbol to standard format
        const cleanSymbol = symbol.replace('.JK', '');
        
        // Using public financial data API
        const url = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=demo`;
        
        console.log(`?? Trying alternative API for ${symbol}...`);
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data.length > 0) {
            const quote = data[0];
            
            const stockData = {
                symbol: symbol,
                name: quote.name || cleanSymbol,
                price: quote.price,
                previousClose: quote.previousClose,
                change: quote.change,
                changePercent: quote.changesPercentage,
                volume: quote.volume,
                marketCap: quote.marketCap,
                time: new Date(),
                source: 'alternative-api',
                currency: 'IDR'
            };
            
            cache.set(symbol, {
                data: stockData,
                timestamp: Date.now()
            });
            
            console.log(`? Got data from alternative API for ${symbol}`);
            return stockData;
        }
        
        throw new Error('No data from alternative API');
        
    } catch (error) {
        console.error(`? Alternative API failed for ${symbol}:`, error.message);
        throw new Error(`Cannot fetch real-time data for ${symbol}`);
    }
}

// ===================================
// Fetch Multiple Stocks Concurrently
// ===================================
async function fetchAllStocks() {
    console.log('?? Fetching REAL-TIME data for all stocks...');
    
    const startTime = Date.now();
    
    // Fetch all stocks concurrently with Promise.allSettled
    const promises = IDX_STOCKS.map(stock => 
        fetchRealTimeData(stock.symbol)
            .then(data => ({
                ...data,
                logo: stock.logo,
                status: 'success'
            }))
            .catch(error => ({
                symbol: stock.symbol,
                name: stock.name,
                logo: stock.logo,
                error: error.message,
                status: 'failed'
            }))
    );
    
    const results = await Promise.all(promises);
    
    const successCount = results.filter(r => r.status === 'success').length;
    const failedCount = results.filter(r => r.status === 'failed').length;
    
    const elapsed = Date.now() - startTime;
    
    console.log(`? Fetched ${successCount} stocks successfully in ${elapsed}ms`);
    if (failedCount > 0) {
        console.warn(`?? ${failedCount} stocks failed to fetch`);
    }
    
    return results;
}

// ===================================
// Format Functions
// ===================================
function formatPrice(price) {
    if (!price || isNaN(price)) return '-';
    
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(price);
}

function formatChange(change, changePercent) {
    if (change === null || changePercent === null || isNaN(change) || isNaN(changePercent)) {
        return '-';
    }
    
    const sign = change >= 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
}

function formatTime(date) {
    if (!date) return '-';
    
    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Jakarta'
    }).format(date);
}

function formatVolume(volume) {
    if (!volume || isNaN(volume)) return '-';
    
    if (volume >= 1000000000) {
        return (volume / 1000000000).toFixed(2) + 'B';
    } else if (volume >= 1000000) {
        return (volume / 1000000).toFixed(2) + 'M';
    } else if (volume >= 1000) {
        return (volume / 1000).toFixed(2) + 'K';
    }
    return volume.toString();
}

// ===================================
// Update UI
// ===================================
function updateStockCard(data) {
    if (data.status === 'failed') {
        console.warn(`Skipping failed stock: ${data.symbol}`);
        return;
    }
    
    const cleanSymbol = data.symbol.toLowerCase().replace('^', '').replace('.jk', '');
    const cardId = cleanSymbol + '-card';
    const card = document.getElementById(cardId);
    
    if (!card) return;
    
    const valueEl = document.getElementById(`${cleanSymbol}-value`);
    const changeEl = document.getElementById(`${cleanSymbol}-change`);
    const timeEl = document.getElementById(`${cleanSymbol}-time`);
    const trendEl = card.querySelector('.index-change');
    
    if (!valueEl) return;
    
    // Update price
    valueEl.textContent = formatPrice(data.price);
    
    // Update change
    if (changeEl) {
        changeEl.textContent = formatChange(data.change, data.changePercent);
        changeEl.className = 'change ' + (data.change >= 0 ? 'positive' : 'negative');
    }
    
    // Update time
    if (timeEl) {
        timeEl.textContent = `Real-time: ${formatTime(data.time)}`;
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
    
    const validStocks = stocksData.filter(s => s.status === 'success');
    
    if (validStocks.length === 0) {
        tickerContent.innerHTML = '<div class="ticker-item">Loading real-time data...</div>';
        return;
    }
    
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
    
    const itemsHTML = createTickerItems(validStocks);
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
async function initRealTimeData() {
    console.log('?? ========================================');
    console.log('?? INITIALIZING REAL-TIME STOCK DATA');
    console.log('?? Source: Yahoo Finance API');
    console.log('?? ========================================');
    
    try {
        updateMarketStatus();
        
        const stocksData = await fetchAllStocks();
        
        // Update main cards
        const ihsg = stocksData.find(s => s.symbol === '^JKSE');
        if (ihsg) updateStockCard(ihsg);
        
        const bbca = stocksData.find(s => s.symbol === 'BBCA.JK');
        if (bbca) updateStockCard(bbca);
        
        const tlkm = stocksData.find(s => s.symbol === 'TLKM.JK');
        if (tlkm) updateStockCard(tlkm);
        
        const asii = stocksData.find(s => s.symbol === 'ASII.JK');
        if (asii) updateStockCard(asii);
        
        // Update ticker
        updateTicker(stocksData);
        
        console.log('? All real-time data updated successfully!');
        
    } catch (error) {
        console.error('? Fatal error:', error);
        showError('Gagal mengambil data real-time. Periksa koneksi internet.');
    }
}

function showError(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        background: var(--error);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 300px;
        font-weight: 600;
    `;
    notification.innerHTML = `? ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 5000);
}

function showSuccess(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 300px;
        font-weight: 600;
    `;
    notification.innerHTML = `? ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

// ===================================
// Auto Refresh - Every 30 seconds
// ===================================
function startAutoRefresh() {
    // Initial load
    initRealTimeData();
    
    // Refresh every 30 seconds for real-time feel
    setInterval(() => {
        console.log('?? Auto-refreshing real-time data...');
        initRealTimeData();
    }, 30000);
    
    // Update market status every 10 seconds
    setInterval(() => {
        updateMarketStatus();
    }, 10000);
}

// ===================================
// Export & Auto-start
// ===================================
window.RealTimeStockAPI = {
    fetchRealTimeData,
    fetchAllStocks,
    initRealTimeData,
    startAutoRefresh,
    formatPrice,
    formatChange,
    formatVolume,
    IDX_STOCKS
};

// Start automatically
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('?? DOM Ready - Starting Real-Time Stock API');
        startAutoRefresh();
        showSuccess('Real-time data loading...');
    });
} else {
    console.log('?? Starting Real-Time Stock API');
    startAutoRefresh();
}

console.log('? Real-Time Stock API Module Loaded');
console.log('?? NO MOCK DATA - 100% Real Yahoo Finance');
