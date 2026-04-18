module.exports = {
    ERR_MISSING_AIRPORT: "airportCode parameter is required",
    ERR_SCRAPING_FAIL: (code) => `Failed to process charts for ${code}`,
    ERR_PROXY_MISSING_URL: "A valid PDF url parameter is required",
    ERR_PROXY_EXTERNAL: (status) => `External server responded with ${status}`,
    ERR_PROXY_FAIL: "Failed to load PDF securely",
    LOG_CACHE_HIT: (code) => `Cache HIT for ${code}`,
    LOG_CACHE_EXPIRED: (code) => `Cache EXPIRED for ${code}`,
    LOG_CACHE_MISS: (code) => `Cache MISS for ${code}`,
    LOG_SCRAPE_FAIL: (code, e) => `Failed to navigate to typical AD2 URL for ${code}: ${e.message}`,
};
