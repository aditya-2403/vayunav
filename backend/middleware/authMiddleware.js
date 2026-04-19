const jwt = require('jsonwebtoken');

/**
 * authMiddleware.js
 * Implements dual-layer authentication:
 * 1. Static API Key (X-API-Key) for basic header/query validation.
 * 2. JWT Session Token (Authorization) for verified pilot sessions.
 */
const authenticate = (req, res, next) => {
    // 1. Static API Key Check (Always required for /api/*)
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;

    if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key.' });
    }

    // 2. JWT Session Check (Skip for the authentication endpoint itself)
    if (req.path === '/verify-pin') {
        return next();
    }

    const authHeader = req.headers['authorization'] || req.query.token;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    if (!token) {
        return res.status(401).json({ error: 'Session Expired: Please enter passcode to continue.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.pilot = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid Session: Please re-authenticate.' });
    }
};

module.exports = authenticate;
