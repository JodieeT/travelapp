# 酒店数据导入指南

## 概述

本文档说明如何将酒店图片和 JSON 配置数据导入数据库。

## 文件说明

- `backend/scripts/hotels.json` - 酒店配置数据（15家酒店）
- `backend/img/` - 酒店图片目录（26张图片）

## 导入步骤

### 1. 准备图片

将酒店图片放入 `backend/img/` 目录，文件名需与 `hotels.json` 中的 `imageFiles` 字段匹配：

```
backend/img/
├── sh1.jpg      # 上海外滩江景豪华酒店
├── sh1_2.jpg
├── sh1_3.jpg
├── sh2.jpg      # 上海陆家嘴商务酒店
├── sh3.jpg      # 上海迪士尼亲子度假酒店
├── sh3_2.jpg
...（共26张图片）
```

### 2. 修改 hotels.json（可选）

如果修改了酒店数据，确保：
- 保留文件顶部的注释（// 开头）
- JSON 格式正确

### 3. 运行导入脚本

```bash
cd backend
node scripts/import-hotels.js
```

预期输出：
```
准备导入 15 家酒店...
  [成功] 上海外滩江景豪华酒店
  [成功] 上海陆家嘴商务酒店
  ...
完成！成功: 15, 失败: 0
```

### 4. 验证导入结果

```bash
cd backend
node -e "
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './database.sqlite', logging: false });
sequelize.query('SELECT id, name_cn, city, images FROM Hotels').then(r => console.log(JSON.stringify(r[0], null, 2)));
"
```

### 5. 导入房型数据（可选）

运行房型导入脚本：

```bash
cd backend
node scripts/import-rooms.js
```

预期输出：
```
准备为 15 家酒店添加房型...
  [成功] 酒店ID 17 (5星) - 添加 6 种房型
  ...
完成！成功: 15, 失败: 0
```

房型价格根据酒店星级自动分配：
- 5星级：豪华大床房 899元 ~ 行政套房 2299元
- 4星级：标准大床房 399元 ~ 商务套房 899元
- 3星级：标准大床房 199元 ~ 家庭房 359元

### 6. 验证房型数据

```bash
cd backend
node -e "
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './database.sqlite', logging: false });
sequelize.query('SELECT h.name_cn, r.type_name, r.base_price FROM Rooms r JOIN Hotels h ON r.hotel_id = h.id LIMIT 5').then(r => console.log(JSON.stringify(r[0], null, 2)));
"
```

## 注意事项

1. **图片路径**：图片保存在 `backend/img/`，前端通过 `/img/xxx.jpg` 访问
2. **数据库状态**：导入的酒店状态为 `draft`（草稿），如需上线可能需要审核
3. **图片格式**：目前使用占位图，如需替换为真实图片，直接替换 `backend/img/` 下的文件即可
4. **房型数据**：价格基于携程等平台参考，可根据实际情况调整 `scripts/import-rooms.js`
