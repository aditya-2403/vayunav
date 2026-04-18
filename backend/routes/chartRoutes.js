const express = require('express');
const router = express.Router();
const scraperService = require('../services/scraperService');
const dbService = require('../services/dbService');
const MESSAGES = require('../constants/messages');

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
        
        const { Readable } = require('stream');
        Readable.fromWeb(response.body).pipe(res);
    } catch (error) {
        console.error(`Proxy Error:`, error);
        res.status(500).json({ error: "Failed to load PDF securely" });
    }
});

module.exports = router;
