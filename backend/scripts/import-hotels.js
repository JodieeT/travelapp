const fs = require('fs');
const path = require('path');
const { sequelize } = require('./src/models');

const INPUT_FILE = path.join(__dirname, 'hotels.json');
const IMG_SOURCE_DIR = path.join(__dirname, '..', 'frontend', 'public', 'images');
const IMG_DEST_DIR = path.join(__dirname, 'img');

async function importHotels() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`请创建 ${INPUT_FILE} 文件`);
    process.exit(1);
 hotels = JSON.parse  }

  const(fs.readFileSync(INPUT_FILE, 'utf-8'));
  console.log(`准备导入 ${hotels.length} 家酒店...`);

  if (!fs.existsSync(IMG_DEST_DIR)) {
    fs.mkdirSync(IMG_DEST_DIR, { recursive: true });
  }

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
          const srcPath = path.join(IMG_SOURCE_DIR, imgFile);
          if (fs.existsSync(srcPath)) {
            const ext = path.extname(imgFile);
            const destName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
            const destPath = path.join(IMG_DEST_DIR, destName);
            fs.copyFileSync(srcPath, destPath);
            images.push(`/img/${destName}`);
          } else {
            console.warn(`  [警告] 图片不存在: ${srcPath}`);
          }
        }
      }

      const tags = JSON.stringify(h.tags || []);
      const facilities = JSON.stringify(h.facilities || []);
      const imagesJson = JSON.stringify(images);

      await sequelize.query(`
        INSERT INTO Hotels (
          merchant_id, name_cn, name_en, city, address,
          star_level, open_date, status, images, tags, facilities
        ) VALUES (
          :merchant_id, :name_cn, :name_en, :city, :address,
          :star_level, :open_date, 'draft', :images, :tags, :facilities
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
          facilities
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
