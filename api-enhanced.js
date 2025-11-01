// ==========================================
// InStrategic - Enhanced Real-time API
// Enterprise-Grade Yahoo Finance Integration
// ==========================================

/**
 * Enhanced API Client with multiple fallback strategies
 * Supports real-time data fetching with proper error handling
 * Last Updated: November 1, 2024
 */

class EnhancedStockAPI {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 15000; // 15 seconds for more frequent updates
        this.requestQueue = new Map();
        this.rateLimiter = new RateLimiter(50, 60000); // 50 requests per minute
        this.retryAttempts = 3;
        this.retryDelay = 1000;
    }

    /**
     * Primary API: Yahoo Finance v8 (Most Recent Data)
     * Endpoint provides latest market data with minimal latency
     */
    async fetchYahooFinanceV8(symbol) {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) {
            throw new Error(`Yahoo Finance API error: ${response.status}`);
        }

        const data = await response.json();
        return this.parseYahooResponse(data);
    }

    /**
     * Fallback API 1: Yahoo Finance v7 (Alternative Endpoint)
     */
    async fetchYahooFinanceV7(symbol) {
        const url = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            },
            signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) throw new Error(`Yahoo Finance V7 error: ${response.status}`);

        const data = await response.json();
        return this.parseYahooQuoteResponse(data);
    }

    /**
     * Fallback API 2: Financial Modeling Prep (Free Tier)
     * Requires API key but has free tier
     */
    async fetchFinancialModelingPrep(symbol) {
        // Remove .JK suffix for FMP API
        const cleanSymbol = symbol.replace('.JK', '');
        const url = `https://financialmodelingprep.com/api/v3/quote/${cleanSymbol}?apikey=demo`;
        
        const response = await fetch(url, {
            signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) throw new Error(`FMP API error: ${response.status}`);

        const data = await response.json();
        return this.parseFMPResponse(data);
    }

    /**
     * Fallback API 3: Alpha Vantage (Free Tier)
     */
    async fetchAlphaVantage(symbol) {
        const cleanSymbol = symbol.replace('.JK', '');
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${cleanSymbol}&apikey=demo`;
        
        const response = await fetch(url, {
            signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) throw new Error(`Alpha Vantage error: ${response.status}`);

        const data = await response.json();
        return this.parseAlphaVantageResponse(data);
    }

    /**
     * Main fetch method with cascading fallbacks
     * Returns the freshest data available from multiple sources
     */
    async fetchStockData(symbol) {
        // Check cache first
        const cached = this.getFromCache(symbol);
        if (cached) {
            console.log(`[CACHE HIT] ${symbol} - Age: ${Date.now() - cached.fetchTime}ms`);
            return cached;
        }

        // Check if request is already in progress
        if (this.requestQueue.has(symbol)) {
            console.log(`[QUEUE] Waiting for existing request: ${symbol}`);
            return await this.requestQueue.get(symbol);
        }

        // Create new request
        const requestPromise = this.fetchWithFallbacks(symbol);
        this.requestQueue.set(symbol, requestPromise);

        try {
            const result = await requestPromise;
            this.setCache(symbol, result);
            return result;
        } finally {
            this.requestQueue.delete(symbol);
        }
    }

    /**
     * Fetch with multiple API fallbacks
     * Tries each API in order until one succeeds
     */
    async fetchWithFallbacks(symbol) {
        const apis = [
            { name: 'Yahoo Finance V8', fn: () => this.fetchYahooFinanceV8(symbol) },
            { name: 'Yahoo Finance V7', fn: () => this.fetchYahooFinanceV7(symbol) },
            { name: 'Financial Modeling Prep', fn: () => this.fetchFinancialModelingPrep(symbol) },
            { name: 'Alpha Vantage', fn: () => this.fetchAlphaVantage(symbol) }
        ];

        let lastError;

        for (const api of apis) {
            try {
                console.log(`[API] Trying ${api.name} for ${symbol}...`);
                const result = await api.fn();
                console.log(`[SUCCESS] ${api.name} returned data for ${symbol}`);
                return {
                    ...result,
                    source: api.name,
                    fetchTime: Date.now(),
                    isRealTime: true
                };
            } catch (error) {
                console.warn(`[FAIL] ${api.name} for ${symbol}:`, error.message);
                lastError = error;
            }
        }

        // All APIs failed - use intelligent fallback with market-aware simulation
        console.error(`[FALLBACK] All APIs failed for ${symbol}. Using market-aware simulation.`);
        return this.getMarketAwareSimulation(symbol);
    }

    /**
     * Parse Yahoo Finance V8 response
     */
    parseYahooResponse(data) {
        if (!data.chart || !data.chart.result || !data.chart.result[0]) {
            throw new Error('Invalid Yahoo Finance response structure');
        }

        const result = data.chart.result[0];
        const meta = result.meta;
        const quotes = result.indicators.quote[0];
        
        // Get the latest data point
        const lastIndex = quotes.close.length - 1;
        const currentPrice = quotes.close[lastIndex];
        const previousClose = meta.previousClose || meta.chartPreviousClose;
        
        return {
            symbol: meta.symbol,
            price: currentPrice,
            previousClose: previousClose,
            open: quotes.open[lastIndex],
            high: quotes.high[lastIndex],
            low: quotes.low[lastIndex],
            volume: quotes.volume[lastIndex],
            change: currentPrice - previousClose,
            changePercent: ((currentPrice - previousClose) / previousClose) * 100,
            marketCap: meta.marketCap || 0,
            timestamp: new Date(meta.regularMarketTime * 1000),
            currency: meta.currency || 'IDR',
            exchangeName: meta.exchangeName,
            regularMarketTime: new Date(meta.regularMarketTime * 1000)
        };
    }

    /**
     * Parse Yahoo Finance V7 quote response
     */
    parseYahooQuoteResponse(data) {
        if (!data.quoteResponse || !data.quoteResponse.result || data.quoteResponse.result.length === 0) {
            throw new Error('Invalid Yahoo Quote response');
        }

        const quote = data.quoteResponse.result[0];
        
        return {
            symbol: quote.symbol,
            price: quote.regularMarketPrice,
            previousClose: quote.regularMarketPreviousClose,
            open: quote.regularMarketOpen,
            high: quote.regularMarketDayHigh,
            low: quote.regularMarketDayLow,
            volume: quote.regularMarketVolume,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent,
            marketCap: quote.marketCap || 0,
            timestamp: new Date(quote.regularMarketTime * 1000),
            currency: quote.currency || 'IDR',
            exchangeName: quote.fullExchangeName
        };
    }

    /**
     * Parse Financial Modeling Prep response
     */
    parseFMPResponse(data) {
        if (!data || data.length === 0) {
            throw new Error('No data from FMP');
        }

        const quote = data[0];
        return {
            symbol: quote.symbol,
            price: quote.price,
            previousClose: quote.previousClose,
            open: quote.open,
            high: quote.dayHigh,
            low: quote.dayLow,
            volume: quote.volume,
            change: quote.change,
            changePercent: quote.changesPercentage,
            marketCap: quote.marketCap || 0,
            timestamp: new Date(quote.timestamp * 1000),
            currency: 'IDR'
        };
    }

    /**
     * Parse Alpha Vantage response
     */
    parseAlphaVantageResponse(data) {
        if (!data['Global Quote']) {
            throw new Error('Invalid Alpha Vantage response');
        }

        const quote = data['Global Quote'];
        const price = parseFloat(quote['05. price']);
        const previousClose = parseFloat(quote['08. previous close']);
        
        return {
            symbol: quote['01. symbol'],
            price: price,
            previousClose: previousClose,
            open: parseFloat(quote['02. open']),
            high: parseFloat(quote['03. high']),
            low: parseFloat(quote['04. low']),
            volume: parseInt(quote['06. volume']),
            change: parseFloat(quote['09. change']),
            changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
            marketCap: 0,
            timestamp: new Date(quote['07. latest trading day']),
            currency: 'IDR'
        };
    }

    /**
     * Market-aware simulation for fallback
     * Uses realistic price movements based on market hours and historical patterns
     */
    getMarketAwareSimulation(symbol) {
        const baseValues = this.getBaseValues();
        const base = baseValues[symbol] || 1000;
        
        // Check if market is open
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();
        const isWeekday = day >= 1 && day <= 5;
        const isMarketHours = hour >= 9 && hour < 16;
        const isMarketOpen = isWeekday && isMarketHours;
        
        // More volatile during market hours
        const volatility = isMarketOpen ? 0.015 : 0.005; // 1.5% vs 0.5%
        const variation = (Math.random() - 0.5) * base * volatility;
        
        const price = base + variation;
        const previousClose = base;
        const change = price - previousClose;
        const changePercent = (change / previousClose) * 100;
        
        return {
            symbol: symbol,
            price: price,
            previousClose: previousClose,
            open: base + (Math.random() - 0.5) * base * 0.01,
            high: Math.max(price, base) + Math.random() * base * 0.01,
            low: Math.min(price, base) - Math.random() * base * 0.01,
            volume: Math.floor(Math.random() * 50000000) + 1000000,
            change: change,
            changePercent: changePercent,
            marketCap: price * Math.floor(Math.random() * 10000000000) + 1000000000,
            timestamp: now,
            currency: 'IDR',
            source: 'Market-Aware Simulation',
            fetchTime: Date.now(),
            isRealTime: false,
            simulationReason: 'All external APIs unavailable'
        };
    }

    /**
     * Base values for Indonesian stocks (updated November 1, 2024)
     * These are approximate values and should be updated periodically
     */
    getBaseValues() {
        return {
            '^JKSE': 7200,   // IDX Composite
            'BBCA.JK': 10375, // Bank Central Asia
            'TLKM.JK': 4120,  // Telkom Indonesia
            'ASII.JK': 5450,  // Astra International
            'BBRI.JK': 5250,  // Bank Rakyat Indonesia
            'BMRI.JK': 6475,  // Bank Mandiri
            'UNVR.JK': 4250,  // Unilever Indonesia
            'GOTO.JK': 118,   // GoTo
            'BBNI.JK': 5800,  // Bank Negara Indonesia
            'ADRO.JK': 3150,  // Adaro Energy
            'INDF.JK': 6800,  // Indofood
            'ICBP.JK': 11200, // Indofood CBP
            'KLBF.JK': 1550,  // Kalbe Farma
            'PTBA.JK': 2880,  // Bukit Asam
            'PGAS.JK': 1490,  // Perusahaan Gas Negara
            'ANTM.JK': 2140,  // Aneka Tambang
            'JSMR.JK': 4950,  // Jasa Marga
            'EXCL.JK': 2850,  // XL Axiata
            'SMGR.JK': 5600,  // Semen Indonesia
            'INCO.JK': 5150,  // Vale Indonesia
            'WIKA.JK': 1250,  // Wijaya Karya
            'WSKT.JK': 1180,  // Waskita Karya
            'PTPP.JK': 1950,  // PP (Persero)
            'BBTN.JK': 1450,  // Bank Tabungan Negara
            'MAPI.JK': 1750   // Mitra Adiperkasa
        };
    }

    /**
     * Cache management
     */
    getFromCache(symbol) {
        const cached = this.cache.get(symbol);
        if (cached && Date.now() - cached.fetchTime < this.cacheTimeout) {
            return cached;
        }
        return null;
    }

    setCache(symbol, data) {
        this.cache.set(symbol, {
            ...data,
            fetchTime: Date.now()
        });
    }

    clearCache() {
        this.cache.clear();
    }

    /**
     * Batch fetch multiple stocks
     * More efficient than individual requests
     */
    async fetchBatch(symbols) {
        const promises = symbols.map(symbol => 
            this.fetchStockData(symbol).catch(error => {
                console.error(`Batch fetch failed for ${symbol}:`, error);
                return this.getMarketAwareSimulation(symbol);
            })
        );

        return await Promise.all(promises);
    }
}

/**
 * Rate Limiter to prevent API abuse
 */
class RateLimiter {
    constructor(maxRequests, timeWindow) {
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow;
        this.requests = [];
    }

    async acquire() {
        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < this.timeWindow);

        if (this.requests.length >= this.maxRequests) {
            const oldestRequest = this.requests[0];
            const waitTime = this.timeWindow - (now - oldestRequest);
            console.warn(`[RATE LIMIT] Waiting ${waitTime}ms`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return this.acquire();
        }

        this.requests.push(now);
    }
}

/**
 * Export for use in main app
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EnhancedStockAPI, RateLimiter };
}
