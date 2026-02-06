const sequelize = require('../config/db');
const User = require('./user.model');
const Hotel = require('./hotel.model');
const Room = require('./room.model');

User.hasMany(Hotel, { foreignKey: 'merchant_id' });
Hotel.belongsTo(User, { foreignKey: 'merchant_id' });

Hotel.hasMany(Room, { foreignKey: 'hotel_id' });
Room.belongsTo(Hotel, { foreignKey: 'hotel_id' });

module.exports = { sequelize, User, Hotel, Room };
