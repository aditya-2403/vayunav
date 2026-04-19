/**
 * authMiddleware.js
 * Validates the X-API-Key header on all protected /api/* routes.
 * Also accepts the key via `?apiKey=` query param for iframe-based requests
 * (e.g. proxy-pdf) where setting request headers is not possible.
 * The /ping endpoint is registered before this middleware and is unaffected.
 */
const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;

    if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key.' });
    }

    next();
};

module.exports = authenticate;
