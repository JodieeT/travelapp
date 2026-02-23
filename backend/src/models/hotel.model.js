const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Hotel = sequelize.define('Hotel', {
    merchant_id: { type: DataTypes.INTEGER, allowNull: true },
    name_cn: DataTypes.STRING,
    name_en: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.STRING,
    star_level: DataTypes.INTEGER,
    open_date: DataTypes.DATEONLY,
    status: {
        type: DataTypes.ENUM('draft', 'pending', 'approved', 'rejected', 'offline'),
        defaultValue: 'draft'
    },
    reject_reason: DataTypes.STRING,
    images: { type: DataTypes.TEXT, defaultValue: '[]' },
    tags: { type: DataTypes.TEXT, defaultValue: '[]' },
    facilities: { type: DataTypes.TEXT, defaultValue: '[]' },
    is_banner: { type: DataTypes.BOOLEAN, defaultValue: false },
    banner_sort: { type: DataTypes.INTEGER, defaultValue: 0 },
    nearby_traffic: { type: DataTypes.TEXT, defaultValue: '[]' },
    nearby_attractions: { type: DataTypes.TEXT, defaultValue: '[]' }
}, { tableName: 'Hotels' });

module.exports = Hotel;
