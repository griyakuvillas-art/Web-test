// ==========================================
// InStrategic - PROFESSIONAL Real-time API
// 100% REAL Yahoo Finance Data - NO MOCK
// Date: November 1, 2025
// ==========================================

/**
 * PROFESSIONAL Yahoo Finance API Client
 * Returns ONLY real-time data from Yahoo Finance
 * NO SIMULATION, NO MOCK DATA
 */

class RealTimeStockAPI {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 10000; // 10 seconds cache for real-time feel
        this.baseURL = 'https://query1.finance.yahoo.com';
        this.corsProxy = 'https://api.allorigins.win/raw?url=';
        
        console.log('%c PROFESSIONAL API ', 'background: #00C853; color: white; font-weight: bold; padding: 4px 8px;');
        console.log('Using Yahoo Finance API - 100% Real Data');
        console.log('Date: November 1, 2025');
    }

    /**
     * Fetch real-time stock data from Yahoo Finance
     * @param {string} symbol - Stock symbol (e.g., 'BBCA.JK')
     * @returns {Promise<Object>} Real stock data
     */
    async fetchStockData(symbol) {
        // Check cache first (10 second cache for performance)
        const cached = this.getFromCache(symbol);
        if (cached) {
            console.log(`[CACHE] ${symbol} - Fresh data from ${new Date(cached.timestamp).toLocaleTimeString()}`);
            return cached;
        }

        console.log(`[API CALL] Fetching real-time data for ${symbol}...`);

        try {
            // Method 1: Direct Yahoo Finance API
            const data = await this.fetchYahooFinanceDirect(symbol);
            console.log(`[SUCCESS] ${symbol} - Real data received at ${new Date().toLocaleTimeString()}`);
            console.log(`[PRICE] ${symbol}: $${data.price.toFixed(2)} (${data.changePercent > 0 ? '+' : ''}${data.changePercent.toFixed(2)}%)`);
            
            this.setCache(symbol, data);
            return data;
        } catch (error) {
            console.error(`[FAILED] Direct API failed for ${symbol}:`, error.message);
            
            // Method 2: Try with CORS proxy
            try {
                const data = await this.fetchYahooFinanceWithProxy(symbol);
                console.log(`[SUCCESS via PROXY] ${symbol} - Real data received`);
                this.setCache(symbol, data);
                return data;
            } catch (proxyError) {
                console.error(`[FAILED] Proxy also failed for ${symbol}:`, proxyError.message);
                
                // If ALL methods fail, throw error - DO NOT USE MOCK DATA
                throw new Error(`Unable to fetch real-time data for ${symbol}. All API methods failed.`);
            }
        }
    }

    /**
     * Method 1: Direct Yahoo Finance API call
     */
    async fetchYahooFinanceDirect(symbol) {
        const url = `${this.baseURL}/v8/finance/chart/${symbol}?interval=1m&range=1d`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Origin': 'https://finance.yahoo.com',
                'Referer': 'https://finance.yahoo.com/'
            },
            mode: 'cors',
            credentials: 'omit'
        });

        if (!response.ok) {
            throw new Error(`Yahoo Finance API returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return this.parseYahooResponse(data, symbol);
    }

    /**
     * Method 2: Yahoo Finance with CORS proxy
     */
    async fetchYahooFinanceWithProxy(symbol) {
        const yahooURL = `${this.baseURL}/v8/finance/chart/${symbol}?interval=1m&range=1d`;
        const proxiedURL = `${this.corsProxy}${encodeURIComponent(yahooURL)}`;
        
        const response = await fetch(proxiedURL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Proxy API returned ${response.status}`);
        }

        const data = await response.json();
        return this.parseYahooResponse(data, symbol);
    }

    /**
     * Parse Yahoo Finance response into clean format
     */
    parseYahooResponse(data, symbol) {
        if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
            throw new Error('Invalid response structure from Yahoo Finance');
        }

        const result = data.chart.result[0];
        const meta = result.meta;
        const timestamps = result.timestamp || [];
        const quote = result.indicators.quote[0];

        // Get the LATEST data point (most recent)
        const lastIndex = timestamps.length - 1;
        
        if (lastIndex < 0) {
            throw new Error('No trading data available for this symbol');
        }

        const currentPrice = quote.close[lastIndex] || meta.regularMarketPrice;
        const previousClose = meta.previousClose || meta.chartPreviousClose;
        
        // Calculate change
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;

        // Get latest timestamp (convert from Unix to Date)
        const latestTimestamp = new Date(timestamps[lastIndex] * 1000);

        const stockData = {
            symbol: symbol,
            name: meta.symbol,
            price: currentPrice,
            previousClose: previousClose,
            open: quote.open[lastIndex] || meta.regularMarketOpen,
            high: quote.high[lastIndex] || meta.regularMarketDayHigh,
            low: quote.low[lastIndex] || meta.regularMarketDayLow,
            volume: quote.volume[lastIndex] || meta.regularMarketVolume || 0,
            change: change,
            changePercent: changePercent,
            timestamp: latestTimestamp,
            marketTime: new Date(meta.regularMarketTime * 1000),
            currency: meta.currency || 'IDR',
            exchangeName: meta.exchangeName || 'Jakarta Stock Exchange',
            marketCap: meta.marketCap || 0,
            
            // Metadata
            source: 'Yahoo Finance Real-time',
            dataQuality: 'REAL',
            fetchTime: new Date(),
            isRealTime: true,
            isMock: false
        };

        return stockData;
    }

    /**
     * Batch fetch multiple stocks
     */
    async fetchBatch(symbols) {
        console.log(`[BATCH] Fetching ${symbols.length} stocks...`);
        
        const promises = symbols.map(async (symbolInfo) => {
            try {
                const data = await this.fetchStockData(symbolInfo.symbol);
                return { info: symbolInfo, data, success: true };
            } catch (error) {
                console.error(`[BATCH ERROR] ${symbolInfo.symbol}:`, error.message);
                return { 
                    info: symbolInfo, 
                    data: null, 
                    success: false,
                    error: error.message 
                };
            }
        });

        const results = await Promise.all(promises);
        
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        
        console.log(`[BATCH COMPLETE] Success: ${successful}, Failed: ${failed}`);
        
        return results;
    }

    /**
     * Get market status (open/closed)
     */
    getMarketStatus() {
        const now = new Date();
        const jakartaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
        
        const day = jakartaTime.getDay();
        const hour = jakartaTime.getHours();
        const minute = jakartaTime.getMinutes();
        const time = hour * 60 + minute;

        // IDX Trading Hours: Monday-Friday, 09:00-16:00 (with break 12:00-13:30)
        const isWeekday = day >= 1 && day <= 5;
        const isMorningSession = time >= 540 && time < 720; // 09:00-12:00
        const isAfternoonSession = time >= 810 && time < 960; // 13:30-16:00
        const isMarketHours = isMorningSession || isAfternoonSession;

        return {
            isOpen: isWeekday && isMarketHours,
            currentTime: jakartaTime,
            session: isMorningSession ? 'Morning Session' : isAfternoonSession ? 'Afternoon Session' : 'Closed',
            nextOpen: this.getNextMarketOpen(jakartaTime)
        };
    }

    /**
     * Calculate next market open time
     */
    getNextMarketOpen(currentTime) {
        const nextOpen = new Date(currentTime);
        
        // If weekend, move to Monday
        if (currentTime.getDay() === 0) { // Sunday
            nextOpen.setDate(nextOpen.getDate() + 1);
        } else if (currentTime.getDay() === 6) { // Saturday
            nextOpen.setDate(nextOpen.getDate() + 2);
        }
        
        // Set to 09:00
        nextOpen.setHours(9, 0, 0, 0);
        
        return nextOpen;
    }

    /**
     * Cache management
     */
    getFromCache(symbol) {
        const cached = this.cache.get(symbol);
        if (cached && Date.now() - cached.fetchTime.getTime() < this.cacheTimeout) {
            return cached;
        }
        return null;
    }

    setCache(symbol, data) {
        this.cache.set(symbol, data);
    }

    clearCache() {
        this.cache.clear();
        console.log('[CACHE] Cleared all cached data');
    }

    /**
     * Get API status
     */
    getAPIStatus() {
        return {
            apiVersion: '1.0.0',
            provider: 'Yahoo Finance',
            dataType: 'Real-time',
            mockData: false,
            cacheTimeout: this.cacheTimeout,
            cachedSymbols: this.cache.size,
            currentDate: new Date().toISOString()
        };
    }
}

/**
 * Alternative API: Financial Modeling Prep (Free tier)
 * Use if Yahoo Finance fails completely
 */
class FinancialModelingPrepAPI {
    constructor() {
        this.baseURL = 'https://financialmodelingprep.com/api/v3';
        this.apiKey = 'demo'; // Free tier - replace with your key for production
    }

    async fetchQuote(symbol) {
        // Convert JK symbols to format FMP understands
        const cleanSymbol = symbol.replace('.JK', '').replace('^', '');
        const url = `${this.baseURL}/quote/${cleanSymbol}?apikey=${this.apiKey}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('FMP API failed');
        
        const data = await response.json();
        if (!data || data.length === 0) throw new Error('No data from FMP');
        
        const quote = data[0];
        return {
            symbol: symbol,
            price: quote.price,
            previousClose: quote.previousClose,
            change: quote.change,
            changePercent: quote.changesPercentage,
            timestamp: new Date(quote.timestamp * 1000),
            volume: quote.volume,
            source: 'Financial Modeling Prep',
            isRealTime: true,
            isMock: false
        };
    }
}

// Export for use in main app
if (typeof window !== 'undefined') {
    window.RealTimeStockAPI = RealTimeStockAPI;
    window.FinancialModelingPrepAPI = FinancialModelingPrepAPI;
}

// Initialize and log status
console.log('%c API READY ', 'background: #10B981; color: white; font-weight: bold; padding: 4px 8px;');
console.log('Professional real-time stock data API initialized');
console.log('Data Source: Yahoo Finance (100% Real)');
console.log('Mock Data: DISABLED');
console.log('Date: November 1, 2025');
