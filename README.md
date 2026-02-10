# 易宿酒店预订 - 用户端应用

一款基于 Taro + React + TypeScript 的轻量级酒店预订小程序，提供便捷的酒店搜索、浏览和预订体验。

## 功能特性

### 🏠 首页
- **酒店广告轮播** - 热门酒店推荐，支持跳转到详情页
- **智能搜索** - 支持多维度查询：
  - 目的地（城市/位置）
  - 关键字（酒店名称/地标）
  - 入离日期范围选择
  - 快速标签选择（亲子、豪华、免费停车）
  - **价格区间筛选**（¥0-200、¥200-500、¥500-1000、¥1000+）
  - **星级筛选**（3星、4星、5星，多选）

### 🔍 酒店列表
- **高级筛选**
  - 价格范围（可选择）
  - 星级多选
  - 标签多选（亲子、豪华、免费停车）
  - 价格排序（升序/降序）
  - 关键字搜索
- **参数联动** - 自动解析 URL 参数并应用筛选
- **无限滚动** - 加载更多酒店列表
- **筛选状态显示** - 页面头部实时显示当前筛选条件

### 🏨 酒店详情
- 酒店基本信息展示
- 房型选择与预订
- 入离日期显示
- 酒店设施介绍
- 价格计算

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **框架** | - | Taro + React |
| **语言** | - | TypeScript |
| **样式** | - | SCSS |
| **编译打包** | - | Webpack |
| **Node** | >=14 | 建议 16+ |

## 项目结构

```
easy-stay-user/
├── src/
│   ├── app.ts              # 应用入口配置
│   ├── app.scss            # 全局样式
│   ├── index.html          # HTML 模板
│   ├── components/         # 公共组件
│   │   ├── DateRangePicker/    # 日期范围选择器
│   │   ├── HotelCard/          # 酒店卡片
│   │   └── RoomCard/           # 房型卡片
│   ├── pages/              # 页面
│   │   ├── index/          # 首页（搜索）
│   │   ├── hotel-list/     # 酒店列表
│   │   └── hotel-detail/   # 酒店详情
│   └── types/              # 类型定义
│       └── hotel.ts        # 酒店类型
├── config/                 # 编译配置
├── package.json
└── tsconfig.json
```

## 安装与运行

### 环境要求
- Node.js >= 14
- npm 或 yarn

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 开发模式
```bash
# H5 开发
npm run dev:h5

# 微信小程序开发
npm run dev:weapp

# 支付宝小程序开发
npm run dev:alipay
```

### 生产构建
```bash
# H5 构建
npm run build:h5

# 微信小程序构建
npm run build:weapp

# 支付宝小程序构建
npm run build:alipay
```

## 主要功能流程

### 1. 首页搜索流程
```
首页 (index)
  ↓ 填写搜索条件
  ├─ 目的地：上海
  ├─ 关键字：豪华
  ├─ 日期：2026-02-10 - 2026-02-11
  ├─ 价格：¥200-500
  ├─ 星级：5星（多选）
  └─ 标签：亲子、豪华（多选）
  ↓
  酒店列表 (hotel-list)
  ↓ URL: ?city=上海&keyword=豪华&checkIn=2026-02-10&checkOut=2026-02-11&price=200-500&star=5&tags=亲子,豪华
```

### 2. 列表筛选流程
```
酒店列表
  ↓ 支持修改任何筛选条件
  ├─ 价格：可弹窗选择
  ├─ 星级：支持多选
  ├─ 标签：支持多选
  └─ 排序：价格升序/降序
  ↓
  实时更新查询结果
```

### 3. 详情预订流程
```
酒店列表 → 点击酒店卡片
  ↓
酒店详情 (hotel-detail)
  ├─ 显示入离日期
  ├─ 选择房型
  └─ 计算价格
```

## 数据结构

### 酒店类型 (Hotel)
```typescript
interface Hotel {
  id: string              // 酒店 ID
  name: string           // 酒店名称
  englishName?: string   // 英文名称
  address: string        // 地址
  city: string           // 城市
  star: number          // 星级 (3-5)
  openDate: string      // 开业日期
  tags: string[]        // 标签数组
  coverImage: string    // 封面图
  images: string[]      // 图片数组
  distanceDesc?: string // 距离描述
  minPrice: number      // 最低价格
  facilities: string[]  // 设施列表
  roomTypes: RoomType[] // 房型列表
}
```

## URL 参数规范

### 搜索参数
| 参数 | 类型 | 说明 | 示例 |
|------|------|------|------|
| city | string | 城市名称（需 URL 编码） | city=%E4%B8%8A%E6%B5%B7 |
| keyword | string | 搜索关键字 | keyword=%E8%B1%AA%E5%8D%8E |
| checkIn | string | 入住日期 | checkIn=2026-02-10 |
| checkOut | string | 离店日期 | checkOut=2026-02-11 |
| price | string | 价格范围 | price=200-500 |
| star | string | 星级（多选用逗号分隔） | star=3,4,5 |
| tags | string | 标签（多选用逗号分隔） | tags=%E4%BA%B2%E5%AD%90,%E8%B1%AA%E5%8D%8E |

### 参数示例
```
?city=上海&keyword=豪华&checkIn=2026-02-10&checkOut=2026-02-11&price=200-500&star=5&tags=亲子,豪华
```

## 关键特性说明

### 🔄 参数编解码
- **编码**：首页使用 `encodeURIComponent()` 对参数编码
- **解码**：列表页使用 `decodeURIComponent()` 对参数解码
- 确保中文参数正确传递

### 🎯 多选支持
- **星级**：支持同时选择多个星级（3、4、5）
- **标签**：支持同时选择多个标签
- **价格**：单选（但支持修改）
- URL 中用逗号 `,` 分隔多个值

### 📱 响应式设计
- 适配移动端屏幕尺寸
- 底部弹窗交互方式
- 流畅的动画过渡

### 🔍 实时筛选
- 修改任何筛选条件立即更新结果
- 不需要重新点击"搜索"按钮
- 价格筛选可随时修改



**最后更新**: 2026-02-10
