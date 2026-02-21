const { Hotel, Room } = require('../models');

exports.getHotels = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const where = {};
        if (status) where.status = status;
        const offset = Math.max(0, (Number(page) - 1) * Math.min(Number(limit) || 20, 100));
        const limitNum = Math.min(Number(limit) || 20, 100);

        const { count, rows } = await Hotel.findAndCountAll({
            where,
            order: [['id', 'DESC']],
            offset,
            limit: limitNum,
            include: [{ model: Room, as: 'Rooms' }]
        });
        return res.json({ total: count, list: rows });
    } catch (e) {
        return res.status(500).json({ message: 'server error' });
    }
};

exports.getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({
            where: { id: req.params.id },
            include: [{ model: Room, as: 'Rooms' }]
        });
        if (!hotel) return res.status(404).json({ message: 'hotel not found' });
        return res.json(hotel);
    } catch (e) {
        return res.status(500).json({ message: 'server error' });
    }
};

exports.approveHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByPk(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'hotel not found' });
        if (hotel.status !== 'pending') return res.status(400).json({ message: 'only pending hotel can be approved' });

        hotel.status = 'approved';
        hotel.reject_reason = null;
        await hotel.save();
        const withRooms = await Hotel.findByPk(hotel.id, { include: [{ model: Room, as: 'Rooms' }] });
        return res.json(withRooms);
    } catch (e) {
        return res.status(500).json({ message: 'server error' });
    }
};

exports.rejectHotel = async (req, res) => {
    try {
        const { reason } = req.body || {};
        const hotel = await Hotel.findByPk(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'hotel not found' });
        if (hotel.status !== 'pending') return res.status(400).json({ message: 'only pending hotel can be rejected' });

        hotel.status = 'rejected';
        hotel.reject_reason = reason != null ? String(reason) : null;
        await hotel.save();
        const withRooms = await Hotel.findByPk(hotel.id, { include: [{ model: Room, as: 'Rooms' }] });
        return res.json(withRooms);
    } catch (e) {
        return res.status(500).json({ message: 'server error' });
    }
};

exports.offlineHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByPk(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'hotel not found' });
        if (hotel.status !== 'approved') return res.status(400).json({ message: 'only approved hotel can be taken offline' });

        hotel.status = 'offline';
        await hotel.save();
        const withRooms = await Hotel.findByPk(hotel.id, { include: [{ model: Room, as: 'Rooms' }] });
        return res.json(withRooms);
    } catch (e) {
        return res.status(500).json({ message: 'server error' });
    }
};

exports.restoreHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByPk(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'hotel not found' });
        if (hotel.status !== 'offline') return res.status(400).json({ message: 'only offline hotel can be restored' });

        hotel.status = 'approved';
        await hotel.save();
        const withRooms = await Hotel.findByPk(hotel.id, { include: [{ model: Room, as: 'Rooms' }] });
        return res.json(withRooms);
    } catch (e) {
        return res.status(500).json({ message: 'server error' });
    }
};

exports.setBanner = async (req, res) => {
    try {
        const hotel = await Hotel.findByPk(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'hotel not found' });
        if (hotel.status !== 'approved') return res.status(400).json({ message: 'only approved hotel can be set as banner' });

        const { is_banner, banner_sort } = req.body || {};
        hotel.is_banner = is_banner !== undefined ? !!is_banner : hotel.is_banner;
        hotel.banner_sort = banner_sort !== undefined ? Number(banner_sort) : hotel.banner_sort;
        await hotel.save();
        const withRooms = await Hotel.findByPk(hotel.id, { include: [{ model: Room, as: 'Rooms' }] });
        return res.json(withRooms);
    } catch (e) {
        return res.status(500).json({ message: 'server error' });
    }
};
