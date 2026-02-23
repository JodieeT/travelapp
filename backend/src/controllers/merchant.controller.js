const { Hotel, Room } = require('../models');
const { Op } = require('sequelize');
const sse = require('../services/sse.service');

function parseJsonField(val) {
    if (typeof val === 'string') {
        try { return JSON.parse(val); } catch (_) { return []; }
    }
    return Array.isArray(val) ? val : [];
}

exports.createHotel = async (req, res) => {
    try {
        const merchantId = req.user.id;
        const { name_cn, name_en, city, address, star_level, open_date, images, tags, facilities, nearby_traffic, nearby_attractions, rooms } = req.body || {};
        if (!name_cn || !address) return res.status(400).json({ message: 'name_cn and address required' });

        const hotel = await Hotel.create({
            merchant_id: merchantId,
            name_cn: name_cn || null,
            name_en: name_en || null,
            city: city || null,
            address,
            star_level: star_level != null ? Number(star_level) : null,
            open_date: open_date || null,
            images: JSON.stringify(parseJsonField(images)),
            tags: JSON.stringify(parseJsonField(tags)),
            facilities: JSON.stringify(parseJsonField(facilities)),
            nearby_traffic: JSON.stringify(parseJsonField(nearby_traffic)),
            nearby_attractions: JSON.stringify(parseJsonField(nearby_attractions)),
            is_banner: false,
            banner_sort: 0,
            status: 'draft'
        });

        const roomList = Array.isArray(rooms) ? rooms : [];
        for (const r of roomList) {
            if (r.type_name != null && r.base_price != null) {
                await Room.create({ hotel_id: hotel.id, type_name: r.type_name, base_price: Number(r.base_price) });
            }
        }

        const withRooms = await Hotel.findByPk(hotel.id, { include: [{ model: Room, as: 'Rooms' }] });
        const j = withRooms.toJSON();
        const roomsList = (j.Rooms || []).map(r => ({ id: r.id, type_name: r.type_name, base_price: r.base_price }));
        const minPrice = roomsList.length ? Math.min(...roomsList.map(r => r.base_price)) : null;
        sse.broadcastPriceUpdate({ hotelId: hotel.id, roomsList, minPrice });
        return res.status(201).json(withRooms);
    } catch (e) {
        return res.status(500).json({ message: 'server error' });
    }
};

exports.getMyHotels = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
        const offset = (page - 1) * limit;
        
        const total = await Hotel.count({ where: { merchant_id: req.user.id } });

        const rows = await Hotel.findAll({
            where: { merchant_id: req.user.id },
            order: [['id', 'DESC']],
            limit,
            offset,
            include: [{ model: Room, as: 'Rooms' }]
        });
        return res.json({
            list: rows,
            total,
            page,
            limit
        });
    } catch (e) {
        return res.status(500).json({ message: 'server error' });
    }
};

exports.getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({
            where: { id: req.params.id, merchant_id: req.user.id },
            include: [{ model: Room, as: 'Rooms' }]
        });
        if (!hotel) return res.status(404).json({ message: 'hotel not found' });
        return res.json(hotel);
    } catch (e) {
        return res.status(500).json({ message: 'server error' });
    }
};

exports.updateHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ where: { id: req.params.id, merchant_id: req.user.id } });
        if (!hotel) return res.status(404).json({ message: 'hotel not found' });
        if (hotel.status !== 'draft' && hotel.status !== 'rejected') return res.status(400).json({ message: 'only draft or rejected hotel can be edited' });

        const { name_cn, name_en, city, address, star_level, open_date, images, tags, facilities, nearby_traffic, nearby_attractions, rooms } = req.body || {};
        if (name_cn != null) hotel.name_cn = name_cn;
        if (name_en != null) hotel.name_en = name_en;
        if (city != null) hotel.city = city;
        if (address != null) hotel.address = address;
        if (star_level != null) hotel.star_level = Number(star_level);
        if (open_date != null) hotel.open_date = open_date;
        if (images !== undefined) hotel.images = JSON.stringify(parseJsonField(images));
        if (tags !== undefined) hotel.tags = JSON.stringify(parseJsonField(tags));
        if (facilities !== undefined) hotel.facilities = JSON.stringify(parseJsonField(facilities));
        if (nearby_traffic !== undefined) hotel.nearby_traffic = JSON.stringify(parseJsonField(nearby_traffic));
        if (nearby_attractions !== undefined) hotel.nearby_attractions = JSON.stringify(parseJsonField(nearby_attractions));
        await hotel.save();

        if (Array.isArray(rooms)) {
            await Room.destroy({ where: { hotel_id: hotel.id } });
            for (const r of rooms) {
                if (r.type_name != null && r.base_price != null) {
                    await Room.create({ hotel_id: hotel.id, type_name: r.type_name, base_price: Number(r.base_price) });
                }
            }
        }

        const withRooms = await Hotel.findByPk(hotel.id, { include: [{ model: Room, as: 'Rooms' }] });
        const j = withRooms.toJSON();
        const roomList = (j.Rooms || []).map(r => ({ id: r.id, type_name: r.type_name, base_price: r.base_price }));
        const minPrice = roomList.length ? Math.min(...roomList.map(r => r.base_price)) : null;
        sse.broadcastPriceUpdate({ hotelId: hotel.id, rooms: roomList, minPrice });
        return res.json(withRooms);
    } catch (e) {
        return res.status(500).json({ message: 'server error' });
    }
};

exports.submitHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ where: { id: req.params.id, merchant_id: req.user.id } });
        if (!hotel) return res.status(404).json({ message: 'hotel not found' });
        if (hotel.status !== 'draft' && hotel.status !== 'rejected') return res.status(400).json({ message: 'only draft or rejected hotel can be submitted' });

        hotel.status = 'pending';
        hotel.reject_reason = null;
        await hotel.save();
        const withRooms = await Hotel.findByPk(hotel.id, { include: [{ model: Room, as: 'Rooms' }] });
        return res.json(withRooms);
    } catch (e) {
        return res.status(500).json({ message: 'server error' });
    }
};
