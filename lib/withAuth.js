const jwt = require('jsonwebtoken');
const cookie = require('cookie');

function getTokenFromReq(req) {
  const header = req.headers.cookie || '';
  const cookies = cookie.parse(header || '');
  return cookies.token;
}

function withAuth(handler) {
  return async (req, res) => {
    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ message: 'Not authenticated' });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { sub, role, username, iat, exp }
      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}

function requireRole(roles) {
  return (handler) => withAuth((req, res) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    return handler(req, res);
  });
}

module.exports = { withAuth, requireRole };