const { Hotel, Room } = require('../models');
const { Op } = require('sequelize');
const sse = require('../services/sse.service');

exports.getBanners = async (req, res) => {
    try {
        const list = await Hotel.findAll({
            where: { status: 'approved', is_banner: true },
            order: [['banner_sort', 'ASC'], ['id', 'DESC']],
            attributes: ['id', 'name_cn', 'name_en', 'images', 'city', 'star_level']
        });
        return res.json(list);
    } catch (e) {
        return res.status(500).json({ message: 'server error' });
    }
};

exports.listHotels = async (req, res) => {
    try {
        const { city, keyword, star_level, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
        const where = { status: 'approved' };
        if (city) where.city = { [Op.like]: `%${city}%` };
        if (star_level != null && star_level !== '') where.star_level = Number(star_level);
        if (keyword) {
            where[Op.or] = [
                { name_cn: { [Op.like]: `%${keyword}%` } },
                { name_en: { [Op.like]: `%${keyword}%` } },
                { address: { [Op.like]: `%${keyword}%` } }
            ];
        }

        const offset = Math.max(0, (Number(page) - 1) * Math.min(Number(limit) || 20, 100));
        const limitNum = Math.min(Number(limit) || 20, 100);

        if (minPrice != null && minPrice !== '' || maxPrice != null && maxPrice !== '') {
            const roomWhere = {};
            const priceCond = {};
            if (minPrice != null && minPrice !== '') priceCond[Op.gte] = Number(minPrice);
            if (maxPrice != null && maxPrice !== '') priceCond[Op.lte] = Number(maxPrice);
            if (Object.keys(priceCond).length) roomWhere.base_price = priceCond;
            const rooms = await Room.findAll({ where: roomWhere, attributes: ['hotel_id'] });
            const hotelIds = [...new Set(rooms.map(r => r.hotel_id))];
            if (hotelIds.length === 0) return res.json({ total: 0, list: [] });
            where.id = { [Op.in]: hotelIds };
        }

        const { count, rows } = await Hotel.findAndCountAll({
            where,
            order: [['id', 'DESC']],
            offset,
            limit: limitNum,
            include: [{ model: Room, as: 'Rooms', attributes: ['id', 'type_name', 'base_price'] }]
        });

        const list = rows.map(h => {
            const j = h.toJSON();
            const rooms = (j.Rooms || []).sort((a, b) => (a.base_price || 0) - (b.base_price || 0));
            const minPriceVal = rooms.length ? Math.min(...rooms.map(r => r.base_price)) : null;
            return { ...j, Rooms: rooms, minPrice: minPriceVal };
        });
        return res.json({ total: count, list });
    } catch (e) {
        return res.status(500).json({ message: 'server error' });
    }
};

exports.getHotelDetail = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({
            where: { id: req.params.id, status: 'approved' },
            include: [{ model: Room, as: 'Rooms' }]
        });
        if (!hotel) return res.status(404).json({ message: 'hotel not found' });
        const j = hotel.toJSON();
        const rooms = (j.Rooms || []).sort((a, b) => (a.base_price || 0) - (b.base_price || 0));
        return res.json({ ...j, Rooms: rooms });
    } catch (e) {
        return res.status(500).json({ message: 'server error' });
    }
};

exports.streamPrices = (req, res) => {
    sse.subscribe(res);
};
