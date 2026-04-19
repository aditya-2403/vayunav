const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const scraperService = require('../services/scraperService');
const dbService = require('../services/dbService');
const MESSAGES = require('../constants/messages');

// Endpoint to verify PIN and issue JWT
router.post('/verify-pin', async (req, res) => {
    const { pin } = req.body;
    if (!pin) return res.status(400).json({ error: 'Passcode is required' });

    if (pin === process.env.APP_PIN) {
        const token = jwt.sign({ pilot: true }, process.env.JWT_SECRET, { expiresIn: '24h' });
        return res.json({ success: true, token });
    } else {
        return res.status(401).json({ error: 'Invalid Passcode' });
    }
});

// Endpoint to scrape airports
router.get('/airports', async (req, res) => {
    try {
        const airports = await scraperService.scrapeAirports();
        res.json(airports);
    } catch (error) {
        console.error("Error scraping airports:", error);
        res.status(500).json({ error: error.message || 'Failed to scrape airports' });
    }
});

// Endpoint to scrape charts for an airport
router.get('/charts/:airportCode', async (req, res) => {
    const { airportCode } = req.params;
    if (!airportCode) {
        return res.status(400).json({ error: MESSAGES.ERR_MISSING_AIRPORT });
    }
    try {
        // 1. Try Firebase Cache
        const cachedCharts = await dbService.getCachedCharts(airportCode);
        if (cachedCharts) {
            return res.json(cachedCharts);
        }

        // 2. Fallback to Scraper
        const charts = await scraperService.scrapeCharts(airportCode);
        
        // 3. Save to Cache
        if (charts && charts.length > 0) {
            await dbService.cacheCharts(airportCode, charts);
        }
        res.json(charts);
    } catch (error) {
        console.error(MESSAGES.ERR_SCRAPING_FAIL(airportCode), error);
        res.status(500).json({ error: error.message || MESSAGES.ERR_SCRAPING_FAIL(airportCode) });
    }
});

// Endpoint to proxy PDF fetching to bypass iframe X-Frame-Options
router.get('/proxy-pdf', async (req, res) => {
    const { url } = req.query;
    if (!url || !url.endsWith('.pdf')) {
        return res.status(400).json({ error: MESSAGES.ERR_PROXY_MISSING_URL });
    }
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`External server responded with ${response.status}`);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        
        // Forward essential headers for PDF.js to support progressive loading
        if (response.headers.has('content-length')) {
            res.setHeader('Content-Length', response.headers.get('content-length'));
        }
        if (response.headers.has('accept-ranges')) {
            res.setHeader('Accept-Ranges', response.headers.get('accept-ranges'));
        }
        res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Accept-Ranges');
        
        const { Readable } = require('stream');
        Readable.fromWeb(response.body).pipe(res);
    } catch (error) {
        console.error(`Proxy Error:`, error);
        res.status(500).json({ error: "Failed to load PDF securely" });
    }
});

// Endpoint to proxy METAR fetching from NOAA (CORS bypass)
router.get('/metar/:icao', async (req, res) => {
    const { icao } = req.params;
    if (!icao) return res.status(400).json({ error: 'Missing ICAO code' });
    try {
        const response = await fetch(`https://aviationweather.gov/api/data/metar?ids=${icao.toUpperCase()}`);
        const text = await response.text();
        res.setHeader('Content-Type', 'text/plain');
        res.send(text || 'METAR NOT AVAILABLE');
    } catch (error) {
        console.error(`METAR Proxy Error:`, error);
        res.status(500).send('WEATHER DATA OFFLINE');
    }
});

module.exports = router;
