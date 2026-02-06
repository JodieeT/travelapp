const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || '<JWT_SECRET_PLACEHOLDER>');
    const user = await User.findByPk(payload.sub);

    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    req.user = { id: user.id, role: user.role, username: user.username };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};