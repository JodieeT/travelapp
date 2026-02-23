const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const roomTypes = {
  5: [
    { type_name: '豪华大床房', base_price: 899 },
    { type_name: '豪华双床房', base_price: 899 },
    { type_name: '江景大床房', base_price: 1199 },
    { type_name: '江景双床房', base_price: 1199 },
    { type_name: '行政大床房', base_price: 1499 },
    { type_name: '行政套房', base_price: 2299 }
  ],
  4: [
    { type_name: '标准大床房', base_price: 399 },
    { type_name: '标准双床房', base_price: 399 },
    { type_name: '高级大床房', base_price: 499 },
    { type_name: '高级双床房', base_price: 499 },
    { type_name: '商务大床房', base_price: 599 },
    { type_name: '商务套房', base_price: 899 }
  ],
  3: [
    { type_name: '标准大床房', base_price: 199 },
    { type_name: '标准双床房', base_price: 199 },
    { type_name: '舒适大床房', base_price: 259 },
    { type_name: '舒适双床房', base_price: 259 },
    { type_name: '家庭房', base_price: 359 }
  ]
};

async function importRooms() {
  const hotels = await sequelize.query('SELECT id, star_level FROM Hotels', { type: sequelize.QueryTypes.SELECT });
  
  console.log(`准备为 ${hotels.length} 家酒店添加房型...`);
  
  let imported = 0;
  let failed = 0;
  const now = new Date().toISOString();

  for (const hotel of hotels) {
    try {
      const types = roomTypes[hotel.star_level] || roomTypes[3];
      
      for (const room of types) {
        await sequelize.query(`
          INSERT INTO Rooms (hotel_id, type_name, base_price, createdAt, updatedAt)
          VALUES (:hotel_id, :type_name, :base_price, :createdAt, :updatedAt)
        `, {
          replacements: {
            hotel_id: hotel.id,
            type_name: room.type_name,
            base_price: room.base_price,
            createdAt: now,
            updatedAt: now
          }
        });
      }
      
      console.log(`  [成功] 酒店ID ${hotel.id} (${hotel.star_level}星) - 添加 ${types.length} 种房型`);
      imported++;
    } catch (e) {
      console.error(`  [失败] 酒店ID ${hotel.id}: ${e.message}`);
      failed++;
    }
  }

  console.log(`\n完成！成功: ${imported}, 失败: ${failed}`);
  process.exit(0);
}

importRooms();
