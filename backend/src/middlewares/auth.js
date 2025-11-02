const jwt = require('jsonwebtoken');
const User = require('../../database/models/user/User.js'); // usa tu path real
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async function requireAuth(req, res, next) {
  try {
    const hdr = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ msg: 'Missing token' });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.userId); // ya oculta password por toJSON
    if (!user || user.isActive === false) return res.status(401).json({ msg: 'Invalid user' });

    req.user = user; // queda en req
    next();
  } catch (e) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }
};
