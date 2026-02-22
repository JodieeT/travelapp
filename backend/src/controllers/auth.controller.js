const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

function signToken(user) {
    const secret = process.env.JWT_SECRET || '<JWT_SECRET_PLACEHOLDER>';
    return jwt.sign(
        { role: user.role, username: user.username },
        secret,
        { subject: String(user.id), expiresIn: '7d' }
    );
}

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body || {};
        if (!username || !password) return res.status(400).json({ message: '请输入用户名和密码' });
        if (String(password).length < 6) return res.status(400).json({ message: '密码至少需要 6 位' });

        const existed = await User.findOne({ where: { username } });
        if (existed) return res.status(409).json({ message: '用户名已存在' });

        const password_hash = await bcrypt.hash(String(password), 10);
        const role = ['merchant', 'admin'].includes(req.body.role) ? req.body.role : 'merchant';
        const user = await User.create({ username, password_hash, role });
        const token = signToken(user);

        return res.json({
            token,
            user: { id: user.id, username: user.username, role: user.role }
        });
    } catch (e) {
        return res.status(500).json({ message: '服务器错误' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body || {};
        if (!username || !password) return res.status(400).json({ message: '请输入用户名和密码' });

        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(401).json({ message: '用户名或密码错误' });

        const ok = await bcrypt.compare(String(password), user.password_hash || '');
        if (!ok) return res.status(401).json({ message: '用户名或密码错误' });

        const token = signToken(user);
        return res.json({
            token,
            user: { id: user.id, username: user.username, role: user.role }
        });
    } catch (e) {
        return res.status(500).json({ message: '服务器错误' });
    }
};