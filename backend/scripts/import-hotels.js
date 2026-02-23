const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const INPUT_FILE = path.join(__dirname, 'hotels.json');
const IMG_DIR = path.join(__dirname, '..', 'img');

async function importHotels() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`请创建 ${INPUT_FILE} 文件`);
    process.exit(1);
  }
  const rawContent = fs.readFileSync(INPUT_FILE, 'utf-8');
  const jsonContent = rawContent.split('\n').filter(line => !line.trim().startsWith('//')).join('\n');
  const hotels = JSON.parse(jsonContent);
  console.log(`准备导入 ${hotels.length} 家酒店...`);

  let imported = 0;
  let failed = 0;

  for (const h of hotels) {
    try {
      if (!h.merchant_id) {
        console.error(`  [跳过] ${h.name_cn} - 缺少 merchant_id`);
        failed++;
        continue;
      }

      const images = [];
      if (h.imageFiles && Array.isArray(h.imageFiles)) {
        for (const imgFile of h.imageFiles) {
          const srcPath = path.join(IMG_DIR, imgFile);
          if (fs.existsSync(srcPath)) {
            images.push(`/img/${imgFile}`);
          } else {
            console.warn(`  [警告] 图片不存在: ${srcPath}`);
          }
        }
      }

      const tags = JSON.stringify(h.tags || []);
      const facilities = JSON.stringify(h.facilities || []);
      const imagesJson = JSON.stringify(images);

      const now = new Date().toISOString();
      await sequelize.query(`
        INSERT INTO Hotels (
          merchant_id, name_cn, name_en, city, address,
          star_level, open_date, status, images, tags, facilities,
          createdAt, updatedAt
        ) VALUES (
          :merchant_id, :name_cn, :name_en, :city, :address,
          :star_level, :open_date, 'draft', :images, :tags, :facilities,
          :createdAt, :updatedAt
        )
      `, {
        replacements: {
          merchant_id: h.merchant_id,
          name_cn: h.name_cn || '',
          name_en: h.name_en || '',
          city: h.city || '',
          address: h.address || '',
          star_level: h.star_level || null,
          open_date: h.open_date || null,
          images: imagesJson,
          tags,
          facilities,
          createdAt: now,
          updatedAt: now
        }
      });

      console.log(`  [成功] ${h.name_cn}`);
      imported++;
    } catch (e) {
      console.error(`  [失败] ${h.name_cn}: ${e.message}`);
      failed++;
    }
  }

  console.log(`\n完成！成功: ${imported}, 失败: ${failed}`);
  process.exit(0);
}

importHotels();
