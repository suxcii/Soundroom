const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.replace('Bearer ', '');

    if(!token) {
        return res.status(401).json({ error: 'No token'});

    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();
    } catch (err) {
        res.status(401).json({ error: "Inviald token" });
    }
}

module.exports = requireAuth;