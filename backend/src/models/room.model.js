const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Room = sequelize.define('Room', {
    hotel_id: { type: DataTypes.INTEGER, allowNull: false },
    type_name: DataTypes.STRING,
    base_price: DataTypes.FLOAT
});

module.exports = Room;
